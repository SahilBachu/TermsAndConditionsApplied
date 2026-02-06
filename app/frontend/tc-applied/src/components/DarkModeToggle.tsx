// DarkModeToggle - button that switches between light and dark mode
// Persists the choice to localStorage so it sticks across sessions
import { useEffect, useState } from "react";

export default function DarkModeToggle() {
  // Check the current state on mount (the class is set in index.html before React loads)
  const [isDark, setIsDark] = useState(() => {
    return document.documentElement.classList.contains("dark");
  });

  // Whenever isDark changes, update the DOM class and localStorage
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
      localStorage.theme = "dark";
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.theme = "light";
    }
  }, [isDark]);

  return (
    <button
      onClick={() => setIsDark(!isDark)}
      className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-colors"
      aria-label="Toggle dark mode"
    >
      <span className="material-icons-round text-xl">brightness_4</span>
    </button>
  );
}
