/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: "#2563EB",
        "primary-hover": "#1e40af",
        "primary-dark": "#1d4ed8",
        "background-light": "#f3f4f6",
        "background-dark": "#0f172a",
        "card-light": "#ffffff",
        "card-dark": "#1e293b",
        "text-light": "#1f2937",
        "text-dark": "#f8fafc",
        "subtext-light": "#6b7280",
        "subtext-dark": "#94a3b8",
        "accent-light": "#eff6ff",
        "accent-dark": "#172554",
        "surface-light": "#ffffff",
        "surface-dark": "#1e293b",
      },
      fontFamily: {
        display: ["Inter", "sans-serif"],
        sans: ["Inter", "sans-serif"],
      },
      borderRadius: {
        DEFAULT: "0.75rem",
        "2xl": "1rem",
        "3xl": "1.5rem",
      },
      boxShadow: {
        soft: "0 4px 20px -2px rgba(0, 0, 0, 0.05)",
        glow: "0 0 15px rgba(37, 99, 235, 0.2)",
      },
    },
  },
  plugins: [
    require("@tailwindcss/forms"),
  ],
};
