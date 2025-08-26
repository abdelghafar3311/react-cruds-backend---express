const express = require("express");
const Owner = require("../../../modules/Owners/Owner");
const bcrypt = require("bcryptjs");

const { validateOwnerRegisterSchema, validateOwnerLoginSchema } = require("../../../validations/owner.valid");
const { CreateToken } = require("../../../middlewares/Token")
// router
const router = express.Router();

/**
 * @method Post
 * @description  Register new owner
 * @route /api/owner/auth/register
 * @access public
 **/

router.post("/register", async (req, res) => {
    try {
        // validate error
        const { error } = validateOwnerRegisterSchema(req.body);
        if (error) {
            return res.status(400).json({ message: "syntax is wrong", error: error.details[0].message })
        }

        // check Owner if found
        let owner = await Owner.findOne({ email: req.body.email })
        if (owner) {
            return res.status(400).json({ message: "some thing is wrong" })
        }
        // hash password
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(req.body.password, salt);
        // create customer in DB
        owner = new Owner({
            username: req.body.username,
            email: req.body.email,
            password: hash,
        });

        const result = await owner.save();
        const token = CreateToken({ id: owner._id, username: owner.username, email: owner.email, type: "owner" }, "1h")
        const { password, ...other } = result._doc;
        return res.status(201).json({ ...other, token })
    } catch (error) {
        console.error(error);
        console.log(req.body);
        res.status(500).json({ message: "Internal Server Error" })
    }
})

/**
 * @method Post
 * @description  login new owner
 * @route /api/owner/auth/login
 * @access public
 **/

router.post("/login", async (req, res) => {
    try {
        // validate error
        const { error } = validateOwnerLoginSchema(req.body);
        if (error) {
            return res.status(400).json({ message: "syntax is wrong", error: error.details[0].message })
        }

        // check customer if found
        let owner = await Owner.findOne({ email: req.body.email })
        if (!owner) {
            return res.status(400).json({ message: "The email or password is wrong" })
        }
        // compare password

        const comparePassword = await bcrypt.compare(req.body.password, owner.password);
        if (!comparePassword) return res.status(400).json({ message: "The email or password is wrong" });
        // create token
        const token = CreateToken({ id: owner._id, username: owner.username, email: owner.email, type: "owner" }, "1h");
        // take password from data
        const { password, ...other } = owner._doc;
        // send response
        res.status(200).json({ ...other, token })

    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Internal Server Error" })
    }
})

module.exports = router;