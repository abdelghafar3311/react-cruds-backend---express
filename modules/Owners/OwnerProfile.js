const mongoose = require("mongoose");

const ProfileSchema = new mongoose.Schema({
    name: {
        type: String,
        minLength: 3,
        maxLength: 200,
        required: true,
        trim: true
    },
    money: {
        type: Number,
        default: 0
    },
    Avatar: {
        type: String,
        required: true,
        trim: true
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
    status: {
        type: Boolean,
        default: true
    },
    description: {
        type: String,
        minLength: 6,
        trim: true
    },
    rating: {
        type: Number,
        default: 0
    },
    Owner_Id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Owner",
        required: true
    }
}, {
    timestamps: true
});

const OwnerProfile = mongoose.model("OwnerProfile", ProfileSchema);


module.exports = OwnerProfile;