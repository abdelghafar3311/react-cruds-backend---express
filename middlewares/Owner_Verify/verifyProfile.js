const { postProfileSchema, validateProfileUpdate } = require("../../validations/profile.valid");
const OwnerProfile = require("../../modules/Owners/OwnerProfile");
const { verifyToken } = require("../verifyToken");

// verify profile post data
const verifyProfileData = async (req, res, next) => {
    verifyToken(req, res, async () => {
        try {
            const { value, error } = postProfileSchema(req.body);
            if (error) {
                return res.status(400).json({ message: error.details[0].message });
            }

            // check if owner profile already exists
            const existingProfile = await OwnerProfile.findOne({ Owner_Id: req.owner._id }).lean();
            if (existingProfile) {
                return res.status(400).json({ message: "Owner profile already exists" });
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
            const { error, value } = validateProfileUpdate(req.body);
            if (error) {
                return res.status(400).json({ message: error.details[0].message });
            }
            // check if profile exists
            const profile = await OwnerProfile.findOne({ Owner_Id: req.owner.id }).lean();
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
            const profile = await OwnerProfile.findOne({ Owner_Id: req.owner.id }).lean();
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
            const profile = await OwnerProfile.findOne({ Owner_Id: req.owner.id }).lean();
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
