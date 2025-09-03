const express = require("express");
const router = express.Router();
// middlewares
const { verifyToken } = require("../../middlewares/verifyToken");
// controllers
const { OwnerController } = require("../../controllers/owner/owner.controller")

router.put("/update", verifyToken, OwnerController)

module.exports = router;