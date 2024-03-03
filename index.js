require('dotenv').config()
const express = require('express') //import express
const app = express() // initialized express
const morgan = require('morgan')
const cors = require('cors')
const phoneBook = require('./models/phonebook')
const PORT = process.env.PORT //initilized what port we will use
//middleware
morgan.token('req-body', function (req, res) { // this activate a new morgan parameter that return req body
  return JSON.stringify(req.body);
});
const postMorgan = (req, res, next)=> {
  if(req.method === 'POST'){
    morgan(':method :url :status :res[content-length] - :response-time ms :req-body')(req, res, next);
  }else{
    next()
  }
}

app.use(express.json()); // this 
app.use(postMorgan)
app.use(cors())
app.use(express.static('dist'))


app.get("/api/persons", (req, res) => {
  phoneBook.find({})
    .then(result => {
      res.json(result)
    })
    .catch(err => {
      console.error("Error:", err);
      res.status(500).json({ error: 'Internal server error' });
    });
});
app.get("/info", async (req, res) =>{
    const date = new Date()
    const collectionLength = await phoneBook.countDocuments();
    res.send(`Phonebook has info or ${collectionLength} people <br/> ${date}`)
})
app.get("/api/persons/:id", async (req, res) =>{
    const id = req.params.id
    const foundIt = await phoneBook.findById(id)
    const {name, number, _id} = foundIt

    res.status(201).json(foundIt)
})
const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }
  response.status(404).send({error: 'id not found'}) 

  next(error)
}


app.delete("/api/persons/:id", (req, res, next)=>{
    const id = req.params.id
    console.log(id)
    phonebook.findByIdAndDelete(id).then(response =>{
      if (response) {
        res.status(204).end()
        console.log("success!")
      }else{
        throw Error
      }
    }).catch(error => next(error))
})
app.use(errorHandler)

app.post("/api/persons", async (req, res)=>{
  const {name, number} = req.body;
  const id = Math.floor(Math.random()* 10000)
  if(!name) return res.status(500).json({error: "name is required"})
  
  if(!number) return res.status(500).json({error :"number is required"})
  const duplicate = await phoneBook.aggregate([
    { $match: { name: { $regex: new RegExp(`^${name}$`, 'i') } } }
  ]);

  if (duplicate.length > 0) {
    return res.status(400).json({ error: "Name already exists in the phone book" });
  }
  
  const newPerson = new phoneBook({
    "name": name,
    "number": number
  })

  newPerson.save().then(result =>{
    console.log(result)
  })
  res.status(200).json(newPerson);

})

app.put("/api/persons", async (req, res) =>{
  const reqName = req.body.name
  console.log(reqName)
  const existingPerson = await phoneBook.exists({name: reqName})
  console.log(existingPerson)
  if(existingPerson){
    await phoneBook.findOneAndUpdate({name: reqName}, {number: `${req.body.number}`})
    console.log("updated?")
  }
  res.status(204).end()

})

app.listen(PORT, ()=>{
    console.log(`Server running on port ${PORT}`)
})