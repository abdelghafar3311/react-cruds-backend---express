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
        max: 8, // limit of rooms
        required: true
    },
    rating: {
        type: Number,
        default: 0
    },
    // here alarms
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

AreaSchema.index({ nameArea: 1, Owner_Id: 1 }, { unique: true });

const Area = mongoose.model("Area", AreaSchema);

module.exports = Area