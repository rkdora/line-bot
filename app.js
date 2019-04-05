    
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
  const weightUnits = ["mg", "g", "kg", "t"];

  function message(str) {
    return {
      type: "text",
      text: str
    }
  }

  function bunkai(str) {
    var tmp = /(\d+)(\D+)/.exec(str);
    return {
      num: tmp[1],
      tanni: tmp[2]
    }
  }

  function isValidInput(str){
    var tmp = /(\d+)(\D+)/.exec(str);
    if (!tmp) return false;
      
    return !(weightUnits.indexOf(bunkai(str).tanni) === -1);
  }
  // > isValidInput("1g");
  // true
    // > isValidInput("1gg");
  // false
  // > isValidInput("1g1");<=================後で修正
  // true

  let message_text = "";

  if (!isValidInput(input)) {
    message_text = "重さをわかりやすくたとえることができます。\n（例）「900g」と入力してみてください。\n現在対応している単位は[mg, g, kg, t]のいずれかです。";
  } else {
    let input_str = bunkai(input);
    switch (weightUnits.indexOf(input_str.tanni)) {
      case 0:       //mg
        message_text = `蚊${input_str.num}匹分の重さです。\n（1mg = 一般的な蚊の体重）`
        break;
      case 1:       //g
        message_text = `一円硬貨${input_str.num}枚分の重さです。\n（1g = 一円硬貨の重量）`
        break;
      case 2:       //kg
        message_text = `電話帳${input_str.num}冊分の重さです。\n（1kg = 一般的な電話帳の重量）`
        break;
      case 3:       //t
        message_text = `水の入った2ℓのペットボトル${String(parseInt(input_str.num)*500)}本分の重さです。\n（1t = 水の入った2ℓのペットボトル500本分）`
        break;
    }
  }

  messages.push(message(message_text));

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