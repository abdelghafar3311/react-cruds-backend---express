const express = require('express');
const router = express.Router();

// the middlewares
const { verifyProfileData, verifyProfileUpdate, verifyGetProfile, verifyDeleteProfile } = require('../../../middlewares/CustomerProfile/customerProfile');

// controllers
const {
    CreateProfileController,
    UpdateProfileController,
    GetProfileController,
    DeleteAccountController
} = require('../../../controllers/customer/profile/profile.controller')
// routers


router.post("/add", verifyProfileData, CreateProfileController);

router.put("/update", verifyProfileUpdate, UpdateProfileController);

router.get("/", verifyGetProfile, GetProfileController);

router.delete("/delete", verifyDeleteProfile, DeleteAccountController);

module.exports = router;