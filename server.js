import express from "express";
import cors from "cors";
import fs from "fs";
import OpenAI from "openai";

const app = express();
app.use(cors());
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const SYSTEM_PROMPT = fs.readFileSync("./prompt.txt", "utf8");

app.get("/", (req, res) => res.sendFile("index.html", { root: "." }));

app.post("/chat", async (req, res) => {
  try {
    const userMessage = req.body.message;
    const isPremium = req.body.isPremium || false; // 유료 여부

    if (!userMessage) {
      return res.status(400).json({ error: "메시지가 없습니다." });
    }

    // 무료: gpt-4o-mini / 유료: gpt-4o
    const model = isPremium ? "gpt-4o" : "gpt-4o-mini";

    const response = await openai.chat.completions.create({
      model: model,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userMessage }
      ]
    });

    res.json({
      reply: response.choices[0].message.content,
      tier: isPremium ? "premium" : "free"
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "서버 내부 오류",
      detail: error.message
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`서버 실행중 ${PORT}`);
});
