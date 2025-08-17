const jwt = require("jsonwebtoken");
const { secreteKey } = require("../values/env");


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
        next();
    } catch (error) {
        return res.status(401).json({ message: "Invalid token" });
    }
};

module.exports = {
    verifyToken
};