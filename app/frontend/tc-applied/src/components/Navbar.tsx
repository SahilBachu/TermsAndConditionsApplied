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
        <div className="h-8 w-8 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden border border-slate-300 dark:border-slate-600 flex items-center justify-center">
          <span className="material-icons-round text-slate-400 dark:text-slate-500 text-sm">
            person
          </span>
        </div>
      </div>
    </nav>
  );
}
