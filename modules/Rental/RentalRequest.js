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
    }

}, { timestamps: true });

const RentalRequest = mongoose.model("RentalRequest", RentalRequestSchema);

module.exports = RentalRequest;