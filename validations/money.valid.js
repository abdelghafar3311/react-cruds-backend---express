const Joi = require("joi");
// static values
const MAX_MONEY = 5000
// validation money
const validateMoney = (obj) => {
    const schema = Joi.object({
        money: Joi.number().min(1).max(MAX_MONEY).required().messages({
            "number.base": "The money must be a number.",
            "number.min": "The money must be greater than 1.",
            "number.max": `The money must not exceed ${MAX_MONEY}.`,
            "any.required": "The money field is required."
        })
    });

    return schema.validate(obj, { abortEarly: false });
}

/**
 * @info_Push
 * when add money the max price is $100000
*/

// validation update money
const validateUpdateMoney = (obj) => {
    const schema = Joi.object({
        money: Joi.number().required().messages({
            "number.base": "The money must be a number.",
            "any.required": "The money field is required."
        })
    })

    return schema.validate(obj, { abortEarly: false });
}

module.exports = {
    validateMoney,
    validateUpdateMoney
}