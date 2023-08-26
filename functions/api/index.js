const express = require("express");
//const { onRequest } = require("firebase-functions/v2/https")
const functions = require("firebase-functions");
const app = express();
const PORT = 3000;
const NODE_ENV = process.env.NODE_ENV;

const usersRoutes = require("./routes/users")

app.use("/users", usersRoutes);
app.get("/**", (req, res) => {
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
  //exports.api = onRequest(app)
  exports.api = functions
    .https.onRequest(app)
}
