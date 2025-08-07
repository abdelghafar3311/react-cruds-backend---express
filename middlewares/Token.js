const jwt = require("jsonwebtoken");
const { secreteKey } = require("../values/env");

const CreateToken = (data, expire = "3h") => {
    return jwt.sign(data, secreteKey, {
        expiresIn: expire
    })
}


module.exports = {
    CreateToken
};