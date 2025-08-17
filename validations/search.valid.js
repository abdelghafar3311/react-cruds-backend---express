const Joi = require("joi");


// validate search

const validateSearching = (obj) => {
    const schema = Joi.object({
        type: Joi.valid("name", "category").required(),
        word: Joi.string().min(1).max(200).trim().required()
    });
    return schema.validate(obj);
};

module.exports = {
    validateSearching
}