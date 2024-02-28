const express = require('express') //import express
const app = express() // initialized express
const morgan = require('morgan')
const cors = require('cors')
const PORT = 3001 //initilized what port we will use
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

let phoneBook = [ //initilizing dummy data
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get("/api/persons", (req, res)=>{ // api end point to return all the data
    res.json(phoneBook)
})
app.get("/info", (req, res) =>{
    const date = new Date()
    res.send(`Phonebook has info or ${phoneBook.length} people <br/> ${date}`)
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
app.post("/api/persons", (req, res)=>{
  const {name, number} = req.body;
  const id = Math.floor(Math.random()* 10000)
  if(!name) return res.status(500).json({error: "name is required"})
  
  if(!number) return res.status(500).json({error :"number is required"})

  const duplicate = phoneBook.find(item => item.name.toLowerCase() === name.toLowerCase())
  if(duplicate) return res.status(500).json({ error: 'name must be unique' });  

  const newPerson ={
    "id": id,
    "name": name,
    "number": number
  }

  phoneBook.push(newPerson);
  res.status(200).json(newPerson);

})
app.listen(PORT, ()=>{
    console.log(`Server running on port ${PORT}`)
})