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
    length: {
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
    }, isUsed: {
        type: Boolean,
        default: false
    },
    Area_Id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Area",
        required: true
    },
    isAlarm: {
        type: Boolean,
        default: false
    },
    AlarmMessage: {
        type: String,
        default: ""
    }, AlarmToken: {
        type: String,
        default: ""
    }, AlarmDate: {
        type: Date
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