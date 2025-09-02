const jwt = require("jsonwebtoken");
const { secreteKey, secreteKeyDelete, secreteKeyRental } = require("../values/env");

const CreateToken = (data, expire = "3h") => {
    return jwt.sign(data, secreteKey, {
        expiresIn: expire
    })
}


const CreateDeleteToken = (data, expire) => {
    return jwt.sign(data, secreteKeyDelete, {
        expiresIn: expire
    })
}

const CreateTokenRental = (data, expire = "2h") => {
    return jwt.sign(data, secreteKeyRental, {
        expiresIn: expire
    })
}

module.exports = {
    CreateToken,
    CreateDeleteToken,
    CreateTokenRental
};