const express = require("express");
const router = express.Router();
const { verifyTokenWithCustomerToUpdate } = require("../../middlewares/verifyCustomer")
// controllers
const { UpdateCustomerController } = require("../../controllers/customer/customer.controller")


router.put("/:id", verifyTokenWithCustomerToUpdate, UpdateCustomerController);

module.exports = router;