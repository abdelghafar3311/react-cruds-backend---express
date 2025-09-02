const Joi = require("joi");

// post Discount
const validPostDiscount = (obj) => {
    const schema = Joi.object({
        new_price: Joi.number().min(0).required(),
    });
    return schema.validate(obj);
};

// put Discount
const validPutDiscount = (obj) => {
    const schema = Joi.object({
        new_price: Joi.number().min(0),
        Room_Id: Joi.string(),
    });
    return schema.validate(obj);
};


module.exports = {
    validPostDiscount,
    validPutDiscount
}