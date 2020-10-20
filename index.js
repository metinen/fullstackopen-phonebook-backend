const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const app = express()
app.use(express.json())
morgan.token('body', (req, res) => JSON.stringify(req.body))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))
app.use(cors())
app.use(express.static('build'))
require('dotenv').config()
const Record = require('./models/Record')

let persons = [
    { id: 1, name: "Easter Bunny", number: "040 - 123456" },
    { id: 2, name: "Mary Poppendick", number: "050 - 123112" },
    { id: 3, name: "Dan Abramov", number: "044 - 9843456" },
    { id: 4, name: "Santa Claus", number: "0400 - 334456" },
]

app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id);
    Record.findById(req.params.id)
        .then(person => {
            if (person) {
                res.json(person)
            } else {
                res.status(404).end()
            }
        })
        .catch(error => {
            console.log(error)
            res.status(400).send({ error: 'malformatted id' })
        })

})

app.get('/api/persons', (req, res) => {
    Record.find({})
        .then(records => {
            res.json(records)
        })
        .catch(error => console.log(error.message))
})

app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id);
    persons = persons.filter(e => e.id !== id);
    res.status(204).end();
})

app.post('/api/persons', (req, res) => {
    if (!req.body.name || !req.body.number) {
        return res.status(400).json({ error: 'name or number missing' })
    }

    if (persons.some(e => e.name === req.body.name)) {
        return res.status(400).json({ error: 'name already exists' });
    }

    const person = new Record({
        id: Math.floor(Math.random() * 12000),
        ...req.body
    });
    person.save()
        .then(person => { res.json(person) })
        .catch(error => console.log(error.message))
})

app.get('/api/info', (req, res) => {
    const now = new Date(Date.now()).toISOString();
    res.send(`<p>Phonebook has info for ${persons.length} people </p>
     <p/>Now is ${now} <p>`);
})


const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

