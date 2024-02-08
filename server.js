const express = require('express');
const db = require('./db/db.json')
const { v4: uuidv4 } = require('uuid');
const { readFromFile, readAndAppend } = require('./fsUtils');
const app = express();
const path = require('path');
const PORT = process.env.PORT || 3001;

// Middleware for parsing JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware to serve up static assets from the public folder
app.use(express.static('public'));

app.get('/api/notes', (req,res)=>{
    readFromFile('./db/db.json').then((data)=> res.json(JSON.parse(data)))
  
});

app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/notes.html'))
);


app.post('/api/notes',(req,res)=>{
  const {title, text } = req.body;

  if (title && text){

    const newNotes = {
        title,
        text,
        id: uuidv4(),
    };
    readAndAppend(newNotes,'./db/db.json');
       res.json(`Note added successfully`);
  } else {
    res.error('Error in adding note');
  }
})


app.get('*', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/index.html'))
);


app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);
