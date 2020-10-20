const mongoose = require('mongoose')

const password = process.argv[2];
const url = `mongodb+srv://metinen:${password}@cluster0.e5hx4.mongodb.net/<phonebook>?retryWrites=true&w=majority`

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })

const recordSchema = new mongoose.Schema({
    name: String,
    number: String
})

const Record = mongoose.model('Record', recordSchema);

if (process.argv.length === 5) {
    const record = new Record({ name: process.argv[3], number: process.argv[4] });
    record.save().then(result => {
        console.log("Record saved!")
        mongoose.connection.close()
    })

}

if (process.argv.length === 3) {
    Record.find({}).then(result => {
        console.log("Phonebook")
        result.forEach(e => console.log(`Name : ${e.name}, number: ${e.number}`))
        mongoose.connection.close()
    })
}