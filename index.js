const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { Configuration, OpenAIApi } = require("openai");

const app = express();
app.use(cors());
app.use(bodyParser.json());

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

app.post("/ask", async (req, res) => {
  const vraag = req.body.vraag;

  if (!vraag) {
    return res.status(400).json({ error: "Geen vraag ontvangen." });
  }

  try {
    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: vraag }],
    });

    const antwoord = completion.data.choices[0].message.content;
    res.json({ antwoord });
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).json({ error: "Fout bij OpenAI." });
  }
});

module.exports = app;