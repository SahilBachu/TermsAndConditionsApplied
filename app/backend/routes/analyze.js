// Analyze route - takes in a privacy policy and returns the simplified version
// This is the main endpoint that does the heavy lifting
const express = require("express");
const router = express.Router();

const { chat } = require("../services/llm");
const { getFleschKincaidGrade } = require("../services/readability");
const { ANALYZE_SYSTEM_PROMPT } = require("../prompts/system");

// Tailwind classes for the bias severity cards
// These get sent to the frontend so the cards are styled correctly
const SEVERITY_STYLES = {
  high: {
    borderColor: "border-red-100 dark:border-red-900/30",
    hoverBorderColor: "hover:border-red-200 dark:hover:border-red-800",
    iconColor: "text-red-500",
  },
  medium: {
    borderColor: "border-orange-100 dark:border-orange-900/30",
    hoverBorderColor: "hover:border-orange-200 dark:hover:border-orange-800",
    iconColor: "text-orange-500",
  },
  low: {
    borderColor: "border-yellow-100 dark:border-yellow-900/30",
    hoverBorderColor: "hover:border-yellow-200 dark:hover:border-yellow-800",
    iconColor: "text-yellow-500",
  },
};

// Attaches the right tailwind classes to each bias based on its severity
function addSeverityStyles(biasArray) {
  return biasArray.map((bias) => ({
    ...bias,
    description: bias.description || "",
    ...(SEVERITY_STYLES[bias.severity] || SEVERITY_STYLES.low),
  }));
}

router.post("/analyze", async (req, res) => {
  try {
    const { policyText } = req.body;

    if (!policyText || policyText.trim().length === 0) {
      return res.status(400).json({ error: "Policy text is required." });
    }

    // First pass - send the policy to the LLM with our system prompt
    const messages = [
      { role: "system", content: ANALYZE_SYSTEM_PROMPT },
      { role: "user", content: policyText },
    ];

    let rawResponse = await chat(messages);
    // Sometimes the LLM wraps the JSON in code fences, so strip those out
    rawResponse = rawResponse.replace(/```json\s*/g, "").replace(/```\s*/g, "").trim();
    let data = JSON.parse(rawResponse);

    // If the LLM flagged this as not a real policy, tell the user
    if (data.error === "NOT_A_POLICY") {
      return res.status(400).json({ error: data.message });
    }

    // Check if the simplified text is actually simple enough
    const allText = data.fullSimplifiedText.join(" ");
    let fkGrade = getFleschKincaidGrade(allText);

    // If the grade is above 8, ask the LLM to try again (up to 2 retries)
    // This is the feedback loop that ensures quality
    let retries = 0;
    while (fkGrade > 8 && retries < 2) {
      retries++;

      // Send the previous response back so the LLM knows what to fix
      const retryMessages = [
        { role: "system", content: ANALYZE_SYSTEM_PROMPT },
        { role: "user", content: policyText },
        { role: "assistant", content: rawResponse },
        {
          role: "user",
          content: `The Flesch-Kincaid grade of your simplified text is ${fkGrade.toFixed(1)}, which is above the target of 8. Please simplify further. Use shorter sentences and simpler words. Return the same JSON format.`,
        },
      ];

      rawResponse = await chat(retryMessages);
      rawResponse = rawResponse.replace(/```json\s*/g, "").replace(/```\s*/g, "").trim();
      data = JSON.parse(rawResponse);

      const retryText = data.fullSimplifiedText.join(" ");
      fkGrade = getFleschKincaidGrade(retryText);
    }

    // Attach the styling info and readability grade before sending to frontend
    data.biases = addSeverityStyles(data.biases);
    data.chatBiases = addSeverityStyles(data.chatBiases);
    data.readabilityGrade = `Grade ${fkGrade.toFixed(1)}`;

    res.json(data);
  } catch (error) {
    console.error("Analyze error:", error);

    // If it's a rate limit error, send back the retry info
    // so the frontend can show the user when to try again
    if (error.status === 429) {
      return res.status(429).json({
        error: "API rate limit reached. This app uses a free tier with limited requests.",
        retryAfter: error.retryAfter || null,
        resetTime: error.resetTime || null,
      });
    }

    res.status(500).json({ error: "Failed to analyze policy. Please try again." });
  }
});

module.exports = router;
