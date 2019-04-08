const path = require("path");
const express = require("express");
const line = require("@line/bot-sdk");

const lineConfig = {
  channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.LINE_CHANNEL_SECRET
};
const lineClient = new line.Client(lineConfig);

let name = "";

function createReplyMessage(input, name) {
  /// 2. オウム返しする
  return {
    type: "text",
    // `（バッククォート）で囲った中で${変数名}や${式}を書くと結果が展開される
    // テンプレートリテラル（Template literal）という文法です
    text: `${name}で${input}、desune？`
    // 以下と同じです
    // text: input + '、と言いましたね？'
  };
}

const server = express();

server.use("/images", express.static(path.join(__dirname, "images")));

server.post("/webhook", line.middleware(lineConfig), (req, res) => {
  // LINEのサーバーに200を返す
  res.sendStatus(200);

  for (const event of req.body.events) {
    const profile = lineClient.get_profile(event.source.userId)
    if (event.type === "message" && event.message.type === "text") {
      // lineClient.getProfile(event.source.userId)
      // .then((profile) => {
      //   name = profile.displayName;
        
      //   console.log(profile.userId);
      //   console.log(profile.pictureUrl);
      //   console.log(profile.statusMessage);
      // });
      console.log(profile[deisplayName]);
      const message = createReplyMessage(event.message.text, profile[displayName]);
      lineClient.replyMessage(event.replyToken, message);
    }
  }
});

server.listen(process.env.PORT || 8080);
