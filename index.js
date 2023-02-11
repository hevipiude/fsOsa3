const express = require('express')
const app = express()
app.use(express.json())
const morgan = require('morgan')

//POST metodin sisällön logitus
morgan.token('body', (req) => {
  return JSON.stringify(req.body)
})
app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :body')
)

const cors = require('cors')
app.use(cors())
let persons = [
  {
    name: 'Arto Hellas',
    number: '040-123456',
    id: 1,
  },
  {
    name: 'Ada Lovelace',
    number: '39-44-5323523',
    id: 2,
  },
  {
    name: 'Dan Abramov',
    number: '12-43-234345',
    id: 3,
  },
  {
    name: 'Mary Poppendieck',
    number: '39-23-6423122',
    id: 4,
  },
]

const generateId = () => {
  const maxId = persons.length > 0 ? Math.max(...persons.map((n) => n.id)) : 0
  return maxId + 1
}

app.get('/api/persons', (req, res) => {
  res.json(persons)
})

app.get('/api/persons/:id', (req, res) => {
  const id = +req.params.id
  const user = persons.find((u) => u.id === id)
  if (user != null) {
    res.send(user)
  } else {
    res.status(404).send(`User with id: ${id} not found`)
  }
})

app.delete('/api/persons/:id', (req, res) => {
  const id = +req.params.id
  const user = persons.findIndex((u) => u.id === id)
  if (persons.find((u) => u.id === id) != null) {
    persons.splice(user, 1)
    res.send()
  } else {
    res.status(404).send(`User with id: ${id} not found`)
  }
})

app.get('/info', (req, res) => {
  res.send(
    `<p>Phonebook has info for ${
      persons.length
    } people.</p><p>${new Date()}</p>`
  )
})

app.post('/api/persons', (request, response) => {
  const body = request.body

  if (!body.name) {
    return response.status(400).json({
      error: 'name missing',
    })
  }

  if (!body.number) {
    return response.status(400).json({
      error: 'number missing',
    })
  }

  if (persons.find((u) => u.name === body.name)) {
    return response.status(409).json({
      error: 'name must be unique',
    })
  }

  const note = {
    name: body.name,
    number: body.number,
    id: generateId(),
  }

  persons = persons.concat(note)

  response.json(note)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
