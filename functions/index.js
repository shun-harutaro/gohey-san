const api = require("./api");
const bot = require("./bot");
const PORT = 3000;

const NODE_ENV = process.env.NODE_ENV;

if (NODE_ENV === "development") {
  api();
  bot();
  console.log("development mode");
  console.log(`Example app listening on port ${PORT}`);
} else {
  exports.main = api.api;
  exports.linebot = bot.bot;
}
