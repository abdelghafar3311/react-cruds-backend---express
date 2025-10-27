const express = require("express");
const router = express.Router();
const { verifyToken } = require("../../middlewares/verifyToken")
// controllers
const { UpdateCustomerController, GetCustomerController } = require("../../controllers/customer/customer.controller")

// get
router.get("/get", verifyToken, GetCustomerController);

// update
router.put("/update", verifyToken, UpdateCustomerController);

module.exports = router;