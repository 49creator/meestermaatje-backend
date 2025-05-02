const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Alleen POST toegestaan" });
    return;
  }

  const vraag = req.body.vraag;

  if (!vraag) {
    res.status(400).json({ error: "Geen vraag ontvangen." });
    return;
  }

  try {
    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: vraag }],
    });

    const antwoord = completion.data.choices[0].message.content;
    res.status(200).json({ antwoord });
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).json({ error: "Fout bij OpenAI." });
  }
};