const serviceAccount = require("./service-account-key.json");
const fs = require("fs");
const express = require("express");
const app = express();
const cors = require("cors");
const dotenv = require("dotenv");
const firebase = require("./firebase");

dotenv.config();

app.use(cors());

const db = firebase.firestore();

app.get("/");

app.get("/modal/:id", function (req, res) {
  try {
    let uid = req.params.id;
    const filePath = "./modals/" + uid + ".usdz";
    fs.exists(filePath, function (exists) {
      if (exists) {
        // Content-type is very interesting part that guarantee that
        // Web browser will handle response in an appropriate manner.
        res.writeHead(200, {
          "Content-Type": "application/octet-stream",
          "Content-Disposition": "attachment; filename=" + uid,
        });
        fs.createReadStream(filePath).pipe(res);
        return;
      }
      res.writeHead(400, { "Content-Type": "text/plain" });
      res.end("ERROR File does not exist");
    });
  } catch (error) {
    res.send(error, "Sorry! you cant see that.");
  }
});

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log("listening on port ", PORT);
});
