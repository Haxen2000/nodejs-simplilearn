const express = require('express');
const router = express.Router();
const uuid = require('uuid');

let movies = require('../../Movies');

/* get all movies */
router.get('/', (req, res) => {
  res.json(movies);
});

/* create a new movie - expects json */
router.post('/', (req, res) => {
  const movie = req.body;
  console.log('Adding new movie', movie);
  movies.push(movie);
  res.send('Movie added!', movies);
});

/* search for a movie in the list by id */
router.get('/:id', (req, res) => {
  const id = req.params.id;

  for (let movie of movies) {
    if (movie.id === id) {
      res.json(movie);
      return;
    }
  }

  res.status(404).send('Movie not found');
})

/* delete movie */
router.delete('/:id', (req, res) => {
  const id = req.params.id;

  movies = movies.filter(movie => movie.id !== id);
  res.json({
    msg: 'Movie deleted', movies
  });
  
});

module.exports = router;