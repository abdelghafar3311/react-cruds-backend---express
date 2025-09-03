const Joi = require("joi");

const validateAreaPOST = (obj) => {
    const schema = Joi.object({
        nameArea: Joi.string().min(2).max(200).trim().required(),
        address: Joi.string().min(2).max(400).trim().required(),
        status: Joi.boolean().default(false),
        maxRooms: Joi.number().min(1).max(8).required(), // limit of rooms
    });

    return schema.validate(obj);
}

const validateAreaPUT = (obj) => {
    const schema = Joi.object({
        nameArea: Joi.string().min(2).max(200).trim(),
        address: Joi.string().min(2).max(400).trim(),
        status: Joi.boolean(),
    });

    return schema.validate(obj);
}

// message alarm
const validateAlarmMessage = (obj) => {
    const schema = Joi.object({
        isDeleted: Joi.boolean().required(),
    });

    return schema.validate(obj);
}

module.exports = {
    validateAreaPOST,
    validateAreaPUT,
    validateAlarmMessage
}