const { verifyToken } = require("../verifyToken");
// validation
const { validateTransMoney } = require("../../validations/transMoney.valid");

// modules
const Owner = require("../../modules/Owners/Owner");
const { Customer } = require("../../modules/Customer/Customer_Module");
const ProfileOwner = require("../../modules/Owners/OwnerProfile");



const TransMoneyVerify = (req, res, next) => {
    verifyToken(req, res, async () => {
        try {
            // valid check
            const { value, error } = validateTransMoney(req.body);
            if (error) {
                return res.status(400).json({ message: error.details[0].message });
            }

            req.body = value;
            // check amount
            if (value.money <= 0) {
                return res.status(400).json({ message: "Transfer amount must be greater than zero" });
            }

            // check user
            const [user, UserTrans] = await Promise.all([
                req.body.user_type === "Customer" ? Customer.findById(req.body.user_id) : Owner.findById(req.body.user_id),
                req.user.type === "customer" ? Customer.findById(req.user.id) : ProfileOwner.findOne({ Owner_Id: req.user.id })
            ]);

            // check user is find or no
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }

            // check money is enough or no
            if (!UserTrans) {
                return res.status(404).json({ message: "Sender not found" });
            }
            if (UserTrans.money < value.money) {
                return res.status(400).json({ message: "You don't have enough money" });
            }

            if (req.body.user_id === req.user.id) {
                return res.status(400).json({ message: "You cannot transfer money to yourself" });
            }


            next();
        } catch (error) {
            console.error("Middleware error:", error);
            return res.status(500).json({ message: "Internal server error" });
        }
    });
}

module.exports = {
    TransMoneyVerify
}