const jwt = require("jsonwebtoken");
const { secreteKey, secreteKeyDelete, secreteKeyRental, secreteKeySYS } = require("../values/env");

const CreateToken = (data, expire = "1d") => {
    return jwt.sign(data, secreteKey, {
        expiresIn: expire
    })
}

const CreateTokenSYS = (data, expire = "1d") => {
    return jwt.sign(data, secreteKeySYS, {
        expiresIn: expire
    })
}


const CreateDeleteToken = (data, expire) => {
    return jwt.sign(data, secreteKeyDelete, {
        expiresIn: expire
    })
}

const CreateTokenNotifiesRead = (data, expire = "2h") => {
    return jwt.sign(data, secreteKeyRental, {
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
    CreateTokenRental,
    CreateTokenNotifiesRead,
    CreateTokenSYS
};