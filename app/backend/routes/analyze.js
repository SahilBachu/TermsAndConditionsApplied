const express = require("express");
const router = express.Router();

const { chat } = require("../services/llm");
const { getFleschKincaidGrade } = require("../services/readability");
const { ANALYZE_SYSTEM_PROMPT } = require("../prompts/system");

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

    const messages = [
      { role: "system", content: ANALYZE_SYSTEM_PROMPT },
      { role: "user", content: policyText },
    ];

    let rawResponse = await chat(messages);
    rawResponse = rawResponse.replace(/\s*/g, "").replace(/```\s*/g, "").trim();
    let data = JSON.parse(rawResponse);

    const allText = data.fullSimplifiedText.join(" ");
    let fkGrade = getFleschKincaidGrade(allText);

    let retries = 0;
    while (fkGrade > 8 && retries < 2) {
      retries++;

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
      rawResponse = rawResponse.replace(/\s*/g, "").replace(/```\s*/g, "").trim();
      data = JSON.parse(rawResponse);

      const retryText = data.fullSimplifiedText.join(" ");
      fkGrade = getFleschKincaidGrade(retryText);
    }

    data.biases = addSeverityStyles(data.biases);
    data.chatBiases = addSeverityStyles(data.chatBiases);
    data.readabilityGrade = `Grade ${fkGrade.toFixed(1)}`;

    res.json(data);
  } catch (error) {
    console.error("Analyze error:", error);
    res.status(500).json({ error: "Failed to analyze policy. Please try again." });
  }
});

module.exports = router;