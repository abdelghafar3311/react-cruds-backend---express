const mongoose = require("mongoose");
const Joi = require("joi");
// mongoose schema
const ProductSchema = new mongoose.Schema({
    nameProduct: {
        type: String,
        minLength: 2,
        maxLength: 200,
        trim: true,
        required: true
    },
    category: {
        type: String,
        minLength: 2,
        maxLength: 200,
        trim: true,
        required: true
    },
    count: {
        type: Number,
        min: 1,
        default: 1
    },
    price: {
        type: Number,
        min: 1,
        required: true
    },
    taxes: {
        type: Number,
        min: 0,
        default: 0
    },
    ads: {
        type: Number,
        min: 0,
        default: 0
    },
    gain: {
        type: Number,
        min: 1,
        required: true
    },
    discount: {
        type: Number,
        min: 0,
        default: 0
    },
    customer_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Customer",
        required: true
    }, Rental_Id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Rental",
        required: false
    }
}, { timestamps: true })
// this make name product is unique only in the same customer
ProductSchema.index({ nameProduct: 1, customer_id: 1 }, { unique: true })
// create module in mongoDB
const Product = mongoose.model("Product", ProductSchema);

module.exports = {
    Product
}