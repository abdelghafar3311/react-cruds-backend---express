const mongoose = require("mongoose");

const RentalRequestSchema = new mongoose.Schema({
    time: {
        type: String,
        required: true
    },
    pay: {
        type: Number,
        min: 1,
        required: true
    },
    Rental_Id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Rented",
        required: true
    },
    Customer_Id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Customer",
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
    willDelete: {
        type: Boolean,
        default: false
    },
    DeleteToken: {
        type: String
    },
    status: {
        type: String,
        enum: ["pending", "reject"],
        default: "pending"
    }

}, { timestamps: true });

const RentalRequest = mongoose.model("RentalRequest", RentalRequestSchema);

module.exports = RentalRequest;