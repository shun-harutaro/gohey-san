const express = require("express");
const botRoutes = require("./routes/bot");
const functions = require("firebase-functions");
//const axios = require("axios");
const app = express();
const PORT = 3000;

const NODE_ENV = process.env.NODE_ENV;

app.use("/api/bot", botRoutes);
app.get("/api/*", (req, res) => {
  res.write("Error");
  res.end();
});

if (NODE_ENV === "development") {
  require("dotenv").config({
    path: "./.env.local"
  });
  app.listen(PORT, () => {
    console.log("development mode");
    console.log(`Example app listening on port ${PORT}`);
  });
} else {
  exports.app = functions
    .runWith({
      secrets: ["CHANNEL_ACCESS_TOKEN", "CHANNEL_SECRET"],
    })
    .https.onRequest(app);
}
