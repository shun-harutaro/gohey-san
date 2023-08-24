const express = require("express");
const functions = require("firebase-functions");
const line = require("@line/bot-sdk");
const app = express();
const PORT = 3000;
require("dotenv").config();

const NODE_ENV = process.env.NODE_ENV;
const config = {
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.CHANNEL_SECRET
}

app.post("/api/bot/webhook", line.middleware(config),
  async (req, res) => {
    const result = await Promise.all(req.body.events.map(handleEvent));
    res.json(result);
});
app.get("/api/*", (req, res) => {
  res.write("Error");
  res.end();
});

const client = new line.Client(config);
const handleEvent = (event) => {
  if (event.type !== 'message' || event.message.type !== 'text') {
    return Promise.resolve(null);
  }

  return client.replyMessage(event.replyToken, {
    type: 'text',
    text: event.message.text
  });
}

if (NODE_ENV === "development") {
  app.listen(PORT, () => {
    console.log("development mode");
    console.log(`Example app listening on port ${PORT}`);
  });
} else {
  exports.app = functions
    .runWith({
        secrets: ["CHANNEL_ACCESS_TOKEN", "CHANNEL_SECRET"]
    })
    .https.onRequest(app);
}
