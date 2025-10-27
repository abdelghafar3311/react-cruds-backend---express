const Joi = require("joi");

// valid array string has id of mongodb
const validArrayObjectId = (obj) => {
    const schema = Joi.array().items(Joi.string().pattern(/^[0-9a-fA-F]{24}$/).required());
    return schema.validate(obj);
}

module.exports = {
    validArrayObjectId
}