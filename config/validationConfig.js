const Joi = require("@hapi/joi");

const userSchemaValidation = Joi.object().keys({
  username: Joi.string()
    .alphanum()
    .min(5)
    .max(30)
    .required(),
  email: Joi.string()
    .email({ minDomainSegment: 2 })
    .required(),
  password: Joi.string()
});

const articleSchemaValidation = Joi.object().keys({
  title: Joi.string()
    .min(5)
    .max(50)
    .required(),
  createDate: Joi.date()
    .max("now")
    .iso()
    .required(),
  body: Joi.string()
    .min(50)
    .required(),
  theme: Joi.string()
    .max(50)
    .required()
});

const userValidate = user => {
  return Joi.validate(user, userSchemaValidation);
};
const articleValidate = article => {
  return Joi.validate(article, articleSchemaValidation);
};
module.exports = { userValidate, articleValidate };
