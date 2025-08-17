const Joi = require("joi");

// joi schema for register
const validateOwnerRegisterSchema = (obj) => {
    const schema = Joi.object({
        username: Joi.string().min(3).max(200).trim().required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required(),
    });

    return schema.validate(obj)
}

// joi schema for Login
const validateOwnerLoginSchema = (obj) => {
    const schema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required(),
    });

    return schema.validate(obj)
}

module.exports = {
    validateOwnerRegisterSchema,
    validateOwnerLoginSchema
}