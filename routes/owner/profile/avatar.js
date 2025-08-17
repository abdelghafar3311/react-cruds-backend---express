const express = require('express');
const router = express.Router();
const { verifyUploadDataForPUTAndDELETE, verifyAvatarGet } = require("../../../middlewares/Owner_Verify/verifyAvatar")
const { upload, uploadToGitHub } = require("../../../services/uploadImage")

const OwnerProfile = require("../../../modules/Owners/OwnerProfile")

/** 
 * @method PUT
 * @description  upload image to github
 * @route api/owner/profile/image/upload
 * @access private
 */

router.put("/upload", verifyUploadDataForPUTAndDELETE, upload.single("image"), async (req, res) => {
    try {
        const imageUrl = await uploadToGitHub(req.file.buffer, req.file.originalname);

        const updateProfile = await OwnerProfile.findByIdAndUpdate(req.profile._id, {
            $set: {
                Avatar: imageUrl
            }
        }, { new: true });

        const { Avatar } = updateProfile._doc
        res.status(200).json({ message: "Image uploaded successfully", url: Avatar });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" })
    }
})

/** 
 * @method PUT
 * @description  upload image to github
 * @route api/owner/profile/image/upload
 * @access private
 */

router.get("/", verifyAvatarGet, async (req, res) => {
    try {
        res.status(200).json({ url: req.profileURL });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" })
    }
})



module.exports = router;