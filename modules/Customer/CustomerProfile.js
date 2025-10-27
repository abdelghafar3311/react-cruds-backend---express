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
        default: "https://raw.githubusercontent.com/abdelghafar3311/upload_images_express_curds/main/uploads/1758208200002-avatar.png"
    },
    phone: {
        type: String,
        minLength: 10,
        maxLength: 15,
        trim: true,
        required: false
    },
    address: {
        type: String,
        trim: true
    },
    description: {
        type: String
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

const CustomerProfile = mongoose.model("CustomerProfile", ProfileSchema);

module.exports = CustomerProfile;