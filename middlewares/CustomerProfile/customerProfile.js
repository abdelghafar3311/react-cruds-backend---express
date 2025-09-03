const { postCustomerProfileSchema, validateCustomerProfileUpdate } = require("../../validations/customerProfile.valid");
const CustomerProfile = require("../../modules/Customer/CustomerProfile");
const { Customer } = require("../../modules/Customer/Customer_Module");
const { verifyToken } = require("../verifyToken");

// verify profile post data
const verifyProfileData = async (req, res, next) => {
    verifyToken(req, res, async () => {
        try {
            const { value, error } = postCustomerProfileSchema(req.body);
            if (error) {
                return res.status(400).json({ message: error.details[0].message });
            }
            // check if customer already exists
            const existingCustomer = await Customer.findOne({ _id: req.customer.id }).lean();
            if (!existingCustomer) {
                return res.status(400).json({ message: "customer not found" });
            }

            // check if customer profile already exists
            const existingProfile = await CustomerProfile.findOne({ Customer_Id: req.customer._id }).lean();
            if (existingProfile) {
                return res.status(400).json({ message: "customer profile already exists" });
            }

            // overwrite req.body with validated + defaulted values
            req.body = value;

            next();
        } catch (error) {
            console.error("Middleware error:", error);
            return res.status(500).json({ message: "Internal server error" });
        }
    });
};

// verify profile update data
const verifyProfileUpdate = async (req, res, next) => {
    verifyToken(req, res, async () => {
        try {
            const { error, value } = validateCustomerProfileUpdate(req.body);
            if (error) {
                return res.status(400).json({ message: error.details[0].message });
            }
            // check if customer already exists
            const existingCustomer = await Customer.findOne({ _id: req.customer.id }).lean();
            if (!existingCustomer) {
                return res.status(400).json({ message: "customer not found" });
            }
            // check if profile exists
            const profile = await CustomerProfile.findOne({ Customer_Id: req.customer.id }).lean();
            if (!profile) {
                return res.status(404).json({ message: "Profile not found" });
            }
            // overwrite req.body with validated + defaulted values
            req.body = value;
            req.profile = profile; // attach profile to req for further use
            next();
        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: "Internal Server Error" });
        }
    });
};

// verify get profile data

const verifyGetProfile = async (req, res, next) => {
    verifyToken(req, res, async () => {
        try {
            // check if profile exists
            const profile = await CustomerProfile.findOne({ Customer_Id: req.customer.id }).lean();
            if (!profile) {
                return res.status(404).json({ message: "Profile not found" });
            }
            req.profile = profile; // attach profile to req for further use
            next();
        } catch (error) {
            console.error("Middleware error:", error);
            return res.status(500).json({ message: "Internal server error" });
        }
    });
};

// delete profile data
const verifyDeleteProfile = async (req, res, next) => {
    verifyToken(req, res, async () => {
        try {
            // check if profile exists
            const profile = await CustomerProfile.findOne({ Customer_Id: req.customer.id }).lean();
            if (!profile) {
                return res.status(404).json({ message: "Profile not found" });
            }
            req.profile = profile; // attach profile to req for further use
            next();
        } catch (error) {
            console.error("Middleware error:", error);
            return res.status(500).json({ message: "Internal server error" });
        }
    });
};

module.exports = {
    verifyProfileData,
    verifyProfileUpdate,
    verifyGetProfile,
    verifyDeleteProfile
};
