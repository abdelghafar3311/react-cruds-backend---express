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
    size: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    price: {
        type: Number,
        required: true,
        min: 1
    },
    Area_Id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Area",
        required: true
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