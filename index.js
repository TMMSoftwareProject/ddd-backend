const serviceAccount = require('./service-account-key.json');
const fs = require('fs')
const express = require('express');
const app = express();
const cors = require('cors');
const dotenv = require('dotenv');
const authMiddleware = require('./middlewares/auth');
const firebase = require('./firebase')

dotenv.config();

app.use(cors());

const db = firebase.firestore();

app.use('/', authMiddleware);

app.get('/bin', (req, res) => {
  try {
    binary = fs.readFileSync("./modals/example.bin");
    res.send(binary)
  } catch (error) {
    console.log("Got an error reading the modal.");
  }
});

app.post('/bin', (req, res) => {
  binary = fs.readFileSync("./slick.bin");
  console.log(binary);
});


app.get('/heroesfromfirebase', async (req, res) => {
  const docRef = db.doc("dota/heroes");

  await docRef.get().then((data) => {
    if (data && data.exists) {
      const responseData = data.data();
      res.send(JSON.stringify(responseData, null, "  "));
    }
  })
});

app.post('/heroestofirebase', (req, res) => {
  //firestore post
  const jsonFile = fs.readFileSync('./heroes.json') //reads from local
  const heroes = JSON.parse(jsonFile); //json parse 

  return db.collection('dota').doc('heroes')
    .set(heroes).then(() => {
      res.send("Fresh Meat!!")
    });
})


const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log("listening on port ", PORT);
})
