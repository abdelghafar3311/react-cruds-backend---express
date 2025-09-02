// models
const CustomerProfile = require('../../../modules/Customer/CustomerProfile');
const { Customer } = require('../../../modules/Customer/Customer_Module');

/**
 * @method Post
 * @description  Post new customer profile
 * @route /api/customer/profile
 * @param {Object} req - The request object containing the profile data.
 * @param {Object} res - The response object used to send the response.
 * @returns {Object} - Returns a JSON object with the created profile data.
 * @throws {Error} - Throws an error if the profile data is invalid or if the profile already exists.
 * @access private
 **/

const CreateProfileController = async (req, res) => {
    try {
        // Create a new profile using the validated data
        const newProfile = new CustomerProfile({
            Customer_Id: req.customer.id,
            name: req.body.name,
            Avatar: req.body.Avatar || "images/customer.png",
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
 * @description  Update customer profile
 * @route /api/customer/profile/update
 * @param {Object} req - The request object containing the updated profile data.
 * @param {Object} res - The response object used to send the response.
 * @returns {Object} - Returns a JSON object with the updated profile data.
 * @throws {Error} - Throws an error if the profile data is invalid or if the profile does not exist.
 * @access private
 */

const UpdateProfileController = async (req, res) => {
    try {
        const updatedProfile = await CustomerProfile.findByIdAndUpdate(req.profile._id, {
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
 * @description  Get customer profile
 * @route /api/customer/profile
 * @param {Object} req - The request object containing the customer ID.
 * @param {Object} res - The response object used to send the response.
 * @returns {Object} - Returns a JSON object with the profile data.
 * @throws {Error} - Throws an error if the profile does not exist.
 * @access private
 */

const GetProfileController = async (req, res) => {
    try {
        // Find the profile by customer_Id
        const profile = await CustomerProfile.findOne({ Customer_Id: req.customer.id }).lean();
        return res.status(200).json({ profile });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" })
    }
}

/** 
 * @method DELETE
 * @description  Delete customer profile
 * @route /api/customer/profile/delete
 * @param {Object} req - The request object containing the customer ID.
 * @param {Object} res - The response object used to send the response.
 * @returns {Object} - Returns a JSON object with a success message.
 * @throws {Error} - Throws an error if the profile does not exist or if there is an internal server error.
 * @access private
 */

const DeleteAccountController = async (req, res) => {
    try {
        await CustomerProfile.findByIdAndDelete(req.profile._id);
        await Customer.findByIdAndDelete(req.customer.id);
        return res.status(200).json({ message: "Profile deleted successfully" });
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