const { verifyToken, verifyDeleteToken } = require("../verifyToken");

const { validateAreaPOST, validateAreaPUT, validateAlarmMessage } = require("../../validations/area.valid");
const Area = require("../../modules/Area/Area");
const Owner = require("../../modules/Owners/Owner");
// const Room = require("../../modules/Room/Room");
const mongoose = require("mongoose");
const { LIMIT_AREA, LIMIT_ROOMS } = require("../../values/env");

// @method POST

const verifyAreaPOST = async (req, res, next) => {
    verifyToken(req, res, async () => {
        try {
            // validate area
            const { error } = validateAreaPOST(req.body);
            if (error) {
                return res.status(400).json({ message: error.details[0].message });
            }

            // check owner
            const owner = await Owner.findById(req.owner.id);
            if (!owner) {
                return res.status(404).json({ message: "Owner not found" });
            }

            // check area limit
            const areasCount = await Area.countDocuments({ Owner_Id: req.owner.id });
            if (areasCount >= LIMIT_AREA) {
                return res.status(403).json({ message: "You have reached the limit of 5 areas." });
            }

            // check rooms limit
            if (req.body.maxRooms && req.body.maxRooms > LIMIT_ROOMS) {
                return res.status(400).json({ message: `Maximum number of rooms is ${LIMIT_ROOMS}.` });
            }

            req.areaData = { ...req.body, Owner_Id: req.owner.id };
            next();
        } catch (error) {
            console.error("Middleware error:", error);
            return res.status(500).json({ message: "Internal server error" });
        }
    });
}


// @method PUT
const verifyAreaPUT = async (req, res, next) => {
    verifyToken(req, res, async () => {
        try {
            // validate area
            const { error } = validateAreaPUT(req.body);
            if (error) {
                return res.status(400).json({ message: error.details[0].message });
            }

            // check id validity
            if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
                return res.status(400).json({ message: "Invalid area ID." });
            }

            // check area exists
            const area = await Area.findById(req.params.id);
            if (!area) {
                return res.status(404).json({ message: "Area not found" });
            }

            // check owner
            if (area.Owner_Id.toString() !== req.owner.id) {
                return res.status(403).json({ message: "You are not allowed to update this area." });
            }

            // check rooms limit
            if (req.body.maxRooms && req.body.maxRooms > LIMIT_ROOMS) {
                return res.status(400).json({ message: `Maximum number of rooms is ${LIMIT_ROOMS}.` });
            }

            req.areaData = { ...req.body };
            next();
        } catch (error) {
            console.error("Middleware error:", error);
            return res.status(500).json({ message: "Internal server error" });
        }
    });
}

// get all areas of owner verify
const verifyGetAllAreas = async (req, res, next) => {
    verifyToken(req, res, async () => {
        try {
            // check owner
            const owner = await Owner.findById(req.owner.id);
            if (!owner) {
                return res.status(404).json({ message: "Owner not found" });
            }
            next();
        } catch (error) {
            console.error("Middleware error:", error);
            return res.status(500).json({ message: "Internal server error" });
        }
    });
}

// patch token in area which delete

const verifyAreaWillDelete = async (req, res, next) => {
    verifyToken(req, res, async () => {
        try {
            // check id validity
            if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
                return res.status(400).json({ message: "Invalid area ID." });
            }

            // check area exists
            const area = await Area.findById(req.params.id);
            if (!area) {
                return res.status(404).json({ message: "Area not found" });
            }

            // check owner
            if (area.Owner_Id.toString() !== req.owner.id) {
                return res.status(403).json({ message: "You are not allowed to delete this area." });
            }

            // check area is alarm
            if (area.isDeleted) {
                return res.status(200).json({ message: "area is auto delete when the users expired rentals" });
            }
            req.areaData = area;
            next();
        } catch (error) {
            console.error("Middleware error:", error);
            return res.status(500).json({ message: "Internal server error" });
        }
    });
}

module.exports = {
    verifyAreaPOST,
    verifyAreaPUT,
    verifyGetAllAreas,
    verifyAreaWillDelete
};