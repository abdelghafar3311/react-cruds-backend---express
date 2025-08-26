const cron = require("node-cron");
const Area = require("./modules/Area/Area");
const Room = require("./modules/Room/Room");
const Rental = require("./modules/Rental/Rental");
const RentalRequest = require("./modules/Rental/RentalRequest");
const { Product } = require("./modules/Product/Product")
const { verifyRentalToken } = require("./middlewares/verifyToken");

function startCronJob() {
    // delete req rental
    cron.schedule("*/1 * * * *", async () => {
        try {
            const rentals = await RentalRequest.find({ willDelete: true });
            await Promise.all(
                rentals.map(async (rental) => {
                    const { expiresToken } = verifyRentalToken(rental.DeleteToken);
                    if (expiresToken) {
                        await RentalRequest.findByIdAndDelete(rental._id);
                    }
                })
            );
        } catch (error) {
            console.error("Cron job error:", error);
        }
    })
    // rental check
    cron.schedule("*/1 * * * *", async () => {
        try {
            const rentals = await Rental.find({ isExpires: false });
            await Promise.all(
                rentals.map(async (rental) => {
                    const { expiresToken } = verifyRentalToken(rental.expires);
                    if (expiresToken) {
                        await Rental.findByIdAndUpdate(rental._id, { $set: { isExpires: true } });
                    }
                })
            );
        } catch (error) {
            console.error("Cron job error:", error);
        }
    })
    // Area
    cron.schedule("*/1 * * * *", async () => {
        try {
            const areas = await Area.find({ isDelete: true });

            await Promise.all(
                areas.map(async (a) => {
                    const activeRentals = await Rental.find({ Area_Id: a._id, isExpires: false });
                    if (activeRentals.length === 0) {
                        const rentalIds = activeRentals.map((rental) => rental._id);
                        await Product.updateMany(
                            { rentalId: { $in: rentalIds } },
                            { $unset: { rentalId: "" } }
                        );
                        await Rental.deleteMany({ Area_Id: a._id, isExpires: true });
                        // Delete rooms associated with the area
                        await Room.deleteMany({ Area_Id: a._id });
                        // Delete the area itself
                        await Area.findByIdAndDelete(a._id);
                        console.log(`Deleted expired area: ${a._id}`);
                    }
                })
            );
        } catch (error) {
            console.error("Cron job error:", error);
        }
    });
    // Room delete
    cron.schedule("*/1 * * * *", async () => {
        try {
            const rooms = await Room.find({ isDelete: true });

            await Promise.all(
                rooms.map(async (a) => {
                    const activeRentals = await Rental.find({ Room_Id: a._id, isExpires: false });

                    if (activeRentals.length === 0) {
                        const rentalIds = activeRentals.map((rental) => rental._id);
                        await Product.updateMany(
                            { rentalId: { $in: rentalIds } },
                            { $unset: { rentalId: "" } }
                        );
                        await Rental.deleteMany({ Room_id: a._id });
                        // Delete the room itself
                        await Room.findByIdAndDelete(a._id);
                        console.log(`Deleted expired room: ${a._id}`);
                    }
                })
            );
        } catch (error) {
            console.error("Cron job error:", error);
        }
    });

    // Rental delete
    cron.schedule("*/1 * * * *", async () => {
        try {
            const rentals = await Rental.find({ isDelete: true });

            await Promise.all(
                rentals.map(async (a) => {
                    const activeRentals = await Rental.exists({ isExpires: false, _id: a._id });

                    if (!activeRentals) {
                        // Delete the rental itself
                        await Rental.findByIdAndDelete(a._id);
                        console.log(`Deleted expired rental: ${a._id}`);
                    }
                })
            );
        } catch (error) {
            console.error("Cron job error:", error);
        }
    });
}

module.exports = startCronJob;

