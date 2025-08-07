const Joi = require("joi");

const validateSellsCount = (obj) => {
    const schema = Joi.object({
        product_id: Joi.string().regex(/^[0-9a-fA-F]{24}$/).min(1).trim().required().messages({
            "string.base": "Product ID must be a string.",
            "string.empty": "Product ID is required.",
            "any.required": "Product ID is required."
        }),
        count: Joi.number().min(1).required().messages({
            "number.base": "Count must be a number.",
            "number.min": "Count must be at least 1.",
            "any.required": "Count is required."
        })
    });

    return schema.validate(obj);
}

module.exports = {
    validateSellsCount
}