// api 생성한 키값
let apiKey = "";

const { Configuration, OpenAIApi } = require("openai"); //openai 설치
const serverless = require("serverless-http");
const express = require("express"); // express 설치
const cors = require("cors"); // cors 설치
const configuration = new Configuration({
  apiKey: apiKey,
});
const openai = new OpenAIApi(configuration);
const app = express();

// CORS 이슈 해결
let corsOptions = {
  origin: "https://dateguide.pages.dev/",
  credentials: true,
};
app.use(cors(corsOptions));

// app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); //12~13줄: body-parser 기능을 위해 선언

app.post("/guide", async function (req, res) {
  let { myPlace, myConcept, userMessages, assistantMessages } = req.body;
  let message = [
    {
      role: "user",
      content: `${myPlace} ${myConcept} 데이트하려고 합니다. 컨셉에 맞는 데이트 코스를 추천해주세요.`,
    },
  ];

  while (userMessages.length != 0 || assistantMessages.length != 0) {
    if (userMessages.length != 0) {
      message.push({
        role: "user",
        content: String(userMessages.shift().replace(/\n/g, "<br />")),
      });
    }
    if (assistantMessages.length != 0) {
      message.push({
        role: "assistant",
        content: String(assistantMessages.shift().replace(/\n/g, "<br />")),
      });
    }
  }

  const completion = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    temperature: 0.8,
    top_p: 0.8,
    max_tokens: 1000, //최대 2048
    frequency_penalty: 0.6,
    presence_penalty: 0.3, // 숫자 낮을수록 반복적인 대답 X
    messages: message,
  });
  let guide = completion.data.choices[0].message["content"];
  console.log(guide);
  // res.send(guide);
  res.json({ assistant: guide }); // 결과값을 json으로 전송한다
});

// app.listen(3000);
module.exports.handler = serverless(app);
