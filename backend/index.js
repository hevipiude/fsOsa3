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

const errorHandler = (error, req, res, next) => {
  const body = req.body
  console.error(error.message)

  if (error.name === 'CastError') {
    return res.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return res.status(400).json({ error: error.message })
  }

  next(error)
}

const countStuff = () => {
  Contact.countDocuments({}, function (err, count) {
    if (err) {
      console.log(err)
    } else {
      console.log('Count :', count)
      return (getCount = count)
    }
  })
}
let getCount = countStuff()

app.get('/api/contacts', (req, res) => {
  Contact.find(req.params.id).then((contact) => {
    res.json(contact)
  })
})

app.get('/api/contacts/:id', (req, res, next) => {
  Contact.findById(req.params.id)
    .then((contact) => {
      if (contact) {
        res.json(contact)
      } else {
        res.status(404).end()
      }
    })
    .catch((error) => next(error))
})

app.delete('/api/contacts/:id', (req, res, next) => {
  Contact.findByIdAndRemove(req.params.id)
    .then((result) => {
      res.status(204).end()
    })
    .catch((error) => next(error))
})

app.put('/api/contacts/:id', (req, res, next) => {
  const body = req.body

  const contact = {
    name: body.name,
    number: body.number,
    id: body.id,
  }

  Contact.findByIdAndUpdate(req.params.id, contact, { new: true })
    .then((updatedContact) => {
      res.json(updatedContact)
    })
    .catch((error) => next(error))
})

app.get('/info', (req, res) => {
  res.send(
    `<p>Phonebook has info for ${getCount} people.</p><p>${new Date()}</p>`
  )
})

app.post('/api/contacts', (req, res, next) => {
  const body = req.body

  if (body.name === undefined) {
    return res.status(400).json({ error: 'name missing' })
  }

  const contact = new Contact({
    name: body.name,
    number: body.number,
  })

  contact
    .save()
    .then((savedContact) => {
      res.json(savedContact)
    })
    .catch((error) => next(error))
})

app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
