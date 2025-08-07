const jwt = require("jsonwebtoken");
const { secreteKey } = require("../values/env");
const { validateMoney, validateUpdateMoney } = require("../validations/money.valid")
// for product verify
const { Customer } = require("../modules/Customer/Customer_Module")

// verify token
const verifyToken = (req, res, next) => {
    const token = (req.headers.token || req.headers.authorization?.split(" ")[1] || "").trim();
    if (!token) return res.status(400).json({ message: "Token is not found, please provide a token" });

    try {
        const decode = jwt.verify(token, secreteKey);
        req.customer = decode;
        next();
    } catch (error) {
        return res.status(401).json({ message: "invalid token" });
    }
}

// verify push money

const verifyTokenPushMoney = async (req, res, next) => {
    verifyToken(req, res, async () => {
        try {
            const { error } = validateMoney(req.body);
            if (error) {
                return res.status(400).json({ message: "Money is not matching roles", error: error.details[0].message })
            }

            const customer = await Customer.findById(req.customer.id);
            if (!customer) {
                return res.status(403).json({ message: "You are not allowed to push money, please sign in first." })
            }

            const moneyPushForCustomer = +req.body.money + customer.money;
            req.newMoney = moneyPushForCustomer;

            next();
        } catch (error) {
            console.error(error)
            res.status(500).json({ message: "Internal Server Error" })
        }
    })
}

// verify update money

const verifyTokenUpdateMoney = async (req, res, next) => {
    verifyToken(req, res, async () => {
        try {
            const { error } = validateUpdateMoney(req.body);
            if (error) {
                return res.status(400).json({ message: "Money is not matching roles", error: error.details[0].message })
            }

            const customer = await Customer.findById(req.customer.id);
            if (!customer) {
                return res.status(403).json({ message: "You are not allowed to update money, please sign in first." })
            }

            next();
        } catch (error) {
            console.error(error)
            res.status(500).json({ message: "Internal Server Error" })
        }
    })
}

module.exports = {
    verifyTokenPushMoney,
    verifyTokenUpdateMoney
}