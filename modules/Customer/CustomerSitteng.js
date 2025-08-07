const mongoose = require("mongoose");

const SittingSchema = new mongoose.Schema({
    showProducts: {
        type: Boolean,
        default: false
    },
    showMoney: {
        type: Boolean,
        default: false
    },
    auto_renew_rentals: {
        type: Boolean,
        default: false
    },
    login_fails: {
        type: Number,
        default: 3
    },
    status: {
        type: Boolean,
        default: true
    },
    Customer_Id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Customer",
        required: true
    }
}, {
    timestamps: true
});

const SittingCustomer = mongoose.model("SittingCustomer", Sitting);

module.exports = SittingCustomer;