const Joi = require("joi");

// validate update product

const validateUpdateProduct = (obj) => {
    const schema = Joi.object({
        nameProduct: Joi.string().min(2).max(200).trim(),
        category: Joi.string().min(2).max(200).trim(),
        count: Joi.number().min(1).default(1),
        price: Joi.number().min(1),
        gain: Joi.number().min(1),
        taxes: Joi.number().min(0).default(0),
        ads: Joi.number().min(0).default(0),
        discount: Joi.number().min(0).default(0)
    });

    return schema.validate(obj);
}

module.exports = {
    validateUpdateProduct
}