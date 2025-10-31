// modules
const { Customer } = require("../../modules/Customer/Customer_Module");
// validations
const { validateCustomerUpdateSchema } = require("../../validations/customer.valid")
// libraries
const bcrypt = require("bcryptjs");

/**
 * @method PUT
 * @description  update customer
 * @route /api/customer/:id
 * @access private
 **/

const UpdateCustomerController = async (req, res) => {
    try {
        // validate
        const { error } = validateCustomerUpdateSchema(req.body);
        if (error) {
            return res.status(400).json({ message: "syntax is wrong", error: error.details[0].message })
        }
        // check if not found
        const findCustomer = await Customer.findById(req.customer.id);
        if (!findCustomer) {
            return res.status(404).json({ message: "customer not found" });
        }
        // hash password
        if (req.body.password) {
            const salt = await bcrypt.genSalt(10);
            req.body.password = await bcrypt.hash(req.body.password, salt);
        }
        // update
        const UpdateCustomer = await Customer.findByIdAndUpdate(req.customer.id, {
            $set: {
                username: req.body.username,
                password: req.body.password,
            }
        }, { new: true });

        const { password, ...other } = UpdateCustomer._doc;

        return res.status(200).json({ ...other });

    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({
                message: "The provided input is not valid."
            });
        }
        console.log(error)
        res.status(500).json({ message: "Internal Server Error" })
    }
}

/**
 * @method GET
 * @description  get customer
 * @route /api/customer/get
 * @access private
 */

const GetCustomerController = async (req, res) => {
    try {
        const customer = await Customer.findById(req.customer.id).select("-password");
        if (!customer) {
            return res.status(404).json({ message: "customer not found" });
        }
        return res.status(200).json({ customer });
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Internal Server Error" })
    }
}

module.exports = {
    UpdateCustomerController,
    GetCustomerController
}