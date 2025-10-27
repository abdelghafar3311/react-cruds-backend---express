// models
const OwnerProfile = require('../../../modules/Owners/OwnerProfile');
const Owner = require('../../../modules/Owners/Owner');

/**
 * @method Post
 * @description  Post new Owner profile
 * @route /api/owner/profile
 * @param {Object} req - The request object containing the profile data.
 * @param {Object} res - The response object used to send the response.
 * @returns {Object} - Returns a JSON object with the created profile data.
 * @throws {Error} - Throws an error if the profile data is invalid or if the profile already exists.
 * @access private
 **/


const CreateProfileController = async (req, res) => {
    try {
        // Create a new profile using the validated data
        const newProfile = new OwnerProfile({
            Owner_Id: req.owner.id,
            name: req.body.name,
            money: req.body.money || 0,
            Avatar: req.body.Avatar,
            phone: req.body.phone,
            address: req.body.address,
            description: req.body.description || ""
        });
        await newProfile.save();
        return res.status(201).json({ message: "Profile created successfully", profile: newProfile });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" })
    }
}

/**
 * @method PUT
 * @description  Update Owner profile
 * @route /api/Owner/profile/update
 * @param {Object} req - The request object containing the updated profile data.
 * @param {Object} res - The response object used to send the response.
 * @returns {Object} - Returns a JSON object with the updated profile data.
 * @throws {Error} - Throws an error if the profile data is invalid or if the profile does not exist.
 * @access private
 */

const UpdateProfileController = async (req, res) => {
    try {
        const updatedProfile = await OwnerProfile.findByIdAndUpdate(req.profile._id, {
            $set: {
                ...req.body
            }
        }, { new: true });

        return res.status(200).json({ message: "Profile updated successfully", profile: updatedProfile });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" })
    }
}

/**
 * @method GET
 * @description  Get Owner profile
 * @route /api/Owner/profile
 * @param {Object} req - The request object containing the Owner ID.
 * @param {Object} res - The response object used to send the response.
 * @returns {Object} - Returns a JSON object with the profile data.
 * @throws {Error} - Throws an error if the profile does not exist.
 * @access private
 */

const GetProfileController = async (req, res) => {
    try {
        // Find the profile by Owner_Id
        const profile = await OwnerProfile.findOne({ Owner_Id: req.owner.id }).lean();
        return res.status(200).json({ profile });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" })
    }
}

/** 
 * @method DELETE
 * @description  Delete Owner profile
 * @route /api/Owner/profile/delete
 * @param {Object} req - The request object containing the Owner ID.
 * @param {Object} res - The response object used to send the response.
 * @returns {Object} - Returns a JSON object with a success message.
 * @throws {Error} - Throws an error if the profile does not exist or if there is an internal server error.
 * @access private
 */

const DeleteAccountController = async (req, res) => {
    try {
        await OwnerProfile.findByIdAndUpdate(req.profile._id, {
            $set: {
                isDeleted: true
            }
        }, { new: true });
        return res.status(200).json({ message: "Successfully, will be deleted when Customer expires subscription in Rooms" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" })
    }
}

module.exports = {
    CreateProfileController,
    UpdateProfileController,
    GetProfileController,
    DeleteAccountController
}