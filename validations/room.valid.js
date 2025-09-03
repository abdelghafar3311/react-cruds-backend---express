const Joi = require("joi");

// verify put room update request
const validUpdateRoom = (obj) => {
    const schema = Joi.object({
        nameRoom: Joi.string().min(3).max(50).optional(),
        NumberRoom: Joi.number().optional(),
        price: Joi.number().min(0).optional(),
        description: Joi.string().max(500).optional(),
        status: Joi.boolean().default(false).optional(),
        length: Joi.number().min(1).max(100).default(5).optional(),
        width: Joi.number().min(1).max(100).default(4).optional(),
        Discount: Joi.number().min(50).default(0).optional(),
        Duration: Joi.string().valid("m", "h", "d", "M", "y").default("M").optional(),
    });

    return schema.validate(obj);
}

// create new room validation
const validCreateRoom = (obj) => {
    const schema = Joi.object({
        nameRoom: Joi.string().min(3).max(50).required(),
        NumberRoom: Joi.number().required(),
        price: Joi.number().min(0).required(),
        description: Joi.string().max(500).optional(),
        status: Joi.boolean().default(false).optional(),
        length: Joi.number().min(1).max(100).default(5).optional(),
        width: Joi.number().min(1).max(100).default(4).optional(),
        Area_Id: Joi.string().required(),
        Discount: Joi.number().min(50).default(0).optional(),
        Duration: Joi.string().valid("m", "h", "d", "M", "y").default("M").optional(),
    });
    return schema.validate(obj);
}


module.exports = {
    validUpdateRoom,
    validCreateRoom
};