const express = require("express");
//const { onRequest } = require("firebase-functions/v2/https");
const functions = require("firebase-functions");
//const { defineSecret } = require("firebase-functions/params");
const line = require("@line/bot-sdk");
const app = express();
const PORT = 3001;

const NODE_ENV = process.env.NODE_ENV;
const BASE_URL = process.env.BASE_URL;
require("dotenv").config();
//const channelAccessToken = defineSecret("CHANNEL_ACCESS_TOKEN");
//const channelSecret = defineSecret("CHANNEL_SECRET");

const config = {
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.CHANNEL_SECRET,
};

app.post("/bot/webhook", line.middleware(config), async (req, res) => {
  const result = await Promise.all(req.body.events.map(handleEvent));
  res.json(result);
});
app.get("/bot/test", (req, res) => res.send("bot success"));
app.get("/bot/*", (req, res) => {
  res.send("Error");
});

const client = new line.Client(config);
const handleEvent = (event) => {
  if (event.type !== "message" || event.message.type !== "text") {
    return Promise.resolve(null);
  }
  if (event.message.text === ">search") {
    return client.replyMessage(event.replyToken, {
      type: "text",
      text: "お店の検索をします。\n>形で選ぶ\n>地域から選ぶ",
      quickReply: {
        items: [
          {
            type: "action",
            action: {
              type: "message",
              label: "形で選ぶ",
              text: ">shape"
            }
          },
          {
            type: "action",
            action: {
              type: "message",
              label: "地域から選ぶ",
              text: ">region"
            }
          }
        ]
      }
    });
  }
  if (event.message.text === ">shape") {
    return client.replyMessage(event.replyToken, {
      type: "text",
      text: "形を選びましょう。\n>わらじ\n>大わらじ\n>御幣\n>小判\n>クルマ\n>ひょうたん\n>だんご\n>木の葉\n>ハート\n>きりたんぽ",
      quickReply: {
        items: [
          {
            type: "action",
            action: {
              type: "message",
              label: "わらじ",
              text: ">shape?waragi"
            }
          },
          {
            type: "action",
            action: {
              type: "message",
              label: "大わらじ",
              text: ">shape?big-waragi"
            }
          },
          {
            type: "action",
            action: {
              type: "message",
              label: "御幣",
              text: ">shape?gohei"
            }
          },
          {
            type: "action",
            action: {
              type: "message",
              label: "小判",
              text: ">shape?koban"
            }
          },
          {
            type: "action",
            action: {
              type: "message",
              label: "クルマ",
              text: ">shape?kuruma"
            }
          },
          {
            type: "action",
            action: {
              type: "message",
              label: "ひょうたん",
              text: ">shape?hyotan"
            }
          },
          {
            type: "action",
            action: {
              type: "message",
              label: "だんご",
              text: ">shape?dango"
            }
          },
          {
            type: "action",
            action: {
              type: "message",
              label: "木の葉",
              text: ">shape?konoha"
            }
          },
          {
            type: "action",
            action: {
              type: "message",
              label: "ハート",
              text: ">shape?heart"
            }
          },
          {
            type: "action",
            action: {
              type: "message",
              label: "きりたんぽ",
              text: ">shape?kiritanpo"
            }
          },
        ]
      }
    });
  }
  if (event.message.text === ">region") {
    return client.replyMessage(event.replyToken, [
      {
        type: "image",
        originalContentUrl: "https://i.gyazo.com/0d3a484370a13efffe711e5570494efb.png",
        previewImageUrl: "https://i.gyazo.com/0d3a484370a13efffe711e5570494efb.png",
      },
      {
      type: "text",
      text: "地域を選びましょう\n>豊田\n>小原\n>旭\n>稲武\n>足助\n>下山",
      quickReply: {
        items: [
          {
            type: "action",
            action: {
              type: "message",
              label: "豊田",
              text: ">region?toyota"
            }
          },
          {
            type: "action",
            action: {
              type: "message",
              label: "小原",
              text: ">region?obara"
            }
          },
          {
            type: "action",
            action: {
              type: "message",
              label: "旭",
              text: ">region?asahi"
            }
          },
          {
            type: "action",
            action: {
              type: "message",
              label: "稲武",
              text: ">region?inabu"
            }
          },
          {
            type: "action",
            action: {
              type: "message",
              label: "足助",
              text: ">region?asuke"
            }
          },
          {
            type: "action",
            action: {
              type: "message",
              label: "下山",
              text: ">region?shimoyama"
            }
          },
        ]
      }
      },
    ]);
  }

  if (event.message.text.includes('>region?')) {
    const region = event.message.text.slice(8);
    return client.replyMessage(event.replyToken, {
      type: "text",
      text: `こちらのお店が見つかりました。\n${BASE_URL}/shops/?region=${region}`
    });
  }

  if (event.message.text.includes('>shape?')) {
    const shape = event.message.text.slice(7);
    return client.replyMessage(event.replyToken, {
      type: "text",
      text: `こちらのお店が見つかりました。\n${BASE_URL}/shops/?shape=${shape}`
    });
  }

  if (event)
  return client.replyMessage(event.replyToken, {
    type: "text",
    text: "不正な入力です。もう一度お試しください"
  })
};

const bot = () => {
  app.listen(PORT, () => {
    console.log(`bot app listening on port ${PORT}`);
  });
};

if (NODE_ENV === "development") {
  module.exports = bot;
} else {
  exports.bot = functions.https.onRequest(app);
  //onRequest(app)
  //{ region: "asia-northeast1",
  //secrets: ["channelAccessToken", "channelSecret"]
  //secrets: ["CHANNEL_ACCESS_TOKEN", "CHANNEL_SECRET"]
  //}
}
