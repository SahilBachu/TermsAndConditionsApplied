const express = require("express");
const router = express.Router();

const { chat } = require("../services/llm");
const { CHAT_SYSTEM_PROMPT } = require("../prompts/system");

router.post("/chat", async (req, res) => {
  try {
    const { message, policyText, conversationHistory } = req.body;

    if (!message || message.trim().length === 0) {
      return res.status(400).json({ error: "Message is required." });
    }

    if (!policyText || policyText.trim().length === 0) {
      return res.status(400).json({ error: "Policy text is required for context." });
    }

    const messages = [
      { role: "system", content: CHAT_SYSTEM_PROMPT },
      {
        role: "system",
        content: `Here is the original privacy policy text the user wants to ask about:\n\n${policyText}`,
      },
    ];

    if (conversationHistory && conversationHistory.length > 0) {
      for (const msg of conversationHistory) {
        messages.push({ role: msg.role, content: msg.content });
      }
    }

    messages.push({ role: "user", content: message });

    const reply = await chat(messages);

    res.json({ reply });
  } catch (error) {
    console.error("Chat error:", error);
    res.status(500).json({ error: "Failed to get a response. Please try again." });
  }
});

module.exports = router;
