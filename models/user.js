const bcrypt = require('bcrypt');
const { Schema, model } = require('mongoose');
const { isEmail } = require('validator');
const UnauthorizedError = require('../errors/UnauthorizedError');

const userSchema = new Schema({
  email: {
    type: String,
    require: true,
    unique: true,
    validate: {
      validator(email) {
        return isEmail(email);
      },
      message: 'Введён некорректный email',
    },
  },
  password: {
    type: String,
    required: true,
    unique: true,
    select: false,
  },
  name: {
    type: String,
    require: true,
    minlength: 2,
    maxlength: 30,
  },
});

function findUserByCredentials(email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        throw new UnauthorizedError('Необходима авторизация');
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            throw new UnauthorizedError('Необходима авторизация');
          }
          return user;
        });
    });
}

userSchema.statics.findUserByCredentials = findUserByCredentials;

module.exports = model('user', userSchema);
