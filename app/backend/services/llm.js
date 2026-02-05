const OpenAI = require("openai");

const client = new OpenAI({
  apiKey: process.env.LLM_API_KEY,
  baseURL: process.env.LLM_BASE_URL,
});

async function chat(messages, options = {}) {
  const response = await client.chat.completions.create({
    model: process.env.LLM_MODEL,
    messages,
    temperature: options.temperature ?? 0.3,
    ...options,
  });
  return response.choices[0].message.content;
}