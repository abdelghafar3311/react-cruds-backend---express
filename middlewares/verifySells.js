const jwt = require("jsonwebtoken");
const { secreteKey } = require("../values/env");
// for product verify
const { Product } = require("../modules/Product/Product");
const { Customer } = require("../modules/Customer/Customer_Module");

const { validateSellsCount } = require("../validations/sells.valid");

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


// sells verify product
const verifyTokenForProductSells = async (req, res, next) => {
    verifyToken(req, res, async () => {
        try {
            // check id
            const findId = await Customer.findById(req.customer.id);
            if (!findId) {
                return res.status(400).json({ message: "Your account could not be found in our records. Please try again or contact support." });
            }
            // check id === customer id
            const findIdProduct = await Product.findOne({ _id: req.params.id, customer_id: req.customer.id })
            if (!findIdProduct) {
                return res.status(403).json({ message: "You are not allowed to Sell product for another account." });
            }

            /** @new @code **/
            const moneyAdd = ((findIdProduct.price + findIdProduct.taxes + findIdProduct.ads + findIdProduct.gain) - findIdProduct.discount) * findIdProduct.count;
            const custom_money = moneyAdd + findId.money
            req.moneyAdd = moneyAdd;
            req.custom_money = custom_money;
            req.productId = findIdProduct._id;
            /** @end @code **/
            next();
        } catch (error) {
            console.error("middleware error:", error);
            return res.status(500).json({ message: "Internal server error", error: error.message });
        }
    })
}

// verify for post product
/** @new @code */
const verifyTokenForSellsCount = async (req, res, next) => {
    verifyToken(req, res, async () => {
        try {
            // validate
            const { error } = validateSellsCount(req.body);
            if (error) {
                return res.status(400).json({ message: "Invalid input data", error: error.details[0].message })
            }
            // check id
            const findId = await Customer.findById(req.customer.id);
            if (!findId) {
                return res.status(400).json({ message: "Your account could not be found in our records. Please try again or contact support." });
            }
            // get product
            const findIdProduct = await Product.findById(req.body.product_id);
            if (!findIdProduct) {
                return res.status(404).json({ message: "The product is not found" });
            }

            const countCustomer = +req.body.count;

            if (countCustomer > findIdProduct.count) {
                return res.status(400).json({ message: "The requested quantity exceeds the available stock." });
            }

            const moneyAdd = ((findIdProduct.price + findIdProduct.taxes + findIdProduct.ads + findIdProduct.gain) - findIdProduct.discount) * countCustomer;
            const custom_money = moneyAdd + findId.money
            req.moneyAdd = moneyAdd;
            req.custom_money = custom_money;
            req.productId = findIdProduct._id;
            req.product = findIdProduct;
            req.count = countCustomer;
            next();
        } catch (error) {
            console.error("middleware error:", error);
            return res.status(500).json({ message: "Internal server error", error: error.message });
        }
    })
}

module.exports = {
    verifyTokenForProductSells,
    verifyTokenForSellsCount
}