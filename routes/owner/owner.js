const express = require("express");
const router = express.Router();
// middlewares
const { verifyToken } = require("../../middlewares/verifyToken");
// controllers
const { OwnerController, getOwnerController } = require("../../controllers/owner/owner.controller")
// routes
router.get("/get", verifyToken, getOwnerController)
router.put("/update", verifyToken, OwnerController)

module.exports = router;