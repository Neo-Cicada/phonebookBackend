const mongoose = require('mongoose') // import mongoose

mongoose.set('strictQuery', false) // set strict query to false

const url = process.env.MONGODB_URL // get the url from env

mongoose.connect(url).then(result =>{ // connect db
    console.log('connected to DB')
}).catch(error =>{
    console.log("error connecting to db", error.message)
})

const personSchema = new mongoose.Schema({ // create a schema or blueprint for datas
    name: {
      type: String,
      required: true,
      validate: {
        validator: function(value) {
            return value.length >= 3;
        },
        message: props => `${props.value} is shorter than the minimum allowed length (3).`
    }
      },
      number: {
        type: String,
        required: true,
        validate: {
            validator: function(value) {
                // Regular expression to match the specified format
                const regex = /^\d{2,3}-\d+$/;
                return regex.test(value);
            },
            message: props => `${props.value} is not in the correct format. It should be in the format XX-XXXXXXX, where X represents a digit.`
        }
    },
})

personSchema.set('toJSON', {
    transform: (document, returnObject) => {
      returnObject.id = returnObject._id.toString();
      delete returnObject._id;
      delete returnObject.__v;
    }
  });

module.exports = mongoose.model('phonebook', personSchema) //export model