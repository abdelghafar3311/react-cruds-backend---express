// modules
const { Customer } = require("../../../modules/Customer/Customer_Module");
// validations
const { validateCustomerRegisterSchema, validateCustomerLoginSchema } = require("../../../validations/customer.valid")
// libraries
const bcrypt = require("bcryptjs");
// middlewares
const { CreateToken } = require("../../../middlewares/Token");

/**
 * @method Post
 * @description  Register new customer
 * @route /api/auth
 * @access public
 **/

const RegisterController = async (req, res) => {
    try {
        // validate error
        const { error } = validateCustomerRegisterSchema(req.body);
        if (error) {
            return res.status(400).json({ message: "syntax is wrong", error: error.details[0].message })
        }

        // check customer if found
        let customer = await Customer.findOne({ email: req.body.email })
        if (customer) {
            return res.status(400).json({ message: "some thing is wrong" })
        }
        // hash password
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(req.body.password, salt);
        // create customer in DB
        customer = new Customer({
            username: req.body.username,
            email: req.body.email,
            password: hash,
        });

        const result = await customer.save();
        const token = CreateToken({ id: customer._id, username: customer.username, email: customer.email, type: "customer" }, "1h")
        const { password, ...other } = result._doc;
        return res.status(201).json({ ...other, token })

    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Internal Server Error" })
    }
}

/**
 * @method Post
 * @description  Login customer
 * @route /api/auth
 * @access public
 **/

const LoginController = async (req, res) => {
    try {
        // validate error
        const { error } = validateCustomerLoginSchema(req.body);
        if (error) {
            return res.status(400).json({ message: "syntax is wrong", error: error.details[0].message })
        }

        // check customer if found
        let customer = await Customer.findOne({ email: req.body.email })
        if (!customer) {
            return res.status(400).json({ message: "The email or password is wrong" })
        }
        // compare password

        const comparePassword = await bcrypt.compare(req.body.password, customer.password);
        if (!comparePassword) return res.status(400).json({ message: "The email or password is wrong" });
        // create token
        const token = CreateToken({ id: customer._id, username: customer.username, email: customer.email, type: "customer" }, "1h");
        // take password from data
        const { password, ...other } = customer._doc;
        // send response
        res.status(200).json({ ...other, token })

    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Internal Server Error" })
    }
}

module.exports = {
    RegisterController,
    LoginController
}