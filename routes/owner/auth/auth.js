const express = require("express");
// router
const router = express.Router();

// controller
const {
    RegisterController,
    LoginController
} = require("../../../controllers/owner/auth/auth.controller");

router.post("/register", RegisterController)

router.post("/login", LoginController)

module.exports = router;