const jwt = require("jsonwebtoken");
const { secreteKey } = require("../values/env");
// for product verify
const { validateProduct } = require("../validations/buys.valid");
// Customer data
const { Customer } = require("../modules/Customer/Customer_Module")
const Rental = require("../modules/Rental/Rental");
const Profile = require("../modules/Customer/CustomerProfile");
// services
const { calculateTotalPay } = require("../services/productService");
// verify token
const { verifyToken } = require("./verifyToken");

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
            // check has profile
            const profile = await Profile.findOne({ Customer_Id: findId._id });
            if (!profile) {
                return res.status(400).json({ message: "You must create a profile first" });
            }

            // check pay
            const pay = (+req.body.price + +req.body.ads + +req.body.taxes) * +req.body.count;

            if (pay > findId.money) {
                return res.status(422).json({ message: "your money is not enough" })
            }
            // check rental found
            const rental = await Rental.findById(req.body.Rental_Id);
            if (!rental || rental.Customer_Id.toString() !== findId._id.toString()) {
                return res.status(404).json({ message: "rental not found" });
            }
            if (!rental || rental.isDeleted) {
                return res.status(403).json({ message: "Rental will delete" });
            }
            // create objects
            req.money = findId.money - pay;
            req.pay = pay;
            req.rental = rental;
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
            // 1. validate syntax
            for (const item of data) {
                const { error } = validateProduct(item);
                if (error) {
                    return res.status(400).json({
                        message: "syntax is wrong",
                        error: error.details[0].message
                    });
                }
            }

            // 2. fetch all rooms in one query
            const rentalsIds = data.map(item => item.Rental_Id);
            const rentals = await Rental.find({ _id: { $in: rentalsIds } }).lean();

            // 3. make fast lookup map
            const rentalMap = new Map(rentals.map(r => [r._id.toString(), r]));
            // check id
            const findId = await Customer.findById(req.customer.id);
            if (!findId) {
                return res.status(400).json({ message: "Your account could not be found in our records. Please try again or contact support." });
            }
            // 4. validate rooms existence and status
            for (const item of data) {
                const rental = rentalMap.get(item.Rental_Id.toString());
                if (!rental || rental.Customer_Id.toString() !== findId._id.toString()) {
                    return res.status(404).json({ message: "rental not found" });
                }

                if (rental.isDeleted) {
                    return res.status(403).json({ message: "Rental will delete" });
                }
            }

            // check has profile
            const profile = await Profile.findOne({ Customer_Id: findId._id });
            if (!profile) {
                return res.status(400).json({ message: "You must create a profile first" });
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