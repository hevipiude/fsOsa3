const mongoose = require('mongoose')

if (process.argv.length <= 2) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://user:${password}@cluster0.bxk7btv.mongodb.net/contactApp?retryWrites=true&w=majority`

mongoose.set('strictQuery', false)
mongoose.connect(url)

const contactSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Contact = mongoose.model('Contact', contactSchema)

const contact = new Contact({
  name: process.argv[3],
  number: process.argv[4],
})

if (process.argv.length >= 4) {
  contact.save().then((result) => {
    console.log('contact saved!')
    mongoose.connection.close()
  })
}

if (process.argv.length <= 3) {
  Contact.find({}).then((result) => {
    result.forEach((contact) => {
      console.log(contact)
    })
    mongoose.connection.close()
  })
}
