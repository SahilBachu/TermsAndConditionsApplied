# TermsAndConditionsApplied

**Live Demo**: https://tc-applied.onrender.com/

**Research Paper**: [The Transparency Gap: Quantifying Cognitive Load in User Agreements vs. Marketing Material](https://docs.google.com/document/d/1GWxOyPhcyHWUIrFQdYf49-mufRJIneKFz6v4P_48klA/edit?usp=sharing)

A semantic privacy policy simplifier that reduces the cognitive load of legal text using LLM-powered ontology-based extraction. Built on the methodology of Kaur et al. (2022), this tool maps privacy policy clauses to semantic nodes (Data Collection, Third-Party Sharing, Data Retention, User Rights, Security) and rewrites them at a Flesch-Kincaid Grade Level of 8 or lower.

## Research Background

This project stems from a study titled **"The Transparency Gap: Quantifying Cognitive Load in User Agreements vs. Marketing Material"** (Bachu, 2026). The study analyzed 10 organizations across industries and found the following:

- Homepage marketing text averaged a Flesch-Kincaid grade of **11.7** (high school level).
- Privacy policies averaged a Flesch-Kincaid grade of **15.4** (post-graduate level).
- The average gap of **3.7 grade levels** creates a cognitive barrier that discourages users from reading the policies they agree to.

McDonald and Cranor (2008) estimated that reading all encountered privacy policies would cost American internet users approximately 201 hours per year, equivalent to roughly $781 billion in lost productivity. Kaur et al. (2022) proposed a semantic-based approach to reduce this reading time through ontology-based extraction. This tool implements that approach using a large language model as the extraction and simplification engine.

The Flesch-Kincaid Grade Level algorithm, as defined by Flesch (1948), assigns a U.S. school grade level to a body of text based on average sentence length and average syllables per word. The formula is:

    Grade = (0.39 x ASL) + (11.8 x ASW) - 15.59

Where ASL is the average sentence length and ASW is the average number of syllables per word.

The full research paper is available at `research/final_research.pdf`. The raw dataset and analysis script used to produce the findings are located in the `research/` directory.

## Features

- Accepts any privacy policy as raw text and returns a complete plain-English rewrite targeting a Flesch-Kincaid Grade Level of 8 or lower.
- Ontology-based extraction organizes findings into five semantic categories: Data Collection, Third-Party Sharing, Data Retention, User Rights, and Security.
- Bias detection identifies clauses that are unfair or one-sided (forced arbitration, data selling without consent, unilateral modification rights, vague data collection) and classifies them by severity (high, medium, low).
- Interactive AI chat allows users to ask follow-up questions about the analyzed policy in plain language.
- Real-time Flesch-Kincaid scoring with an automatic retry loop: if the LLM output exceeds the target grade level, the system feeds the score back and requests further simplification (up to 2 retries).
- Dark mode support with persistent preference stored in localStorage.

## Architecture

```
app/
  backend/              Express.js API server
    routes/
      analyze.js        POST /api/analyze - main simplification endpoint
      chat.js           POST /api/chat - follow-up question endpoint
    services/
      llm.js            Groq API client with rate limit handling
      readability.js    Flesch-Kincaid scoring wrapper
    prompts/
      system.js         System prompts for analysis and chat modes
    server.js           Express server entry point
  frontend/
    tc-applied/         React + TypeScript + Vite + Tailwind CSS
      src/
        pages/          InputPage, ResultPage, ChatPage
        components/     Navbar, BiasCard, DarkModeToggle
        context/        PolicyContext (global state + API calls)
        data/           Type definitions and mock data
research/
  analysis_script/
    src/script.py       Python script for FK grade analysis of the dataset
    requirements.txt    Python dependencies
  data/
    PrivacyPolicies/    Raw privacy policy text for 10 organizations
    HomepageMarketing/  Raw homepage marketing text for 10 organizations
  final_research.pdf    Full research paper
```

## Technology Stack

- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS, React Router
- **Backend**: Express.js 5, OpenAI SDK (connected to Groq API)
- **LLM**: Llama 3.3 70B Versatile via Groq
- **Readability Scoring**: text-readability (Node.js), readability (Python)
- **Research Analysis**: Python 3, NLTK, Matplotlib

## Prerequisites

- Node.js 18 or higher
- Python 3.10 or higher (only required for the research analysis script)
- A Groq API key (free tier available at https://console.groq.com)

## Setup

### Backend

```bash
cd app/backend
cp .env.example .env
```

Edit `.env` and add your Groq API key, then:

```bash
npm install
npm start
```

The server starts on port 3001 by default.

### Frontend

```bash
cd app/frontend/tc-applied
npm install
npm run dev
```

The development server starts on port 5173 by default.

### Research Analysis Script (Optional)

```bash
cd research/analysis_script
pip install -r requirements.txt
python src/script.py
```

This script calculates the Flesch-Kincaid grade level for each text file in the dataset and generates a comparison bar chart.

## Environment Variables

### Backend (`app/backend/.env`)

| Variable       | Description                          | Example                              |
|----------------|--------------------------------------|--------------------------------------|
| `LLM_API_KEY`  | Groq API key                         | `gsk_...`                            |
| `LLM_BASE_URL` | Groq API base URL                    | `https://api.groq.com/openai/v1`     |
| `LLM_MODEL`    | Model identifier                     | `llama-3.3-70b-versatile`            |
| `PORT`         | Backend server port                  | `3001`                               |
| `FRONTEND_URL` | Allowed CORS origin (production)     | `https://tc-applied.onrender.com`    |

### Frontend

| Variable        | Description                          | Example                                      |
|-----------------|--------------------------------------|----------------------------------------------|
| `VITE_API_URL`  | Backend API base URL (production)    | `https://tc-applied-api.onrender.com/api`    |

In development, the frontend defaults to `http://localhost:3001/api` when `VITE_API_URL` is not set.

## API Rate Limits

This application uses the Groq free tier, which enforces per-minute and per-day request limits. When the rate limit is exceeded, the backend returns a 429 response with retry timing information, and the frontend displays a message indicating when the user can try again. This is expected behavior for the free tier and does not indicate a bug.

## References

- Bachu, S. (2026). "The Transparency Gap: Quantifying Cognitive Load in User Agreements vs. Marketing Material."
- Flesch, R. (1948). "A New Readability Yardstick." *Journal of Applied Psychology*, 32(3), 221-233.
- Kaur, J., et al. (2022). "A Semantic-based Approach to Reduce the Reading Time of Privacy Policies." *2022 IEEE World AI IoT Congress (AIIoT)*, IEEE, 317-323. doi:10.1109/AIIoT54504.2022.9851970.
- McDonald, A. M., and Cranor, L. F. (2008). "The Cost of Reading Privacy Policies." *I/S: A Journal of Law and Policy for the Information Society*, 4(3), 543-568.
- Readable. "Flesch Reading Ease and the Flesch Kincaid Grade Level." readable.com. Accessed Feb. 2026.

## License

This project was developed as an academic research application.
