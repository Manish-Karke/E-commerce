const Joi = require('joi')

const cartValidation = Joi.object({
    items: Joi.object({
        quantity: Joi.number().required(),
    }).required(),
    coupon: Joi.string().optional().default(null).allow("", null)
})

module.exports = cartValidation