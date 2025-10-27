// here securities checking cron server
// modules
const Area = require("../modules/Area/Area");
const Room = require("../modules/Room/Room");
const Rental = require("../modules/Rental/Rental");
const RentalRequest = require("../modules/Rental/RentalRequest");
const { Product } = require("../modules/Product/Product");
const OwnerProfile = require("../modules/Owners/OwnerProfile");
const Owner = require("../modules/Owners/Owner");
const Notification = require("../modules/Notification/Notification");
// middlewares
const { verifyRentalToken, verifyNotifyReadToken, verifyNotifyDeleteToken } = require("../middlewares/verifyToken");
const { CreateTokenRental, CreateDeleteToken } = require("../middlewares/Token");
// add time date
const addTimeToDate = require("../services/addTimeToDate");
// security cron job
// check req rental will accept but has rental is pending
const RentalReqWillAccept = async () => {
    try {
        const acceptRentals = await Rental.find({ isAccept: "accept" });

        for (const rental of acceptRentals) {
            // get room
            const room = await Room.findById(rental.Room_Id);
            if (!room) return await Rental.findByIdAndDelete(rental._id);
            const token = CreateTokenRental(
                {
                    room: rental.Room_Id,
                    owner: rental.Owner_Id,
                    area: rental.Area_Id
                },
                "3h"
            );

            const updatedDocs = await RentalRequest.find(
                { Rental_Id: rental._id, willDelete: false, status: "pending" }
            );

            await RentalRequest.updateMany(
                { Rental_Id: rental._id, willDelete: false, status: "pending" },
                { $set: { willDelete: true, DeleteToken: token, status: "rejected" } }
            );

            updatedDocs.length > 0 && console.log("Updated Docs IDs:", updatedDocs.map(doc => doc._id));

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
                    // await Room.updateMany({ _id: rental.Room_Id }, { $set: { RentalType: "null" } });
                    await RentalRequest.deleteOne({ _id: rental._id });
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
                    const room = await Room.updateOne({ _id: rental.Room_Id }, { $set: { RentalType: "expire" } });
                    // create notify for customer and owner
                    const notifyCustomer = new Notification({
                        notifyType: "info",
                        notifyTitle: "Rental Expired",
                        notifyMessage: `${room.nameRoom} is expired`,
                        User_Id: rental.Customer_Id,
                        User_Type: "Customer"
                    });
                    const notifyOwner = new Notification({
                        notifyType: "info",
                        notifyTitle: "Rental Expired",
                        notifyMessage: `${room.nameRoom} is expired`,
                        User_Id: rental.Owner_Id,
                        User_Type: "Owner"
                    });
                    await notifyCustomer.save();
                    await notifyOwner.save();
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
                    await Area.deleteOne({ _id: a._id });
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
                    await Room.deleteOne({ _id: a._id });
                    return console.log(`Deleted expired room: ${a._id}`);
                }
            })
        );
    } catch (error) {
        return console.error("Delete Room error: ", error);
    }
}

// Delete Owner Account
const DeleteOwnerAccountLive = async () => {
    try {
        const ownersProfile = await OwnerProfile.find({ isDeleted: true });
        await Promise.all(
            ownersProfile.map(async (a) => {
                const rentals = await Rental.exists({ Owner_Id: a.Owner_Id, subscriptionState: "active" });

                if (!rentals) {
                    // Delete the owner itself
                    // Delete Rental Request
                    await RentalRequest.deleteMany({ Owner_Id: a.Owner_Id });
                    // Delete Rentals
                    await Rental.deleteMany({ Owner_Id: a.Owner_Id });
                    // Delete Area
                    await Area.deleteMany({ Owner_Id: a.Owner_Id });
                    // Delete Rooms
                    await Room.deleteMany({ Owner_Id: a.Owner_Id });
                    // delete owner
                    await Owner.deleteOne({ _id: a.Owner_Id });
                    // delete owner profile
                    await OwnerProfile.deleteOne({ _id: a._id });
                    return console.log(`Deleted owner Account: ${a.Owner_Id}`);
                }
            })
        )
    } catch (error) {
        return console.error("Delete Owner error: ", error);
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
                    await Rental.deleteOne({ _id: a._id });
                    return console.log(`Deleted expired rental: ${a._id}`);
                }
            })
        );
    } catch (error) {
        return console.error("Delete Rental error: ", error);
    }
}

// make notifications finished read to delete active
const TransNotifiesFromReadToDelete = async () => {
    try {
        // get all notifies have isRead true and isDeleted false
        const notifies = await Notification.find({ isRead: true, isDeleted: false });
        await Promise.all(
            notifies.map(async (notify) => {
                // verify token
                const { isValid } = verifyNotifyReadToken(notify.TokenIsRead);
                if (!isValid) {
                    // update isDeleted to true and create token
                    const token = CreateDeleteToken({ id: notify.User_Id }, "3d");
                    const { result, error } = addTimeToDate(new Date(), "3d");
                    if (error) {
                        console.error(`Date error for notify ${notify._id}:`, error);
                        return;
                    }
                    await Notification.updateOne(
                        { _id: notify._id },
                        {
                            $set: {
                                isDeleted: true,
                                TokenIsDeleted: token,
                                DateWillDelete: result
                            }
                        }
                    );
                    return console.log(`Deleted notify: ${notify._id} in date: ${result}`);
                }

            })
        )
    } catch (error) {
        return console.error("Delete notify error: ", error);
    }
}

// Delete Notification expire Toke in Delete
const DeleteNotifyWillDelete = async () => {
    try {
        const notifications = await Notification.find({ isDeleted: true });
        await Promise.all(
            notifications.map(async (notify) => {
                const { isValid } = verifyNotifyDeleteToken(notify.TokenIsDeleted);
                if (!isValid) {
                    await Notification.deleteOne({ _id: notify._id });
                    return console.log(`Deleted notify: ${notify._id}`);
                }
            })
        );
    } catch (error) {
        return console.error("Delete notify error: ", error);
    }
}

module.exports = {
    RentalReqWillAccept,
    RentalReqWillDelete,
    RentalSubscriptLive,
    DeleteAreaLive,
    DeleteRoomLive,
    DeleteRentalLive,
    DeleteOwnerAccountLive,
    TransNotifiesFromReadToDelete,
    DeleteNotifyWillDelete
}