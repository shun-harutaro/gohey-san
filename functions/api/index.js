const express = require("express");
const functions = require("firebase-functions");
const app = express();
const PORT = 3000;

const NODE_ENV = process.env.NODE_ENV;

app.get("/api/user", (req, res) => {
  res.write("Hello World");
  res.end();
});

app.get("/api/*", (req, res) => {
  res.write("Error");
  res.end();
});

const api = () => {
  app.listen(PORT, () => {
    console.log(`api app listening on port ${PORT}`);
  });
}

if (NODE_ENV === "development") {
  module.exports = api;
} else {
  exports.api = functions
    .https.onRequest(app);
}
