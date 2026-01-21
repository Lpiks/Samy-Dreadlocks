const Joi = require('joi');

const registerValidation = (data) => {
    const schema = Joi.object({
        username: Joi.string().min(3).required(),
        password: Joi.string().min(6).required(),
        role: Joi.string().valid('admin', 'user')
    });
    return schema.validate(data);
};

const loginValidation = (data) => {
    const schema = Joi.object({
        username: Joi.string().min(3).required(),
        password: Joi.string().min(6).required()
    });
    return schema.validate(data);
};

const productValidation = (data) => {
    const schema = Joi.object({
        name: Joi.string().min(3).required(),
        price: Joi.string().required(), // Keeping as string as per original code, or change to number? Original schema likely string or number.
        description: Joi.string().required(),
        image: Joi.string().required(),
        category: Joi.string().required(),
        inStock: Joi.boolean()
    });
    return schema.validate(data);
};

module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;
module.exports.productValidation = productValidation;
