const express = require("express");
//const path = require("path");
const bot = require("./routes/bot");
const functions = require("firebase-functions");
const app = express();
const PORT = 3000;
const NODE_ENV = process.env.NODE_ENV;

app.use("/api/bot", bot);
app.get("/api/*", (req, res) => {
  res.write("Error");
  res.end();
});

if (NODE_ENV === "development") {
  require("dotenv").config();
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
