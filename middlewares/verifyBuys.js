const jwt = require("jsonwebtoken");
const { secreteKey } = require("../values/env");
// for product verify
const { validateProduct } = require("../validations/buys.valid");
// Customer data
const { Customer } = require("../modules/Customer/Customer_Module")
// services
const { calculateTotalPay } = require("../services/productService");
// verify token
const verifyToken = (req, res, next) => {
    const token = req.headers.token || req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(400).json({ message: "Token is not found, please provide a token" });

    try {
        const decode = jwt.verify(token, secreteKey);
        req.customer = decode;
        next();
    } catch (error) {
        return res.status(401).json({ message: "invalid token" });
    }
}

// verify for buy product
const verifyTokenForProductBuy = async (req, res, next) => {
    verifyToken(req, res, async () => {
        try {
            // validate
            const { error } = validateProduct(req.body);
            if (error) {
                return res.status(400).json({ message: "syntax is wrong", error: error.details[0].message })
            }
            // check id
            const findId = await Customer.findById(req.customer.id);
            if (!findId) {
                return res.status(400).json({ message: "Your account could not be found in our records. Please try again or contact support." });
            }

            // check pay
            const pay = (+req.body.price + +req.body.ads + +req.body.taxes) * +req.body.count;

            if (pay > findId.money) {
                return res.status(422).json({ message: "your money is not enough" })
            }

            // create objects
            req.money = findId.money - pay;
            req.pay = pay;

            next();
        } catch (error) {
            console.error("middleware error:", error);
            return res.status(500).json({ message: "Internal server error", error: error.message });
        }
    })
}

// verify for buy products
const verifyTokenForProductsBuy = async (req, res, next) => {
    verifyToken(req, res, async () => {
        try {
            const data = req.body;
            for (const item of data) {
                const { error } = validateProduct(item);
                if (error) {
                    return res.status(400).json({ message: "syntax is wrong", error: error.details[0].message });
                }
            }
            // check id
            const findId = await Customer.findById(req.customer.id);
            if (!findId) {
                return res.status(400).json({ message: "Your account could not be found in our records. Please try again or contact support." });
            }
            // check money
            const pay = calculateTotalPay(data)
            if (pay > findId.money) {
                return res.status(422).json({ message: "your money is not enough" })
            }
            // create objects
            req.money = findId.money - pay;
            req.pay = pay;
            next();
        } catch (error) {
            console.error("middleware error:", error);
            return res.status(500).json({ message: "Internal server error", error: error.message });
        }
    })
}

module.exports = {
    verifyTokenForProductBuy,
    verifyTokenForProductsBuy
}