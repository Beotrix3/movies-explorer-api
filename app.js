require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const helmet = require('helmet');
const { errors } = require('celebrate');
const rateLimit = require('express-rate-limit');
const usersRouter = require('./routes/users');
const moviesRouter = require('./routes/movies');
const auth = require('./middlewares/auth');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { createUser, authUser } = require('./controllers/users');
const { validUser, validUserAuth } = require('./middlewares/validate');
const NotFound = require('./errors/NotFound');

const { PORT = 3000 } = process.env;

const app = express();

app.use(express.json());

const options = {
  origin: [
    'https://movies-explorer.front.brx.nomoredomains.work',
    'https://api.movies-explorer.btrix.nomoredomains.rocks',
    'http://localhost:3000',
  ],
  methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
  preflightContinue: false,
  optionsSuccessStatus: 204,
  allowedHeaders: ['Content-Type', 'origin', 'Authorization'],
  credentials: true,
};

app.use('*', cors(options));

app.use(helmet());

mongoose.connect('mongodb://localhost:27017/bitfilmsdb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(requestLogger);

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests, please try again later.',
});

app.use(limiter);

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.post('/signup', validUser, createUser);
app.post('/signin', validUserAuth, authUser);

app.use('/', auth, moviesRouter);
app.use('/', auth, usersRouter);

app.use('*', () => {
  throw new NotFound('Запрашиваемый ресурс не найден');
});

app.use(errorLogger);

app.use(errors());

app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res
    .status(statusCode)
    .send({
      message: statusCode === 500
        ? 'На сервере произошла ошибка'
        : message,
    });
  next();
});

app.listen(PORT);
