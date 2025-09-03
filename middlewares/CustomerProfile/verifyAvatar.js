const CustomerProfile = require("../../modules/Customer/CustomerProfile");
const { verifyToken } = require("../verifyToken");

// verify avatar (put and delete) upload data
const verifyImage = async (req, res, next) => {
    verifyToken(req, res, async () => {
        try {
            // check if owner profile already exists
            const existingProfile = await CustomerProfile.findOne({ Customer_Id: req.owner.id }).lean();
            if (!existingProfile) {
                return res.status(400).json({ message: "please make your profile first then upload your avatar" });
            }
            // push profile to req
            req.profile = existingProfile

            next();
        } catch (error) {
            console.error("Middleware error:", error);
            return res.status(500).json({ message: "Internal server error" });
        }
    });
};

module.exports = {
    verifyImage
};