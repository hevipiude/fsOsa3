require('dotenv').config()
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

app.use(express.static('build'))

const Contact = require('./models/contact.js')

// let persons = [
//   {
//     name: 'Arto Hellas',
//     number: '040-123456',
//     id: 1,
//   },
//   {
//     name: 'Ada Lovelace',
//     number: '39-44-5323523',
//     id: 2,
//   },
//   {
//     name: 'Dan Abramov',
//     number: '12-43-234345',
//     id: 3,
//   },
//   {
//     name: 'Mary Poppendieck',
//     number: '39-23-6423122',
//     id: 4,
//   },
// ]

// const generateId = () => {
//   const maxId = persons.length > 0 ? Math.max(...persons.map((n) => n.id)) : 0
//   return maxId + 1
// }

app.get('/api/contacts', (req, res) => {
  Contact.find(req.params.id).then((contact) => {
    res.json(contact)
    console.log(contact)
  })
})

// muokkaa kantakelposeksi
app.get('/api/contacts/:id', (req, res) => {
  Contact.findById(req.params.id)
    .then((contact) => {
      if (contact) {
        res.json(contact)
      } else {
        res.status(404).end()
      }
    })
    .catch((error) => {
      console.log(error)
      res.status(400).send({ error: 'malformatted id' })
    })
})

// muokkaa kantakelposeksi
app.delete('/api/contacts/:id', (req, res) => {
  const id = +req.params.id
  const user = contacts.findIndex((u) => u.id === id)
  if (contacts.find((u) => u.id === id) != null) {
    contacts.splice(user, 1)
    res.send()
  } else {
    res.status(404).send(`User with id: ${id} not found`)
  }
})

// muokkaa kantakelposeksi
app.get('/info', (req, res) => {
  res.send(
    `<p>Phonebook has info for ${
      contacts.length
    } people.</p><p>${new Date()}</p>`
  )
})

app.post('/api/contacts', (request, response) => {
  const body = request.body

  if (body.name === undefined) {
    return response.status(400).json({ error: 'name missing' })
  }

  const contact = new Contact({
    name: body.name,
    number: body.number,
  })

  contact.save().then((savedContact) => {
    response.json(savedContact)
  })
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
