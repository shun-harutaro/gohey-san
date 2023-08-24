const express = require("express");
const router = express.Router();
const line = require('@line/bot-sdk');
const NODE_ENV = process.env.NODE_ENV;
if (NODE_ENV === "development") {
  require("dotenv").config()
};

const config = {
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.CHANNEL_SECRET,
}

router.get("/", (req, res) => {
  res.write("hello");
  res.end();
})
router.post("/webhook",
  line.middleware(config), async (req, res) => {
    const result = await Promise.all(req.body.events.map(handleEvent))
    res.json(result);
})

const client = new line.Client(config);
const handleEvent = async (event) => {
  if (event.type !== 'message' || event.message.type !== 'text') {
    return Promise.resolve(null);
  }
  return client.replyMessage(event.replyToken, {
    type: 'text',
    text: event.message.text
  })
}


module.exports = router;
