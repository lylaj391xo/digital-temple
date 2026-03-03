import express from "express";
import cors from "cors";
import fs from "fs";

const app = express();
app.use(cors());
app.use(express.json());

const SYSTEM_PROMPT = fs.readFileSync("./prompt.txt", "utf8");

app.post("/chat", async (req, res) => {
  const userMessage = req.body.message;

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: "gpt-4.1-mini",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userMessage }
      ]
    })
  });

  const data = await response.json();
  res.json({ reply: data.choices[0].message.content });
});

app.get("/", (req,res)=>{
  res.send("챗봇 서버 실행중");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("server running"));