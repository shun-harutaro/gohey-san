const express = require("express");
const { onRequest } = require("firebase-functions/v2/https");
const { defineSecret } = require("firebase-functions/params");
const line = require("@line/bot-sdk");
const app = express();
const PORT = 3001;

const NODE_ENV = process.env.NODE_ENV;
require("dotenv").config();
//const channelAccessToken = defineSecret("CHANNEL_ACCESS_TOKEN");
//const channelSecret = defineSecret("CHANNEL_SECRET");

const config = {
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.CHANNEL_SECRET
}

app.post("/bot/webhook", line.middleware(config),
  async (req, res) => {
    const result = await Promise.all(req.body.events.map(handleEvent));
    res.json(result);
});
app.get("/bot/*", (req, res) => {
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

const bot = () => {
  app.listen(PORT, () => {
    console.log(`bot app listening on port ${PORT}`);
  });
}

if (NODE_ENV === "development") {
    module.exports = bot;
} else {
  exports.bot = onRequest(app,
    //{ region: "asia-northeast1",
      //secrets: ["channelAccessToken", "channelSecret"]
      //secrets: ["CHANNEL_ACCESS_TOKEN", "CHANNEL_SECRET"]
    //}
  )
}
