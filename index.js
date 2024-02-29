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
app.get("/api/persons/:id", (req, res) =>{
    const id = Number(req.params.id)
    console.log(id)
    const person = phoneBook.find(item => item.id == id)
    console.log(person) 
    if(person){
        res.json(person)
    }else{
        res.status(404).end()
    }
    
})
app.delete("/api/persons/:id", (req, res)=>{
    const id = Number(req.params.id)
    //logic here
    console.log(id)
    phoneBook = phoneBook.filter(item => item.id !== id)
    res.status(204).end() //status response
})
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
app.listen(PORT, ()=>{
    console.log(`Server running on port ${PORT}`)
})