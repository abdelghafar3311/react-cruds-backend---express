const jwt = require("jsonwebtoken");
const { secreteKey } = require("../values/env");
// for product verify
const { Product } = require("../modules/Product/Product");
const { Customer } = require("../modules/Customer/Customer_Module")
const { Report } = require("../modules/Report/Report");

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
const verifyTokenForProductDelete = async (req, res, next) => {
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
                return res.status(403).json({ message: "You are not allowed to delete product for another account." });
            }

            if (findIdProduct.isSold || findIdProduct.isBlocked) {
                return res.status(403).json({ message: "You are not allowed to delete product." });
            }

            const report = await Report.find({ product_id: findIdProduct._id });

            if (report.length === 0) {
                return res.status(500).json({ message: "Cannot delete product because no report exists for this product." })
            }

            /** @new @code **/
            const moneyPush = (findIdProduct.price + findIdProduct.taxes + findIdProduct.ads) * findIdProduct.count;
            const custom_money = moneyPush + findId.money
            const buyCalc = Math.abs(moneyPush - findId.buys);
            req.moneyAdd = moneyPush;
            req.custom_money = custom_money;
            req.buys = buyCalc;
            req.reportId = report.map(r => r._id);
            /** @end @code **/
            next();
        } catch (error) {
            console.error("middleware error:", error);
            return res.status(500).json({ message: "Internal server error", error: error.message });
        }
    })
}

module.exports = {
    verifyTokenForProductDelete
}