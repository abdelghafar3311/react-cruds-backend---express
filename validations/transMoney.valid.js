const Joi = require("joi");

const validateTransMoney = (obj) => {
    const schema = Joi.object({
        user_id: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).required(),
        money: Joi.number().min(1).required(),
        user_type: Joi.string().valid("Customer", "Owner").required()
    });

    return schema.validate(obj);
}

module.exports = { validateTransMoney }