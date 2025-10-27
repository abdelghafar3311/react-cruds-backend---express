const cron = require("node-cron");
const {
    RentalReqWillAccept,
    RentalReqWillDelete,
    RentalSubscriptLive,
    DeleteAreaLive,
    DeleteRoomLive,
    DeleteRentalLive,
    DeleteOwnerAccountLive,
    TransNotifiesFromReadToDelete,
    DeleteNotifyWillDelete
} = require("./services/security");

function startCronJob() {
    // Area
    cron.schedule("*/1 * * * *", async () => {
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
                DeleteRentalLive(),
                DeleteOwnerAccountLive()
            ])
            await Promise.all([
                TransNotifiesFromReadToDelete(),
                DeleteNotifyWillDelete()
            ])
        } catch (error) {
            console.error("Cron job error:", error);
        }
    });
}

module.exports = startCronJob;

