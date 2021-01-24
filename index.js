const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const ObjectId = require('mongodb').ObjectId;
const fs= require('fs');
const fileUpload = require('express-fileupload');

const app = express()
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(fileUpload());
require('dotenv').config();

const port = 8000

app.get('/', (req, res) => {
  res.send('Hello World!')
})

const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.h9wko.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true , useUnifiedTopology: true });
client.connect(err => {
  const informationCollection = client.db("crudmongo").collection("favouritecity");
  // perform actions on the collection object
  console.log("hello i am connect");

  app.post('/addInformation', (req,res) => {
    const country = req.body.country;
    const capital = req.body.capital;
    
    informationCollection.insertOne({country,capital})
    .then(result =>{
        res.send(result.insertedCount>0)
    })

  })

  app.get('/readOrder',(req,res) => {
    informationCollection.find({})
    .toArray((err , documents)=>{
      res.send(documents)
    })
  })

  app.delete('/delete/:id', (req, res) =>{
    informationCollection.deleteOne({_id: ObjectId(req.params.id)})
    .then( result => {
      res.send(result.deletedCount > 0);
    })
  })

  app.get('/singlecountry/:id',(req,res) => {
    informationCollection.find({_id: ObjectId(req.params.id)})
    .toArray((err , documents)=>{
      res.send(documents)
    })
  })

  app.patch('/update/:id', (req, res) => {
    informationCollection.updateOne({_id: ObjectId(req.params.id)},
    {
      $set: {country: req.body.country, capital: req.body.capital}
    })
    .then (result => {
      res.send(result.modifiedCount > 0)
    })
  })
});

app.listen(process.env.PORT || port)