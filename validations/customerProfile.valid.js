const Joi = require('joi');

const postCustomerProfileSchema = (obj) => {
    const schema = Joi.object({
        name: Joi.string()
            .min(3)
            .max(200)
            .required()
            .trim(),
        Avatar: Joi.string()
            .default("images/owner.png")
            .trim(),
        phone: Joi.string()
            .pattern(/^\+?\d{10,15}$/)
            .trim(),
        address: Joi.string()
            .trim(),
        description: Joi.string()
            .trim().allow(""),
    });

    return schema.validate(obj, { abortEarly: false, stripUnknown: true });
}

// validate profile when put profile
const validateCustomerProfileUpdate = (obj) => {
    const schema = Joi.object({
        name: Joi.string()
            .min(3)
            .max(200)
            .trim(),
        Avatar: Joi.string().uri({ allowRelative: true })
            .default("images/owner.png")
            .trim(),
        phone: Joi.string()
            .pattern(/^\+?\d{10,15}$/)
            .trim(),
        address: Joi.string()
            .trim(),
        description: Joi.string()
            .trim().allow(""),
    });

    return schema.validate(obj, { abortEarly: false, stripUnknown: true });
}

module.exports = {
    postCustomerProfileSchema,
    validateCustomerProfileUpdate
};
