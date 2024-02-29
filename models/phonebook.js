const mongoose = require('mongoose') // import mongoose

mongoose.set('strictQuery', false) // set strict query to false

const url = process.env.MONGODB_URL // get the url from env

console.log('connecting to', url) // console the url

mongoose.connect(url).then(result =>{ // connect db
    console.log('connected to DB')
}).catch(error =>{
    console.log("error connecting to db", error.message)
})

const personSchema = new mongoose.Schema({ // create a schema or blueprint for datas
    name: String,
    number: String,
})

personSchema.set('toJSON', {
    transform: (document, returnObject) => {
      returnObject.id = returnObject._id.toString();
      delete returnObject._id;
      delete returnObject.__v;
    }
  });

module.exports = mongoose.model('phonebook', personSchema) //export model