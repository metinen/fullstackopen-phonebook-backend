const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const app = express()
app.use(express.static('build'))
app.use(express.json())
morgan.token('body', (req, res) => JSON.stringify(req.body))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))
app.use(cors())
require('dotenv').config()
const Record = require('./models/Record')

app.get('/api/persons/:id', (req, res, next) => {
    Record.findById(req.params.id)
        .then(person => {
            if (person) {
                res.json(person)
            } else {
                res.status(404).end()
            }
        })
        .catch(error => next(error))
})

app.get('/api/persons', (req, res, next) => {
    Record.find({})
        .then(records => {
            res.json(records)
        })
        .catch(error => next(error))
})

app.delete('/api/persons/:id', (req, res, next) => {
    Record.findByIdAndRemove(req.params.id)
        .then(result => {
            res.status(204).end();
        })
        .catch(error => next(error))
})

app.post('/api/persons', (req, res, next) => {
    if (!req.body.name || !req.body.number) {
        return res.status(400).json({ error: 'name or number missing' })
    }

    // if (persons.some(e => e.name === req.body.name)) {
    //     return res.status(400).json({ error: 'name already exists' });
    // }

    const person = new Record({
        id: Math.floor(Math.random() * 12000),
        ...req.body
    });
    person.save()
        .then(person => res.json(person))
        .catch(error => next(error))
})

app.put('/api/persons/:id', (req, res, next) => {
    const body = req.body;
    const person = { name: body.name, number: body.number }

    Record.findByIdAndUpdate(req.params.id, person, { new: true })
        .then(updatedPerson => res.json(updatedPerson))
        .catch(error => next(error))
})

app.get('/api/info', (req, res) => {
    const now = new Date(Date.now()).toISOString();
    res.send(`<p>Phonebook has info for ${persons.length} people </p>
     <p/>Now is ${now} <p>`);
})

const errorHandler = (error, req, res, next) => {
    console.log(error.message)

    if (error.name === 'CastError') {
        return res.status(400).send({ error: 'malformatted id' })
    }
    // forward to express default error handler
    next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

