const mongoose = require("mongoose");
// schema
const CustomerSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        minLength: 3,
        maxLength: 200,
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
    },
    money: {
        type: Number,
        default: 0
    },
    sells: {
        type: Number,
        min: 0,
        default: 0
    },
    buys: {
        type: Number,
        min: 0,
        default: 0
    }
    // Area type id of Area data base
}, { timestamps: true });

const Customer = mongoose.model("Customer", CustomerSchema)


module.exports = {
    Customer
}