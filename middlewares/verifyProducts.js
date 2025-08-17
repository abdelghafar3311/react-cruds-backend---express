const jwt = require("jsonwebtoken");
const { secreteKey } = require("../values/env");
// for product verify
const { validateSearching } = require("../validations/search.valid");
const { validateUpdateProduct } = require("../validations/updateProduct.valid");
// data Modules
const { Product } = require("../modules/Product/Product")
const { Customer } = require("../modules/Customer/Customer_Module")
// verify token
const { verifyToken } = require("./verifyToken");
// verify for get products
const verifyTokenForProductsGet = async (req, res, next) => {
    verifyToken(req, res, async () => {
        try {
            // check id
            const findId = await Customer.findById(req.customer.id);
            if (!findId) {
                return res.status(400).json({ message: "Your account could not be found in our records. Please try again or contact support." });
            }

            next();
        } catch (error) {
            console.error("middleware error:", error);
            return res.status(500).json({ message: "Internal server error", error: error.message });
        }
    })
}

// put verify product
const verifyTokenForProductPut = async (req, res, next) => {
    verifyToken(req, res, async () => {
        try {
            // validate
            const { error } = validateUpdateProduct(req.body);
            if (error) {
                return res.status(400).json({ message: "syntax is wrong", error: error.details[0].message })
            }
            // check id
            const findId = await Customer.findById(req.customer.id);
            if (!findId) {
                return res.status(400).json({ message: "Your account could not be found in our records. Please try again or contact support." });
            }
            // check id === customer id
            const findIdProduct = await Product.findOne({ _id: req.params.id, customer_id: req.customer.id })
            if (!findIdProduct) {
                return res.status(403).json({ message: "You are not allowed to update product for another account." });
            }

            const Gain = req.body.gain !== undefined ? +req.body.gain : findIdProduct.gain;
            const Discount = req.body.discount !== undefined ? +req.body.discount : findIdProduct.discount;

            if (Discount > Gain) {
                return res.status(400).json({ message: "The discount must be less than the gain." })
            }

            if (req.body.nameProduct && req.body.nameProduct !== findIdProduct.nameProduct) {
                const isNameExist = await Product.findOne({
                    nameProduct: req.body.nameProduct,
                    customer_id: req.customer.id,
                    _id: { $ne: findIdProduct._id }
                });

                if (isNameExist) {
                    return res.status(400).json({ message: "The product name is already used by another product." });
                }
            }
            const oldValues = {
                price: findIdProduct.price,
                taxes: findIdProduct.taxes,
                ads: findIdProduct.ads,
                count: findIdProduct.count
            };

            const newValues = {
                price: req.body.price ?? oldValues.price,
                taxes: req.body.taxes ?? oldValues.taxes,
                ads: req.body.ads ?? oldValues.ads,
                count: req.body.count ?? oldValues.count
            };

            const financialKeys = ["price", "taxes", "ads", "count"];
            const changedFinancial = financialKeys.some(key => oldValues[key] !== newValues[key]);
            const newMoneyProduct = (newValues.price + newValues.taxes + newValues.ads) * newValues.count;

            const moneyProduct = (findIdProduct.price + findIdProduct.taxes + findIdProduct.ads) * findIdProduct.count
            // customer's money
            const customerMoney = findId.money + moneyProduct;
            // buy update
            const BuyUpdate = findId.buys - moneyProduct;
            // check changes is right
            if (changedFinancial && customerMoney < newMoneyProduct) {
                return res.status(400).json({
                    message: "Not enough balance to update this product."
                });
            }
            // create objects
            req.moneyCustomer = customerMoney;
            req.buysCustomer = BuyUpdate;
            req.updateMoneySystem = changedFinancial;
            req.newMoneyOfNewProduct = newMoneyProduct;
            next();
        } catch (error) {
            console.error("middleware error:", error);
            return res.status(500).json({ message: "Internal server error", error: error.message });
        }
    })
}

// verify for search product
const verifyTokenForProductSearch = async (req, res, next) => {
    verifyToken(req, res, async () => {
        try {
            // validate
            const { error } = validateSearching(req.body);
            if (error) {
                return res.status(400).json({ message: "syntax is wrong", error: error.details[0].message })
            }
            // check id
            const findId = await Customer.findById(req.customer.id);
            if (!findId) {
                return res.status(400).json({ message: "Your account could not be found in our records. Please try again or contact support." });
            }

            next();
        } catch (error) {
            console.error("middleware error:", error);
            return res.status(500).json({ message: "Internal server error", error: error.message });
        }
    })
}



module.exports = {
    verifyTokenForProductsGet,
    verifyTokenForProductPut,
    verifyTokenForProductSearch
};