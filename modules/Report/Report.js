const mongoose = require("mongoose");
const Joi = require("joi");

// schema
const ReportSchema = new mongoose.Schema({
    report_for: {
        type: String,
        enum: ["sells", "buys"],
        required: true
    },
    money_push: {
        type: Number,
        min: 0,
        required: true
    },
    customer_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Customer",
        required: true
    },
    product_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true
    }
}, { timestamps: true });

// module
const Report = mongoose.model("Report", ReportSchema);



module.exports = {
    Report
}