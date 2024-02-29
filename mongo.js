const mongoose = require('mongoose') // import the mongoose

if(process.argv.length < 3){ // this check if the length of ainput in terminal is less than 3
    console.log("Give a password as arguesmet")
    process.exit(1)
}

const password = process.argv[2] //this get the 3rd argument which in terminal

//this is the path to access the database
const url = `mongodb+srv://lordneobarnachea:${password}@cluster0.7wdbow5.mongodb.net/phoneBook?
retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery', false)
mongoose.connect(url)

// the types of the data
const phonebookSchema = new mongoose.Schema({
    name: String,
    number: String
})

const phoneBook = mongoose.model('phonebook', phonebookSchema) //name of the table then the type of data

const contact = new phoneBook({
    name: process.argv[3],
    number: process.argv[4]
})

if(process.argv.length < 4){
    phoneBook.find({}).then(result =>{
        result.forEach(item =>{
            console.log(item)
        }) 
        mongoose.connection.close() 
    })
}else{
    contact.save().then(result => {
        console.log(`added ${result.name} number ${result.number} to phonebook`)
        mongoose.connection.close()
    })
}



