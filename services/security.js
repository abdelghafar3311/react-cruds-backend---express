// here securities checking cron server
// modules
const Area = require("../modules/Area/Area");
const Room = require("../modules/Room/Room");
const Rental = require("../modules/Rental/Rental");
const RentalRequest = require("../modules/Rental/RentalRequest");
const { Product } = require("../modules/Product/Product");
const mongoose = require("mongoose");
// middlewares
const { verifyRentalToken } = require("../middlewares/verifyToken");
const { CreateTokenRental } = require("../middlewares/Token");

// security cron job
// check req rental will accept but has rental is pending
const RentalReqWillAccept = async () => {
    try {
        const acceptRentals = await Rental.find({ isAccept: "accept" });

        for (const rental of acceptRentals) {
            const room = await Room.findById(rental.Room_Id);
            if (!room) return await Rental.findByIdAndDelete(rental._id);
            const pendingRentals = await Rental.find({ Room_Id: room._id, isAccept: "pending" });
            for (const pendingRental of pendingRentals) {
                const token = CreateTokenRental(
                    {
                        room: pendingRental.Room_Id,
                        customer: pendingRental.Customer_Id,
                        owner: pendingRental.Owner_Id,
                        area: pendingRental.Area_Id
                    },
                    "2m"
                );

                await RentalRequest.updateMany(
                    { Rental_Id: pendingRental._id },
                    { $set: { willDelete: true, DeleteToken: token } }
                );


                await Rental.updateMany({ _id: pendingRental._id }, {
                    $set: {
                        isAccept: "reject",
                        rejectToken: token
                    }
                });

                console.log("update will delete id: ", pendingRental._id);
            }
        }
    } catch (error) {
        console.error("rental request for get accept rental error: ", error);
    }
};

// delete req rental
const RentalReqWillDelete = async () => {
    try {
        const rentals = await RentalRequest.find({ willDelete: true });
        await Promise.all(
            rentals.map(async (rental) => {
                const { isValid } = verifyRentalToken(rental.DeleteToken);
                if (!isValid) {
                    // update room to null
                    await Room.updateMany({ _id: rental.Room_Id }, { $set: { RentalType: "null" } });
                    await RentalRequest.findByIdAndDelete(rental._id);
                    await Rental.findByIdAndDelete(rental.Rental_Id);
                    return console.log("delete req rental id:", rental._id);
                }
            })
        );
    } catch (error) {
        return console.error("rental request for delete error: ", error);
    }
}


// check rental subscription
const RentalSubscriptLive = async () => {
    try {
        const rentals = await Rental.find({ subscriptionState: "active" });
        await Promise.all(
            rentals.map(async (rental) => {
                const { isValid } = verifyRentalToken(rental.expires);
                if (!isValid) {
                    await Rental.findByIdAndUpdate(rental._id, { $set: { subscriptionState: "expired" } });
                    // update room to expire
                    await Room.updateOne({ _id: rental.Room_Id }, { $set: { RentalType: "expire" } });
                    return console.log("update expired id: ", rental._id);
                }
            })
        );
    } catch (error) {
        return console.error("Subscription Update error: ", error);
    }
}

// delete expired area
const DeleteAreaLive = async () => {
    try {
        const areas = await Area.find({ isDeleted: true });

        await Promise.all(
            areas.map(async (a) => {
                const activeRentals = await Rental.find({ Area_Id: a._id, subscriptionState: "active" });
                if (activeRentals.length === 0) {
                    const rentalIds = activeRentals.map((rental) => rental._id);
                    await Product.updateMany(
                        { rentalId: { $in: rentalIds } },
                        { $unset: { rentalId: "" } }
                    );
                    await Rental.deleteMany({ Area_Id: a._id, subscriptionState: { $in: ["expired", "pending"] } });
                    // Delete rooms associated with the area
                    await Room.deleteMany({ Area_Id: a._id });
                    // Delete the area itself
                    await Area.findByIdAndDelete(a._id);
                    return console.log(`Deleted expired area: ${a._id}`);
                }
            })
        );
    } catch (error) {
        return console.error("Delete Area error: ", error);
    }
}

// delete expired room
const DeleteRoomLive = async () => {
    try {
        const rooms = await Room.find({ isDeleted: true });

        await Promise.all(
            rooms.map(async (a) => {
                const activeRentals = await Rental.find({ Room_Id: a._id, subscriptionState: "active" });

                if (activeRentals.length === 0) {
                    const rentalIds = activeRentals.map((rental) => rental._id);
                    await Product.updateMany(
                        { rentalId: { $in: rentalIds } },
                        { $unset: { rentalId: "" } }
                    );
                    await Rental.deleteMany({ Room_id: a._id });
                    // -1 in max rooms in area
                    await Area.updateOne({ _id: a.Area_Id }, { $inc: { maxRooms: -1 } });
                    // Delete the room itself
                    await Room.findByIdAndDelete(a._id);
                    return console.log(`Deleted expired room: ${a._id}`);
                }
            })
        );
    } catch (error) {
        return console.error("Delete Room error: ", error);
    }
}

// delete expired rental will delete
const DeleteRentalLive = async () => {
    try {
        const rentals = await Rental.find({ isDeleted: true });
        await Promise.all(
            rentals.map(async (a) => {
                const activeRentals = await Rental.exists({ subscriptionState: "active", _id: a._id });

                if (!activeRentals) {
                    // Delete the rental itself
                    await Rental.findByIdAndDelete(a._id);
                    return console.log(`Deleted expired rental: ${a._id}`);
                }
            })
        );
    } catch (error) {
        return console.error("Delete Rental error: ", error);
    }
}

module.exports = {
    RentalReqWillAccept,
    RentalReqWillDelete,
    RentalSubscriptLive,
    DeleteAreaLive,
    DeleteRoomLive,
    DeleteRentalLive
}