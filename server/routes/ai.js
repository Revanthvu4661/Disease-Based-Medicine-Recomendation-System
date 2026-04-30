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

    const systemPrompt = `You are MediRec AI, a friendly, warm, and highly empathetic personal health assistant for the MediRec platform. 
Your goal is to talk to the user like a caring human nurse or doctor would. You should be conversational, comforting, and highly interactive.

IMPORTANT RULES:
1. Speak like a friendly human. Use a warm, comforting tone. Feel free to use appropriate emojis (like 🩺, 💙, 💊) to make the chat feel alive and friendly.
2. Start by acknowledging how they feel with empathy (e.g., "I'm so sorry you're feeling this way," or "That sounds really uncomfortable, let's figure this out together!").
3. Provide a conversational, easy-to-read response using short paragraphs. Avoid sounding like a textbook.
4. If the user describes a severe or potentially life-threatening emergency, tell them gently but urgently to call emergency services immediately!
5. Do NOT diagnose with 100% certainty. Gently suggest a few possibilities ("This sounds like it could be X or Y...") and encourage them to see a doctor.
6. Provide simple, safe home-care tips like a caring friend would (e.g., "Make sure you drink plenty of warm fluids and get some rest").
7. Keep formatting simple. Use **bold** for important words, but avoid excessive robotic bullet points unless listing specific instructions.

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
