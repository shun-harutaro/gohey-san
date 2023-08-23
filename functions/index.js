const express = require("express");
const functions = require("firebase-functions");
//const axios = require("axios");
const app = express();
const PORT = 3000;
require("dotenv").config();

const NODE_ENV = process.env.NODE_ENV;

app.get("/", (req, res) => {
  res.write("Hello world");
  res.end();
});

if (NODE_ENV === "development") {
  app.listen(PORT, () => {
    console.log("development mode");
    console.log(`Example app listening on port ${PORT}`);
  });
} else {
  exports.app = functions
    .https.onRequest(app);
}
