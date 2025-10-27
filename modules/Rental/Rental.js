const mongoose = require("mongoose");

const RentedSchema = new mongoose.Schema({
    startDate: {
        type: Date,
        default: Date.now
    },
    endDate: {
        type: String,
    },
    expires: {
        type: String,
    },
    subscriptionState: {
        type: String,
        enum: ["active", "expired", "pending"],
        default: "pending"
    },
    pay: {
        type: Number,
        min: 1,
    }, isDeleted: {
        type: Boolean,
        default: false
    },
    isAccept: {
        type: String,
        enum: ["pending", "accept", "reject"],
        default: "pending"
    }, rejectToken: {
        type: String
    },
    Area_Id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Area",
        required: true
    },
    Room_Id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Room",
        required: true
    },
    Owner_Id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Owner",
        required: true
    },
    Customer_Id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Customer",
        default: null
    }
});

RentedSchema.pre("findOneAndDelete", async function (next) {
    try {
        const rentalId = this.getQuery()["_id"];
        if (rentalId) {
            await mongoose.model("Product").updateMany(
                { rentalId: rentalId },
                { $unset: { rentalId: "" } }
            );
        }
        next();
    } catch (err) {
        next(err);
    }
});

const Rented = mongoose.model("Rented", RentedSchema);

module.exports = Rented;