const express = require('express');
const router = express.Router();

// the middlewares
const { verifyProfileData, verifyProfileUpdate, verifyGetProfile, verifyDeleteProfile } = require('../../../middlewares/Owner_Verify/verifyProfile');

// models
const OwnerProfile = require('../../../modules/Owners/OwnerProfile');
const Owner = require('../../../modules/Owners/Owner');
// controllers
const {
    CreateProfileController,
    UpdateProfileController,
    GetProfileController,
    DeleteAccountController
} = require("../../../controllers/owner/profile/profile.controller")


router.post("/add", verifyProfileData, CreateProfileController)

router.put("/update", verifyProfileUpdate, UpdateProfileController);

router.get("/", verifyGetProfile, GetProfileController);

router.delete("/delete", verifyDeleteProfile, DeleteAccountController);

module.exports = router;