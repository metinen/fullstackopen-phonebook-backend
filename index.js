const express = require('express')
const app = express()
app.use(express.json())

let persons = [
    { id: 1, name: "Easter Bunny", number: "040 - 123456" },
    { id: 2, name: "Mary Poppendick", number: "050 - 123112" },
    { id: 3, name: "Dan Abramov", number: "044 - 9843456" },
    { id: 4, name: "Santa Claus", number: "0400 - 334456" },
]

app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id);
    const person = persons.find(e => e.id === id);
    if (person) {
        res.json(person)
    } else {
        console.log("404")
        res.status(404).end()
    }
})

app.get('/api/persons', (req, res) => {
    res.json(persons);
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

    const person = {
        id: Math.floor(Math.random() * 12000),
        ...req.body
    };
    persons = persons.concat(person);
    res.json(person);
})

app.get('/api/info', (req, res) => {
    const now = new Date(Date.now()).toISOString();
    res.send(`<p>Phonebook has info for ${persons.length} people </p>
     <p/>Now is ${now} <p>`);
})


const PORT = 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

