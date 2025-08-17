const Joi = require('joi');

const postProfileSchema = (obj) => {
    const schema = Joi.object({
        name: Joi.string()
            .min(3)
            .max(200)
            .required()
            .trim(),
        money: Joi.number()
            .default(0),
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
        status: Joi.boolean()
            .default(true),
        rating: Joi.number()
            .min(0)
            .max(5)
            .default(0)
    });

    return schema.validate(obj, { abortEarly: false, stripUnknown: true });
}

// validate profile when put profile
const validateProfileUpdate = (obj) => {
    const schema = Joi.object({
        name: Joi.string()
            .min(3)
            .max(200)
            .trim(),
        money: Joi.number().min(0)
            .default(0),
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
        status: Joi.boolean()
            .default(true)
    });

    return schema.validate(obj, { abortEarly: false, stripUnknown: true });
}

module.exports = {
    postProfileSchema,
    validateProfileUpdate
};
