const express = require('express');
const router = express.Router();

// models
const Room = require("../../modules/Room/Room");
const Area = require("../../modules/Area/Area");
const Owner = require("../../modules/Owners/Owner");
const { Customer } = require("../../modules/Customer/Customer_Module");

// verify middlewares
const { roomUpdateVerify, verifyRoomWillDelete, roomCreateVerify, getRoomsVerify, getCustomerRoomsVerify } = require("../../middlewares/Room_Verify/room_verify");
const { CreateDeleteToken } = require("../../middlewares/Token")
// service to create date
const addTimeToDate = require("../../services/addTimeToDate");

/**
 * @method PUT
 * @description Update room details
 * @route /room/update/:id
 * @access Private
 * */

router.put("/update/:id", roomUpdateVerify, async (req, res) => {
    try {
        const updateData = {
            nameRoom: req.body.nameRoom,
            NumberRoom: req.body.NumberRoom,
            price: req.body.price,
            description: req.body.description,
            status: req.body.status,
            length: req.body.length,
            width: req.body.width
        };
        // update room
        const updatedRoom = await Room.findByIdAndUpdate(req.room._id, updateData, { new: true });

        // return updated room
        res.status(200).json({
            message: "Room updated successfully",
            room: updatedRoom
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" })
    }
})

/**
 * @method POST
 * @description Create a new room
 * @route /api/room/create
 * @access Private
 * */

router.post("/create", roomCreateVerify, async (req, res) => {
    try {
        // add 1 room in area
        await Area.findByIdAndUpdate(req.area._id, {
            $inc: { maxRooms: 1 }
        }, { new: true });
        // create new room
        const newRoom = new Room({
            nameRoom: req.body.nameRoom,
            NumberRoom: req.body.NumberRoom,
            price: req.body.price,
            description: req.body.description,
            status: req.body.status,
            length: req.body.length,
            width: req.body.width,
            Area_Id: req.area._id,
            Owner_Id: req.owner_id
        });

        // save room
        const savedRoom = await newRoom.save();

        // return created room
        res.status(201).json({
            message: "Room created successfully",
            room: savedRoom
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" })
    }
})

/**
 * @method GET
 * @description Get all rooms for owner
 * @route /room/owner/rooms
 * @access Private
 * */

router.get("/owner/rooms", getRoomsVerify, async (req, res) => {
    try {
        return res.status(200).json({
            message: "Rooms fetched successfully",
            rooms: req.rooms // assuming rooms are populated in owner model
        }); a
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" })
    }
});

/**
 * @method GET
 * @description Get all available rooms for customers
 * @route /room/customer/rooms
 * @access Private
 * */

router.get("/customer/rooms", getCustomerRoomsVerify, async (req, res) => {
    try {
        return res.status(200).json({
            message: "Available rooms fetched successfully",
            rooms: req.rooms // assuming rooms are populated in customer model
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" })
    }
});


/**
 * @method PATCH
 * @description update Room to ready for delete
 * @route /api/room/delete/:id
 * @access private
 **/

/*
 response example: 
{
    "AlarmMessage": "Your area will be deleted in 5 minutes",
    "timeNumber": 5,
    "timeType": "m"
}
*/

router.patch("/delete/:id", verifyRoomWillDelete, async (req, res) => {
    try {
        const now = new Date();
        const { error, result } = addTimeToDate(now, req.time ?? "5m");
        if (error) {
            return res.status(400).json({ message: error });
        }
        const token = CreateDeleteToken({ id: req.roomData._id, ownerId: req.roomData.Owner_Id, name: req.roomData.nameRoom, NumberRoom: req.roomData.NumberRoom }, req.time);
        const update = await Room.findByIdAndUpdate(req.params.id, {
            isAlarm: true,
            AlarmMessage: req.msa,
            AlarmToken: token,
            AlarmDate: result,
        }, { new: true });

        if (!update) {
            return res.status(404).json({ message: "Room not found" });
        }

        res.status(200).json({ message: "Room is ready for delete", area: update });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" })
    }
});

module.exports = router;