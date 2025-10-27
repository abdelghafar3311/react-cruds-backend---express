const { verifyToken } = require("../verifyToken");

// valid
const { validArrayObjectId } = require("../../validations/notify.valid");

const Notification = require("../../modules/Notification/Notification");
const { Customer } = require("../../modules/Customer/Customer_Module");
const Owner = require("../../modules/Owners/Owner");

// verify get all notification
const verifyGetNotifies = async (req, res, next) => {
    verifyToken(req, res, async () => {
        try {
            const Model = req.user.type === "customer" ? Customer : Owner;
            const userType = req.user.type === "customer" ? "Customer" : "Owner";
            const user = await Model.findById(req.user.id);

            const notifications = await Notification.find({ User_Id: user._id, User_Type: userType }).lean();
            req.notifies = notifications;
            next();
        } catch (error) {
            console.error("Middleware error:", error);
            return res.status(500).json({ message: "Internal server error" });
        }
    });
};

// verify array has ids from notifications
const verifyArrayNotify = async (req, res, next) => {
    verifyToken(req, res, async () => {
        try {
            const { error, value } = validArrayObjectId(req.body);
            if (error) {
                return res.status(400).json({ message: error.details[0].message });
            }
            // Check user existence
            const Model = req.user.type === "customer" ? Customer : Owner;
            const user = await Model.findById(req.user.id);
            if (!user) {
                return res.status(403).json({
                    message: "You are not allowed to get notifications, please sign in first."
                });
            }
            // check notifications is find or no
            const notifies = await Notification.find({ _id: { $in: value } });
            if (notifies.length !== value.length) {
                return res.status(404).json({ message: "Some notifications not found" });
            }

            req.ids = value;
            next();
        } catch (error) {
            console.error("Middleware error:", error);
            return res.status(500).json({ message: "Internal server error" });
        }
    })
}

module.exports = {
    verifyGetNotifies,
    verifyArrayNotify
}