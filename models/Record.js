const mongoose = require('mongoose');

const url = process.env.MONGO_DB_URL

console.log("Trying to open connection to db")
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })
    .then(e => console.log("Connection to db open"))
    .catch(e => console.log("Connection could not be opened to db", e.message))

const recordSchema = new mongoose.Schema({ name: String, number: String })

recordSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Record', recordSchema)
