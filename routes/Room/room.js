const express = require('express');
const router = express.Router();
// verify middlewares
const { roomUpdateVerify, verifyRoomWillDelete, getOneRoomVerify, roomCreateVerify, getRoomsVerify, getCustomerRoomsVerify } = require("../../middlewares/Room_Verify/room_verify");

// controllers
const {
    UpdateRoomController,
    CreateRoomController,
    GetOwnersRoomsController,
    GetCustomersRoomsController,
    DeleteRoomController,
    GetOneRoomController
} = require("../../controllers/Room/room.controller");


router.put("/update/:id", roomUpdateVerify, UpdateRoomController);

router.post("/create", roomCreateVerify, CreateRoomController);

router.get("/owner/rooms", getRoomsVerify, GetOwnersRoomsController);

router.get("/owner/rooms/:id", getOneRoomVerify, GetOneRoomController);

router.get("/customer/rooms", getCustomerRoomsVerify, GetCustomersRoomsController);

router.patch("/delete/:id", verifyRoomWillDelete, DeleteRoomController);

module.exports = router;