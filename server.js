const express = require('express');
const app = express();
app.use(express.json());

let actors = [], movies = [], actorId = 1, movieId = 1;

const findActorById = (id) => actors.find(actor => actor.id == id);
const isValidDate = (date) => new Date(date) <= new Date();

app.get('/actors', (req, res) => res.json(actors));

app.get('/actors/:id', (req, res) => {
    const actor = findActorById(req.params.id);
    if (!actor) {
        return res.status(404).json({ text: 'Actor not found' });
    }
    res.json(actor);
});

app.post('/actors', (req, res) => {
    const { firstName, lastName, dateOfBirth } = req.body;
    if (!isValidDate(dateOfBirth))
        return res.status(400).json({ text: 'Date of birth cannot be in the future' });
    actors.push({ id: actorId++, firstName, lastName, dateOfBirth });
    res.status(201).json(actors[actors.length - 1]);
});


app.put('/actors/:id', (req, res) => {
    const actor = findActorById(req.params.id);
    if (!actor)
        return res.status(404).json({ text: 'Actor not found' });
    const { firstName, lastName, dateOfBirth } = req.body;
    if (!isValidDate(dateOfBirth))
        return res.status(400).json({ text: 'Invalid date' });
    Object.assign(actor, { firstName, lastName, dateOfBirth });
    res.json(actor);
});

app.delete('/actors/:id', (req, res) => {
    const index = actors.findIndex(actor => actor.id == req.params.id);
    if (index == -1)
        return res.status(404).json({ text: 'Actor not found' });
    actors.splice(index, 1);
    res.status(204).send();
});

app.post('/movies', (req, res) => {
    const { title, creationDate, actorId } = req.body;
    const actor = findActorById(actorId);
    if (!actor) return res.status(400).json({ text: 'Invalid actor' });
    movies.push({ id: movieId++, title, creationDate, actor });
    res.status(201).json(movies[movies.length - 1]);
});

app.get('/movies', (req, res) => res.json(movies));

app.get('/movies/:id', (req, res) => {
    const movie = movies.find(m => m.id == req.params.id);
    movie ? res.json(movie) : res.status(404).json({ text: 'Movie not found' });
});

app.put('/movies/:id', (req, res) => {
    const movie = movies.find(m => m.id == req.params.id);
    if (!movie)
        return res.status(404).json({ text: 'Movie not found' });
    const { title, creationDate, actorId } = req.body;
    if (actorId) {
        const actor = findActorById(actorId);
        if (!actor)
            return res.status(400).json({ text: 'Invalid actor' });
        movie.actor = actor;
    }
    Object.assign(movie, { title, creationDate });
    res.json(movie);
});

app.delete('/movies/:id', (req, res) => {
    const index = movies.findIndex(m => m.id == req.params.id);
    if (index === -1)
        return res.status(404).json({ text: 'Movie not found' });
    movies.splice(index, 1);
    res.status(204).send();
});

app.listen(2999, 'localhost');