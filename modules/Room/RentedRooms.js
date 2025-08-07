const mongoose = require("mongoose");

const RentedRoomSchema = new mongoose.Schema({
    start_date: {
        type: Date,
        default: Date.now
    },
    end_date: {
        type: Date,
        required: true
    },
    token: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ["active", "notActive", "expire"],
        default: "active"
    },
    Room_Id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Room",
        required: true
    },
    Area_Id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Area",
        required: true
    },
    Customer_Id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Customer",
        required: true
    }
});

const RentedRoom = mongoose.model("RentedRoom", RentedRoomSchema);

module.exports = RoomRented;