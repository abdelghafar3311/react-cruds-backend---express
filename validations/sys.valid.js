const Joi = require("joi");

const validSysPass = (obj) => {
    const schema = Joi.object({
        sysPass: Joi.string().min(6).required(),
    });

    return schema.validate(obj);
}

module.exports = { validSysPass }