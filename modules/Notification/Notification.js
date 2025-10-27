const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const notificationSchema = new Schema({
    notifyType: {
        type: String,
        enum: ["info", "warn", "err", "suc"],
        required: true
    },
    notifyTitle: {
        type: String,
        required: true
    },
    notifyMessage: {
        type: String,
        required: true
    },
    User_Type: {
        type: String,
        required: true,
        enum: ["Owner", "Customer"]
    },
    User_Id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        refPath: "User_Type"
    },
    isRead: {
        type: Boolean,
        default: false
    },
    TokenIsRead: {
        type: String
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    TokenIsDeleted: {
        type: String
    },
    DateWillDelete: {
        type: String
    }
}, {
    timestamps: true
});

notificationSchema.index({ User_Id: 1, User_Type: 1 });

const Notification = mongoose.model("Notification", notificationSchema);
module.exports = Notification;
