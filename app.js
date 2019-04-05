    
const path = require("path");
const express = require("express");
const line = require("@line/bot-sdk");

const lineConfig = {
  channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.LINE_CHANNEL_SECRET
};
const lineClient = new line.Client(lineConfig);

function createReplyMessage(input) {
  const messages = [];
  let text = "";
 
  function Message(text) {
    this.type = "text";
    this.text = text;
  }

  function bunkai(str) {
    var tmp = /(\d+)(\D+)/.exec(str);
    return {
      num: tmp[1],
      tanni: tmp[2]
    }
  }
  
  text = bunkai(input);

  messages.push(Message(text));

  console.log(messages)
  
  return messages;
}

const server = express();

server.use("/images", express.static(path.join(__dirname, "images")));

server.post("/webhook", line.middleware(lineConfig), (req, res) => {
  // LINEのサーバーに200を返す
  res.sendStatus(200);

  for (const event of req.body.events) {
    if (event.type === "message" && event.message.type === "text") {
      const message = createReplyMessage(event.message.text);
      lineClient.replyMessage(event.replyToken, message);
    }
  }
});

server.listen(process.env.PORT || 8080);