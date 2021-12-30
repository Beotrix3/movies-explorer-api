const { Schema, model } = require('mongoose');

const linkRegExp = /(http:\/\/|https:\/\/)(www)*[a-z0-9\-._~:/?#[\]@!$&'()*+,;=]+#*/;

const movieSchema = new Schema({
  country: {
    type: String,
    require: true,
  },
  director: {
    type: String,
    require: true,
  },
  duration: {
    type: Number,
    require: true,
  },
  year: {
    type: String,
    require: true,
  },
  description: {
    type: String,
    require: true,
  },
  image: {
    type: String,
    require: true,
    validate: {
      validator(link) {
        return linkRegExp.test(link);
      },
      message: 'Неверный url адрес',
    },
  },
  trailer: {
    type: String,
    require: true,
    validate: {
      validator(link) {
        return linkRegExp.test(link);
      },
      message: 'Неверный url адрес',
    },
  },
  thumbnail: {
    type: String,
    require: true,
    validate: {
      validator(link) {
        return linkRegExp.test(link);
      },
      message: 'Неверный url адрес',
    },
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  movieId: {
    type: Number,
    ref: 'movie',
    required: true,
    unique: true,
  },
  nameRU: {
    type: String,
    require: true,
  },
  nameEN: {
    type: String,
    require: true,
  },
});

module.exports = model('movie', movieSchema);
