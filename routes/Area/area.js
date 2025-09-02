const express = require("express");

// import middlewares
const { verifyAreaPOST, verifyAreaPUT, verifyGetAllAreas, verifyAreaWillDelete } = require("../../middlewares/Area verify/verifyArea");
// router
const router = express.Router();
// controllers
const {
    CreateAreaController,
    UpdateAreaController,
    GetAreasController,
    GetByIdAreaController,
    DeleteAreaController
} = require("../../controllers/Area/area.controller");


router.post("/create", verifyAreaPOST, CreateAreaController);

router.put("/update/:id", verifyAreaPUT, UpdateAreaController);

router.get("/", verifyGetAllAreas, GetAreasController);

router.get("/one/:id", verifyGetAllAreas, GetByIdAreaController);

router.patch("/alarm/:id", verifyAreaWillDelete, DeleteAreaController);


module.exports = router;