// verify token
const { verifyToken } = require("./verifyToken");
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