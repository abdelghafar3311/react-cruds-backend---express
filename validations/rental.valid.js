const Joi = require("joi");

// valid post rental
const validPostRental = (obj) => {
    const schema = Joi.object({
        timeNumber: Joi.number().min(1).default(2),
        timeType: Joi.string().valid("m", "h", "d", "M", "y").default("d"),
        Room_Id: Joi.string().required(),
        Owner_Id: Joi.string().required(),
    });
    return schema.validate(obj);
};

// valid patch rental
const validPatchRental = (obj) => {
    const schema = Joi.object({
        timeNumber: Joi.number().min(1).default(2),
        timeType: Joi.string().valid("m", "h", "d", "M", "y").default("d"),
    });
    return schema.validate(obj);
};

// valid req rental accept
const validReqRentalAccept = (obj) => {
    const schema = Joi.object({
        isAccept: Joi.string().valid("accept", "reject").required(),
    });
    return schema.validate(obj);
};

module.exports = {
    validPostRental,
    validPatchRental,
    validReqRentalAccept
};