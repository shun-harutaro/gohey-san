const express = require("express");
//const { onRequest } = require("firebase-functions/v2/https")
const functions = require("firebase-functions");
const app = express();
const PORT = 3000;
const NODE_ENV = process.env.NODE_ENV;

const usersRoutes = require("./routes/users");

app.use("/api/users", usersRoutes);
app.get("/api/test", (req, res) => res.send("api success"));
app.get("/api/*", (req, res) => {
  res.send("api error");
});

const api = () => {
  app.listen(PORT, () => {
    console.log(`api app listening on port ${PORT}`);
  });
};

if (NODE_ENV === "development") {
  module.exports = api;
} else {
  //exports.api = onRequest(app)
  exports.api = functions.https.onRequest(app);
}
