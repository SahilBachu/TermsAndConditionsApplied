// Main server file - sets up Express, middleware, and routes
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

// CORS setup - allow the frontend origin in production, everything in dev
// FRONTEND_URL should be set on Render (e.g. https://tc-applied.onrender.com)
const allowedOrigins = process.env.FRONTEND_URL
  ? [process.env.FRONTEND_URL]
  : ["http://localhost:5173"];

app.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST"],
  })
);

// Cap request body size so nobody sends us a 10MB policy lol
app.use(express.json({ limit: "50kb" }));

// Mount the two API route files under /api
app.use("/api", require("./routes/analyze"));
app.use("/api", require("./routes/chat"));

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
