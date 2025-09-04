const { verifyToken } = require("../verifyToken");
const { validUpdateRoom, validCreateRoom } = require("../../validations/room.valid");
// modules
const Owner = require("../../modules/Owners/Owner");
const Room = require("../../modules/Room/Room");
const Area = require("../../modules/Area/Area");
const { Customer } = require("../../modules/Customer/Customer_Module");
const mongoose = require("mongoose");
// env
const { LIMIT_ROOMS } = require("../../values/env");
// verify put room update request
const roomUpdateVerify = (req, res, next) => {
    verifyToken(req, res, async () => {
        try {
            const { error } = validUpdateRoom(req.body);
            if (error) {
                return res.status(400).json({ message: error.details[0].message });
            }
            // check owner
            const owner = await Owner.findById(req.owner.id);
            if (!owner) {
                return res.status(404).json({ message: "Owner not found" });
            }
            // check room has owner
            const room = await Room.findById(req.params.id);
            if (!room) {
                return res.status(404).json({ message: "Room not found" });
            }
            if (room.Owner_Id.toString() !== req.owner.id) {
                return res.status(403).json({ message: "You are not authorized to update this room" });
            }
            // check if room used
            if (room.isUsed) {
                return res.status(400).json({ message: "Room is currently in use and cannot be updated" });
            }
            const area = await Area.findOne({ _id: room.Area_Id, Owner_Id: req.owner.id });
            if (!area) {
                return res.status(404).json({ message: "Area not found or you are not authorized to access it" });
            }
            req.area = area; // attach area to request object

            req.room = room; // attach room to request object
            next();
        } catch (error) {
            console.error("Middleware: ", error);
            return res.status(500).json({ message: "Internal Server Error" });
        }
    });
}

// verify create room request
const roomCreateVerify = (req, res, next) => {
    verifyToken(req, res, async () => {
        try {
            // variables 
            let countRooms = 0;
            const { error } = validCreateRoom(req.body);
            if (error) {
                return res.status(400).json({ message: error.details[0].message });
            }
            // check owner
            const owner = await Owner.findById(req.owner.id);
            if (!owner) {
                return res.status(404).json({ message: "Owner not found" });
            }
            // check if area exists
            const area = await Area.findOne({ _id: req.body.Area_Id, Owner_Id: req.owner.id });
            if (!area) {
                return res.status(404).json({ message: "Area not found or you are not authorized to access it" });
            }

            // check if room already exists in the area
            const existingRoom = await Room.findOne({ Area_Id: req.body.Area_Id, NumberRoom: req.body.NumberRoom });
            if (existingRoom) {
                return res.status(400).json({ message: "Room with this number already exists in this area" });
            }
            // check if room limit exceeded
            const roomCount = await Room.countDocuments({ Area_Id: req.body.Area_Id });
            if (roomCount >= LIMIT_ROOMS) {
                return res.status(400).json({ message: `Maximum number of rooms (${LIMIT_ROOMS}) exceeded for this area.` });
            }
            countRooms = area.maxRooms + 1
            req.area = area; // attach area to request object
            req.owner_id = owner._id; // attach owner to request object
            req.countRooms = countRooms;
            next();
        } catch (error) {
            console.error("Middleware: ", error);
            return res.status(500).json({ message: "Internal Server Error" });
        }
    });
}

// get Rooms :: Owner only
const getRoomsVerify = (req, res, next) => {
    verifyToken(req, res, async () => {
        try {
            // check owner
            const owner = await Owner.findById(req.owner.id);
            if (!owner) {
                return res.status(404).json({ message: "Owner not found" });
            }
            // get rooms
            const rooms = await Room.find({ Owner_Id: req.owner.id }).populate("Area_Id", "nameArea maxRooms status");
            if (rooms.length === 0) {
                return res.status(404).json({ message: "No rooms found for this owner" });
            }
            req.rooms = rooms; // attach rooms to request object
            next();
        } catch (error) {
            console.error("Middleware: ", error);
            return res.status(500).json({ message: "Internal Server Error" });
        }
    });
}

// get rooms for customer
const getCustomerRoomsVerify = (req, res, next) => {
    verifyToken(req, res, async () => {
        try {
            // check customer
            const customer = await Customer.findById(req.customer.id);
            if (!customer) {
                return res.status(404).json({ message: "Customer not found" });
            }
            // get rooms
            const rooms = await Room.find({
                RentalType: { $eq: "null" },
                status: { $eq: true }
            }).populate("Area_Id", "nameArea maxRooms status").lean();
            if (rooms.length === 0) {
                return res.status(404).json({ message: "No available rooms found" });
            }
            req.rooms = rooms; // attach rooms to request object
            next();
        } catch (error) {
            console.error("Middleware: ", error);
            return res.status(500).json({ message: "Internal Server Error" });
        }
    });
}

// patch token in area which delete

const verifyRoomWillDelete = async (req, res, next) => {
    verifyToken(req, res, async () => {
        try {
            // check id validity
            if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
                return res.status(400).json({ message: "Invalid room ID." });
            }

            // check area exists
            const room = await Room.findById(req.params.id);
            if (!room) {
                return res.status(404).json({ message: "Room not found" });
            }

            // check owner
            if (room.Owner_Id.toString() !== req.owner.id) {
                return res.status(403).json({ message: "You are not allowed to delete this room." });
            }

            // check area is alarm
            if (room.isDeleted) {
                return res.status(200).json({ message: "room is auto delete when users expired rentals" });
            }

            req.roomData = room;
            // return res.json({ message: "dev test" })
            next();
        } catch (error) {
            console.error("Middleware error:", error);
            return res.status(500).json({ message: "Internal server error" });
        }
    });
}

module.exports = {
    roomUpdateVerify,
    roomCreateVerify,
    getRoomsVerify,
    getCustomerRoomsVerify,
    verifyRoomWillDelete
};