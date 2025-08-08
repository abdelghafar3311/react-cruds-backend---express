const mongoose = require("mongoose");

const ProfileSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        minLength: 2,
        maxLength: 200,
        required: true
    },
    Avatar: {
        type: String,
        default: "images/customer.png"
    },
    phone: {
        type: String,
        minLength: 10,
        maxLength: 15,
        trim: true
    },
    address: {
        type: String,
        trim: true
    },
    description: {
        type: String
    },
    Customer_Id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Customer",
        required: true
    }
}, {
    timestamps: true
});

const CustomerProfile = mongoose.model("CustomerProfile", ProfileSchema);

module.exports = CustomerProfile;