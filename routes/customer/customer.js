const express = require("express");
const { Customer } = require("../../modules/Customer/Customer_Module");
const { validateCustomerUpdateSchema } = require("../../validations/customer.valid")
const bcrypt = require("bcryptjs");
const router = express.Router();
const { verifyTokenWithCustomerToDelete, verifyTokenWithCustomerToUpdate } = require("../../middlewares/verifyCustomer")


/**
 * @method Get
 * @description  get all customer => is test only
 * @route /api/customer
 * @access TEST
 **/

router.get("/", async (req, res) => {
    try {

        // check customer if found
        let customer = await Customer.find()
        res.status(200).json(customer)

    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error })
    }
})

/**
 * @method PUT
 * @description  update customer
 * @route /api/customer/:id
 * @access private
 **/

router.put("/:id", verifyTokenWithCustomerToUpdate, async (req, res) => {
    try {
        // validate
        const { error } = validateCustomerUpdateSchema(req.body);
        if (error) {
            return res.status(400).json({ message: "syntax is wrong", error: error.details[0].message })
        }
        // check if not found
        const findCustomer = await Customer.findById(req.params.id);
        if (!findCustomer) {
            return res.status(404).json({ message: "customer not found" });
        }
        // hash password
        if (req.body.password) {
            const salt = await bcrypt.genSalt(10);
            req.body.password = await bcrypt.hash(req.body.password, salt);
        }
        // update
        const UpdateCustomer = await Customer.findByIdAndUpdate(req.params.id, {
            $set: {
                username: req.body.username,
                email: req.body.email,
                password: req.body.password,
                role: req.body.role
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
        res.status(500).json({ message: "Internal Server Error", error })
    }
})

/**
 * @method Delete
 * @description  delete customer
 * @route /api/customer/:id
 * @access private
 **/

router.delete("/:id", verifyTokenWithCustomerToDelete, async (req, res) => {
    try {
        // check if not found
        const findCustomer = await Customer.findById(req.params.id);
        if (!findCustomer) {
            return res.status(404).json({ message: "customer not found" });
        }
        // delete
        const DeleteCustomer = await Customer.findByIdAndDelete(req.params.id);

        return res.status(200).json({ message: "success delete" });

    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error })
    }
})

module.exports = router;