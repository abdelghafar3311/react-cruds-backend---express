const express = require("express");
const router = express.Router();

// middlewares
const { verifyGetNotifies, verifyArrayNotify } = require("../../middlewares/NotificationVerfy/notify_verify")
// controllers
const {
    GetAllNotifyControllers,
    ReadNotifiesControllers,
    DeleteNotifiesControllers
} = require("../../controllers/Notification/notify.controllers");


router.get("/get", verifyGetNotifies, GetAllNotifyControllers);
router.patch("/read", verifyArrayNotify, ReadNotifiesControllers);
router.patch("/delete", verifyArrayNotify, DeleteNotifiesControllers);

module.exports = router;