const Joi = require("joi");

// validate product when post new product

const validateProduct = (obj) => {
    const schema = Joi.object({
        nameProduct: Joi.string().min(2).max(200).trim().required(),
        category: Joi.string().min(2).max(200).trim().required(),
        count: Joi.number().min(1).default(1),
        price: Joi.number().min(1).required(),
        gain: Joi.number().min(1).required(),
        taxes: Joi.number().min(0).default(0),
        ads: Joi.number().min(0).default(0),
        discount: Joi.number().min(0).default(0),
        Rental_Id: Joi.string().required(),
    });

    return schema.validate(obj);
}

module.exports = {
    validateProduct
}