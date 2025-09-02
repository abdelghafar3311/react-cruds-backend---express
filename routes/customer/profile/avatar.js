const express = require('express');
const router = express.Router();
// middlewares
const { verifyImage } = require("../../../middlewares/CustomerProfile/verifyAvatar")
// services
const { upload } = require("../../../services/uploadImage")
// controllers
const {
    UploadImageController,
    ClearImageController
} = require("../../../controllers/customer/profile/avatar.controller")

router.put("/upload", verifyImage, upload.single("image"), UploadImageController);

router.delete("/delete", verifyImage, ClearImageController);


module.exports = router;