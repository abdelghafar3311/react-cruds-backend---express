const jwt = require("jsonwebtoken");
const { secreteKey } = require("../values/env");



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
// in Update Customer
const verifyTokenWithCustomerToUpdate = (req, res, next) => {
    verifyToken(req, res, () => {
        if (req.customer.id !== req.params.id) {
            return res.status(403).json({ message: "You are not authorized to perform this action." })
        }

        next();
    })
}

// in Delete Customer
const verifyTokenWithCustomerToDelete = (req, res, next) => {
    verifyToken(req, res, () => {
        const isOwner = req.customer.id === req.params.id;
        if (!isOwner) {
            return res.status(403).json({ message: "You are not authorized to perform this action.", isAdmin })
        }

        next();
    })
}


module.exports = {
    verifyTokenWithCustomerToUpdate,
    verifyTokenWithCustomerToDelete
};