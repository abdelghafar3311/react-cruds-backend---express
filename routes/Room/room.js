const express = require('express');
const router = express.Router();
// verify middlewares
const { roomUpdateVerify, verifyRoomWillDelete, roomCreateVerify, getRoomsVerify, getCustomerRoomsVerify } = require("../../middlewares/Room_Verify/room_verify");

// controllers
const {
    UpdateRoomController,
    CreateRoomController,
    GetOwnersRoomsController,
    GetCustomersRoomsController,
    DeleteRoomController
} = require("../../controllers/Room/room.controller");


router.put("/update/:id", roomUpdateVerify, UpdateRoomController);

router.post("/create", roomCreateVerify, CreateRoomController);

router.get("/owner/rooms", getRoomsVerify, GetOwnersRoomsController);

router.get("/customer/rooms", getCustomerRoomsVerify, GetCustomersRoomsController);

router.patch("/delete/:id", verifyRoomWillDelete, DeleteRoomController);

module.exports = router;