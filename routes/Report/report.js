const express = require("express");
const router = express.Router();

// modules
const {
    GetAllReportsController,
    DeleteAllReportsController
} = require("../../controllers/Report/report.conroller");

// verify token
const { verifyToken } = require("../../middlewares/verifyToken");

router.get("/", verifyToken, GetAllReportsController);

router.delete("/delete", verifyToken, DeleteAllReportsController);


module.exports = router;