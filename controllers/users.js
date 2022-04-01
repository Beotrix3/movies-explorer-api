const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/user');

const NotFound = require('../errors/NotFound');
const BadRequest = require('../errors/BadRequest');
const Conflict = require('../errors/Conflict');

const { NODE_ENV, JWT_SECRET } = process.env;

const getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .orFail()
    .catch(() => next(new NotFound('Запрашиваемый ресурс не найден')))
    .then((currentUser) => res.send({ currentUser }))
    .catch(next);
};

const updateUser = (req, res, next) => {
  const { name, email } = req.body;
  const userId = req.user._id;

  User.findByIdAndUpdate(userId, { name, email }, { new: true, runValidators: true })
    .then((user) => res.send({ user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadRequest(err.message);
      }
      throw err;
    })
    .catch(next);
};

const createUser = (req, res, next) => {
  const {
    name, email, password,
  } = req.body;

  User.findOne({ email })
    .then((user) => {
      if (user) {
        throw new Conflict('Пользователь с данным email уже существует');
      } else {
        return bcrypt.hash(password, 10);
      }
    })
    .then((hash) => User.create({
      name, email, password: hash,
    }))
    .then((user) => res.send({
      data: {
        name: user.name, email: user.email,
      },
    }))
    .catch(next);
};

const authUser = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'secret-key',
        { expiresIn: '7d' },
      );
      res.send({ token, message: 'Авторизация прошла успешно' });
    })
    .catch(next);
};

module.exports = {
  getCurrentUser,
  updateUser,
  createUser,
  authUser,
};
