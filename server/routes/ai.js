const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');

router.post('/chat', async (req, res) => {
  const { message } = req.body;
  if (!message) return res.status(400).json({ error: "Message is required" });

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    // Return 501 Not Implemented if the API key is not set. 
    // The client will catch this and fallback to local rule-based AI.
    return res.status(501).json({ error: "GEMINI_API_KEY not configured" });
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const systemPrompt = `You are MediRec AI, a helpful, knowledgeable, and empathetic personal health assistant for the MediRec Medical Recommendation System. 
Your job is to provide general health guidance and triage based on the user's symptoms.

IMPORTANT RULES:
1. Provide a concise, easy-to-read response using bullet points where appropriate.
2. If the user describes a severe or potentially life-threatening emergency (e.g., chest pain, severe shortness of breath, sudden numbness, uncontrolled bleeding), tell them to call emergency services (108 in India, 911 in US, etc.) immediately! Use bold warning text.
3. Do NOT diagnose the user with certainty. Suggest a few "Possible conditions" that could cause their symptoms and recommend seeing a doctor.
4. Provide simple, safe home-care or first-aid tips if appropriate (e.g., "Drink plenty of fluids", "Rest in a quiet room").
5. Keep your tone empathetic, clear, and reassuring.
6. Do NOT use complex markdown headers (like # or ##). Use **bold text** for emphasis. Use standard bullet points (-).

User Message:`;

    const chat = model.startChat({
      history: [
        {
          role: "user",
          parts: [{ text: systemPrompt }]
        },
        {
          role: "model",
          parts: [{ text: "Understood. I am MediRec AI. I will provide helpful, safe triage and general guidance using simple formatting, while always prioritizing patient safety and appropriate medical disclaimers." }]
        }
      ],
    });

    const result = await chat.sendMessage(message);
    const responseText = result.response.text();

    return res.json({ response: responseText });
  } catch (error) {
    console.error("Gemini API Error:", error);
    return res.status(500).json({ error: "Failed to generate AI response" });
  }
});

module.exports = router;
