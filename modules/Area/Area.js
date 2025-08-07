const mongoose = require("mongoose");

const AreaSchema = new mongoose.Schema({
    nameArea: {
        type: String,
        minLength: 2,
        maxLength: 200,
        required: true,
        trim: true
    },
    address: {
        type: String,
        minLength: 2,
        maxLength: 400,
        required: true,
        trim: true
    },
    status: {
        type: Boolean,
        default: false
    },
    maxRooms: {
        type: Number,
        min: 1,
        required: true
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

const Area = mongoose.model("Area", AreaSchema);

module.exports = Area