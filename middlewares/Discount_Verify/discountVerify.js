const { verifyToken } = require("../verifyToken")
// validations
const { validPostDiscount, validPutDiscount } = require("../../validations/Discount.valid");
// modules
const Discount = require("../../modules/Discount/Discount");
const Owner = require("../../modules/Owners/Owner");
const Room = require("../../modules/Room/Room");
const Area = require("../../modules/Area/Area");
const mongoose = require("mongoose");
// verify post Discount
const VerifyPostDiscount = async (req, res, next) => {
    verifyToken(req, res, async () => {
        try {
            // check valid
            const { error, value } = validPostDiscount(req.body);
            if (error) {
                return res.status(400).json({ message: error.details[0].message });
            }
            req.body = value;
            // check owner
            const owner = await Owner.findById(req.owner.id);
            if (!owner) {
                return res.status(403).json({ message: "You are not allowed to post an Discount, please sign in first." });
            }
            // check room
            if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
                return res.status(400).json({ message: "Invalid room ID." });
            }
            const room = await Room.findById(req.params.id);
            if (!room) {
                return res.status(404).json({ message: "Room not found" });
            }
            if (room.Owner_Id.toString() !== owner._id.toString()) {
                return res.status(403).json({ message: "You are not allowed to post an Discount for this room" });
            }
            if (room.isDeleted) {
                return res.status(403).json({ message: "Room will delete" });
            }
            if (room.price < 50) {
                return res.status(400).json({ message: "Room price must be greater than 50" });
            }
            if (room.price <= req.body.new_price) {
                return res.status(400).json({ message: "New price must be greater than room price" });
            }
            // check area
            const area = await Area.findById(room.Area_Id);
            if (!area) {
                return res.status(404).json({ message: "Area not found" });
            }
            if (area.isDeleted) {
                return res.status(403).json({ message: "Area will delete" });
            }
            // check Discounts
            const Discounts = await Discount.findOne({ Room_Id: req.params.id });
            if (Discounts) {
                return res.status(400).json({ message: "Discount already exists for this room" });
            }
            // attach to request
            req.room = room;
            req.ownerId = owner._id;
            next();
        } catch (error) {
            console.error("middleware error:", error);
            return res.status(500).json({ message: "Internal server error", error: error.message });
        }
    })
}

// get all Discounts
const verifyGetAllDiscounts = async (req, res, next) => {
    verifyToken(req, res, async () => {
        try {
            // check owner
            const owner = await Owner.findById(req.owner.id);
            if (!owner) {
                return res.status(404).json({ message: "Owner not found" });
            }

            next();
        } catch (error) {
            console.error("middleware error:", error);
            return res.status(500).json({ message: "Internal server error", error: error.message });
        }
    })
}

// verify put Discount
const VerifyPutDiscount = async (req, res, next) => {
    verifyToken(req, res, async () => {
        try {
            // check valid
            const { error, value } = validPutDiscount(req.body);
            if (error) {
                return res.status(400).json({ message: error.details[0].message });
            }
            req.body = value;
            // check Discount
            if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
                return res.status(400).json({ message: "Invalid Discount ID." });
            }
            const Discount = await Discount.findById(req.params.id);
            if (!Discount) {
                return res.status(404).json({ message: "Discount not found" });
            }
            if (Discount.Owner_Id.toString() !== req.owner.id) {
                return res.status(403).json({ message: "You are not allowed to update this Discount" });
            }
            // check room money
            const room = await Room.findById(Discount.Room_Id);
            if (room.price <= req.body.new_price) {
                return res.status(400).json({ message: "New price must be greater than room price" });
            }
            // attach to request
            req.DiscountId = Discount._id;

            next();
        } catch (error) {
            console.error("middleware error:", error);
            return res.status(500).json({ message: "Internal server error", error: error.message });
        }
    })
}

// verify Delete Discount
const VerifyDeleteDiscount = async (req, res, next) => {
    verifyToken(req, res, async () => {
        try {
            // check Discount
            if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
                return res.status(400).json({ message: "Invalid Discount ID." });
            }
            const Discount = await Discount.findById(req.params.id);
            if (!Discount) {
                return res.status(404).json({ message: "Discount not found" });
            }
            if (Discount.Owner_Id.toString() !== req.owner.id) {
                return res.status(403).json({ message: "You are not allowed to delete this Discount" });
            }
            // attach to request
            req.DiscountId = Discount._id;

            next();
        } catch (error) {
            console.error("middleware error:", error);
            return res.status(500).json({ message: "Internal server error", error: error.message });
        }
    })
}

module.exports = {
    VerifyPostDiscount,
    verifyGetAllDiscounts,
    VerifyPutDiscount,
    VerifyDeleteDiscount
}