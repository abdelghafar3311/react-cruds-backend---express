const mongoose = require("mongoose");

const RoomSchema = new mongoose.Schema({
    nameRoom: {
        type: String,
        minLength: 2,
        maxLength: 200,
        required: true,
        trim: true
    },
    NumberRoom: {
        type: Number,
        required: true
    },
    status: {
        type: Boolean,
        default: false
    },
    length: { // length of the room in meters
        type: Number,
        min: 1,
        max: 100,
        default: 5
    },
    width: {
        type: Number,
        min: 1,
        max: 100,
        default: 4
    }
    ,
    description: {
        type: String,
        trim: true
    },
    price: {
        type: Number,
        min: 1
    },
    Discount: {
        type: Number,
        default: 0
    },
    Duration: {
        type: String,
        enum: ["y", "M", "d", "h", "w", "m", "s"],
        default: "M"
    },
    isUsed: {
        type: Boolean,
        default: false
    },
    Area_Id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Area",
        required: true
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    Owner_Id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Owner",
        required: true
    }
}, {
    timestamps: true
});

// make number unique in one Area
RoomSchema.index({ NumberRoom: 1, Area_Id: 1 }, { unique: true });
// Room model
const Room = mongoose.model("Room", RoomSchema);

module.exports = Room;