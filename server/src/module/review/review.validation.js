const Joi = require("joi");

const reviewValidation = Joi.object({
  // product: Joi.string().custom(objectId).required(),
  // user: Joi.string().custom(objectId).required(),
  rating: Joi.number().min(1).max(5).optional(),
  body: Joi.string().trim().min(3).optional(),
});

module.exports = reviewValidation;
