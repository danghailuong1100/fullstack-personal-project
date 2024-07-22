const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log(
    'Please provide the password as an argument: node mongo.js <password>'
  )
  process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://fullstack:${password}@cluster0.nayv7.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`

mongoose.connect(url)

const phoneBookEntrySchema = new mongoose.Schema({
  name: String,
  number: String
})

const PhoneBookEntry = mongoose.model('Entry', phoneBookEntrySchema)

if (process.argv.length < 5) {
  console.log('phonebook:')
  PhoneBookEntry.find({}).then((result) => {
    result.forEach((entry) => {
      console.log(`${entry.name} ${entry.number}`)
    })
    mongoose.connection.close()
    process.exit(0)
  })
} else {
  const newName = process.argv[3]
  const newNumber = process.argv[4]
  const entry = new PhoneBookEntry({
    name: newName,
    number: newNumber
  })
  entry.save().then((_result) => {
    console.log(`added ${newName} number ${newNumber} to phonebook`)
    mongoose.connection.close()
  })
}
