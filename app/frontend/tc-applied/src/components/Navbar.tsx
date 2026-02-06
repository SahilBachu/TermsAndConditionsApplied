// Navbar - top navigation bar with the logo and dark mode toggle
// Clicking the logo takes you back to the input page
import { useNavigate } from "react-router-dom";
import DarkModeToggle from "./DarkModeToggle";

export default function Navbar() {
  const navigate = useNavigate();

  return (
    <nav className="w-full px-8 py-5 flex items-center justify-between border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md sticky top-0 z-50">
      <button
        onClick={() => navigate("/")}
        className="flex items-center gap-3 hover:opacity-80 transition-opacity"
      >
        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-primary/30">
          T
        </div>
        <span className="font-bold text-lg tracking-tight text-slate-900 dark:text-white">
          T&C Applied
        </span>
      </button>
      <div className="flex items-center gap-4">
        <DarkModeToggle />
      </div>
    </nav>
  );
}
