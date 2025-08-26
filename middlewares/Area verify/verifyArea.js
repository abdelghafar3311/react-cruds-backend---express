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
            // values
            let msa;
            let time = "5m";
            // validate area
            const { error, value } = validateAlarmMessage(req.body);
            if (error) {
                return res.status(400).json({ message: error.details[0].message });
            }
            req.body = value;
            console.log("req.body", req.body);
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
            if (area.isAlarm) {
                return res.status(200).json({ message: "area is auto delete when the time is expired" });
            }

            msa = "! This area will be deleted !";


            // check time send or no 
            if (req.body.timeNumber && req.body.timeType) {
                const timeNumber = req.body.timeNumber;
                const timeType = req.body.timeType;

                time = `${timeNumber}${timeType}`;
            }

            req.msa = req.body.AlarmMessage || msa;
            req.time = time;
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