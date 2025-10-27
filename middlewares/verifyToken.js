const jwt = require("jsonwebtoken");
const { secreteKey, secreteKeyRental, secreteKeyDelete } = require("../values/env");


// verify token middleware
const verifyToken = (req, res, next) => {
    const token = req.headers.token || req.headers.authorization?.split(" ")[1];

    if (!token) {
        return res.status(400).json({ message: "Token is not found, please provide a token" });
    }

    try {
        const decode = jwt.verify(token, secreteKey);
        req.owner = decode; // Assuming req.owner is needed for profile operations
        req.customer = decode; // Assuming req.customer is also needed
        req.user = decode; // Assuming req.user is needed for general operations
        next();
    } catch (error) {
        return res.status(401).json({ message: "Invalid token" });
    }
};

// verify delete token middleware
const verifyRentalToken = (token) => {
    try {
        const decoded = jwt.verify(token, secreteKeyRental);
        return {
            isValid: true,
            data: decoded
        };
    } catch (error) {
        return {
            isValid: false,
            data: null,
            reason: error// TokenExpiredError | JsonWebTokenError
        };
    }
};

// verify delete token middleware
const verifyNotifyReadToken = (token) => {
    try {
        const decoded = jwt.verify(token, secreteKeyRental);
        return {
            isValid: true,
            data: decoded
        };
    } catch (error) {
        return {
            isValid: false,
            data: null,
            reason: error// TokenExpiredError | JsonWebTokenError
        };
    }
};

const verifyNotifyDeleteToken = (token) => {
    try {
        const decoded = jwt.verify(token, secreteKeyDelete);
        return {
            isValid: true,
            data: decoded
        };
    } catch (error) {
        return {
            isValid: false,
            data: null,
            reason: error// TokenExpiredError | JsonWebTokenError
        };
    }
};

module.exports = {
    verifyToken,
    verifyRentalToken,
    verifyNotifyReadToken,
    verifyNotifyDeleteToken
};