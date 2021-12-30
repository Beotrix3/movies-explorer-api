const { Router } = require('express');
const { getMovies, createMovie, removeMovie } = require('../controllers/movies');
const { validId, validMovie } = require('../middlewares/validate');

const moviesRouter = Router();

moviesRouter.get('/movies', getMovies);
moviesRouter.post('/movies', validMovie, createMovie);
moviesRouter.delete('/movies/:_id', validId, removeMovie);

module.exports = moviesRouter;
