// Owner Module
const Owner = require("../../modules/Owners/Owner");
// validations
const { validateOwnerUpdateSchema } = require("../../validations/owner.valid");
// lib
const bcrypt = require("bcryptjs");

/**
 * @method PUT
 * @description  update owner
 * @route /api/owner/:id
 * @access private
 **/

const OwnerController = async (req, res) => {
    try {
        if (req.owner.id !== req.params.id) {
            return res.status(403).json({ message: "You are not authorized to perform this action." })
        }
        // validate
        const { error } = validateOwnerUpdateSchema(req.body);
        if (error) {
            return res.status(400).json({ message: "syntax is wrong", error: error.details[0].message })
        }
        // check if not found
        const findOwner = await Owner.findById(req.params.id);
        if (!findOwner) {
            return res.status(404).json({ message: "owner not found" });
        }
        // hash password
        if (req.body.password) {
            const salt = await bcrypt.genSalt(10);
            req.body.password = await bcrypt.hash(req.body.password, salt);
        }
        // update
        const UpdateOwner = await Owner.findByIdAndUpdate(req.params.id, {
            $set: {
                email: req.body.email,
                password: req.body.password,
            }
        }, { new: true });

        const { password, ...other } = UpdateOwner._doc;

        return res.status(200).json({ ...other });
    } catch (error) {
        console.error(error);
        if (error.code === 11000) {
            return res.status(409).json({
                message: "The provided input is not valid."
            });
        }
        res.status(500).json({ message: "Internal Server Error" })
    }
};

module.exports = {
    OwnerController
}