// Chat route - lets users ask follow-up questions about the policy
// Uses conversation history so the AI remembers context
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

    // Build the messages array with the system prompt + the policy as context
    const messages = [
      { role: "system", content: CHAT_SYSTEM_PROMPT },
      {
        role: "system",
        content: `Here is the original privacy policy text the user wants to ask about:\n\n${policyText}`,
      },
    ];

    // Append any previous messages so the AI has conversation context
    if (conversationHistory && conversationHistory.length > 0) {
      for (const msg of conversationHistory) {
        messages.push({ role: msg.role, content: msg.content });
      }
    }

    // Add the user's new message at the end
    messages.push({ role: "user", content: message });

    const reply = await chat(messages);

    res.json({ reply });
  } catch (error) {
    console.error("Chat error:", error);

    // Same rate limit handling as the analyze route
    if (error.status === 429) {
      return res.status(429).json({
        error: "API rate limit reached. This app uses a free tier with limited requests.",
        retryAfter: error.retryAfter || null,
        resetTime: error.resetTime || null,
      });
    }

    res.status(500).json({ error: "Failed to get a response. Please try again." });
  }
});

module.exports = router;
