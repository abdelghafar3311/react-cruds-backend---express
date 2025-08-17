const mongoose = require("mongoose");

const RentedSchema = new mongoose.Schema({
    startDate: {
        type: Date,
        default: Date.now
    },
    endDate: {
        type: Date,
        required: true
    },
    token: { // the token is the same token in RoomRented module
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ["active", "notActive", "expire"],
        default: "notActive"
    },
    pay: {
        type: Number,
        min: 1,
        required: true
    },
    Area_Id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Area",
        required: true
    },
    Room_Id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Room",
        required: true
    },
    Owner_Id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Owner",
        required: true
    },
    Customer_Id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Customer",
        required: true
    }
});

const Owner_Rented = mongoose.model("Rented", RentedSchema);

module.exports = Owner_Rented;