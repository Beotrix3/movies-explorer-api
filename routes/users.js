const { Router } = require('express');
const { getCurrentUser, updateUser } = require('../controllers/users');
const { validId, validUserUpdate } = require('../middlewares/validate');

const usersRouter = Router();

usersRouter.get('/users/me', validId, getCurrentUser);
usersRouter.patch('/users/me', validUserUpdate, updateUser);

module.exports = usersRouter;
