const cron = require("node-cron");
const {
    RentalReqWillAccept,
    RentalReqWillDelete,
    RentalSubscriptLive,
    DeleteAreaLive,
    DeleteRoomLive,
    DeleteRentalLive
} = require("./services/security");

function startCronJob() {
    // Area
    cron.schedule("*/1 * * * *", async () => {
        console.log("Cron job is running...");
        try {
            await RentalReqWillAccept();
            await Promise.all([
                RentalReqWillDelete(),
                RentalSubscriptLive()
            ])
            await Promise.all([
                DeleteAreaLive(),
                DeleteRoomLive(),
            ])
            await Promise.all([
                DeleteRentalLive()
            ])
        } catch (error) {
            console.error("Cron job error:", error);
        }
    });
}

module.exports = startCronJob;

