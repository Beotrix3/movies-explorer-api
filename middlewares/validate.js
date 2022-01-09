const { celebrate, Joi } = require('celebrate');
const validator = require('validator');

const validCustom = (url) => {
  const result = validator.isURL(url);
  if (!result) {
    throw new Error('URL is not valid');
  }
  return url;
};

const validId = celebrate({
  params: Joi.object().keys({
    _id: Joi.string().alphanum().length(24).hex(),
  }),
});

const validMovie = celebrate({
  body: Joi.object().keys({
    movieId: Joi.number().integer().required(),
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().required().custom(validCustom),
    trailer: Joi.string().required().custom(validCustom),
    thumbnail: Joi.string().required().custom(validCustom),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
  }),
});

const validUser = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

const validUserUpdate = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().required().email(),
  }),
});

const validUserAuth = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

module.exports = {
  validId,
  validMovie,
  validUser,
  validUserUpdate,
  validUserAuth,
};
