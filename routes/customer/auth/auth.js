const express = require("express");
const router = express.Router();

// controllers
const {
    RegisterController,
    LoginController
} = require("../../../controllers/customer/auth/auth.controller")


router.post("/register", RegisterController);

router.post("/login", LoginController);

module.exports = router;