// Service
const { uploadToGitHub } = require("../../../services/uploadImage")
// Models
const OwnerProfile = require("../../../modules/Owners/OwnerProfile");

/** 
 * @method PUT
 * @description  upload image to github
 * @route api/Owner/profile/image/upload
 * @access private
 */

const UploadImageController = async (req, res) => {
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
}


/** 
 * @method DELETE
 * @description  clear image from db
 * @route api/Owner/profile/image/delete
 * @access private
 */

const ClearImageController = async (req, res) => {
    try {
        const updateProfile = await OwnerProfile.findByIdAndUpdate(req.profile._id, {
            $set: {
                Avatar: "https://raw.githubusercontent.com/abdelghafar3311/upload_images_express_curds/main/uploads/1758209587568-avatar.png"
            }
        }, { new: true });
        const { Avatar } = updateProfile._doc
        res.status(200).json({ message: "Image deleted successfully", url: Avatar });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" })
    }
}


module.exports = {
    UploadImageController,
    ClearImageController
}