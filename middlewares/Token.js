const jwt = require("jsonwebtoken");
const { secreteKey, secreteKeyDelete } = require("../values/env");

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

module.exports = {
    CreateToken,
    CreateDeleteToken
};