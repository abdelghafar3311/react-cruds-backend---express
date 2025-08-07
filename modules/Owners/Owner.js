const mongoose = require("mongoose");

const OwnerSchema = new mongoose.Schema({
    username: {
        type: String,
        minLength: 3,
        maxLength: 200,
        required: true,
        trim: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        minLength: 3,
        maxLength: 200,
        trim: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minLength: 6,
        trim: true
    }
}, {
    timestamps: true
});

const Owner = mongoose.model("Owner", OwnerSchema);

module.exports = Owner;