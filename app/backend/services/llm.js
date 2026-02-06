// LLM service - handles all communication with the Groq API
// Using the OpenAI SDK since Groq's API is OpenAI-compatible
const OpenAI = require("openai");

// Create the client using env vars so we never hardcode the key
const client = new OpenAI({
  apiKey: process.env.LLM_API_KEY,
  baseURL: process.env.LLM_BASE_URL,
});

/**
 * Sends a chat completion request to Groq.
 * If the API rate limit is hit (429), we catch it and attach
 * the retry timing info so the frontend can tell the user when to try again.
 */
async function chat(messages, options = {}) {
  try {
    const response = await client.chat.completions.create({
      model: process.env.LLM_MODEL,
      messages,
      temperature: options.temperature ?? 0.3,
      ...options,
    });
    return response.choices[0].message.content;
  } catch (error) {
    // Groq returns 429 when you've hit the free tier limit
    if (error.status === 429) {
      // Pull the retry info from the response headers if available
      const retryAfter = error.headers?.["retry-after"] || null;
      const resetTime =
        error.headers?.["x-ratelimit-reset-requests"] || null;

      const rateLimitError = new Error("Rate limit exceeded");
      rateLimitError.status = 429;
      rateLimitError.retryAfter = retryAfter;
      rateLimitError.resetTime = resetTime;
      throw rateLimitError;
    }
    // For any other error just throw it as-is
    throw error;
  }
}

module.exports = { chat };
