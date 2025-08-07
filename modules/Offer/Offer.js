const mongoose = require("mongoose");

const OfferSchema = new mongoose.Schema({
    hasCode: {
        type: Boolean,
        default: false
    },
    Code: {
        type: String,
        minLength: 3,
        maxLength: 36,
        trim: true
    },
    old_price: {
        type: Number,
        min: 1,
        required: true
    },
    new_price: {
        type: Number,
        min: 0,
        required: true
    },
    token: {
        type: String,
        required: true
    },
    limit: {
        type: Number,
        required: true,
        min: 1
    },
    start_date: {
        type: Date,
        default: Date.now
    },
    end_date: {
        type: Date,
        required: true
    },
    Owner_Id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Owner",
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
    }
});

const Offer = mongoose.model("Offer", OfferSchema);

module.exports = Offer;