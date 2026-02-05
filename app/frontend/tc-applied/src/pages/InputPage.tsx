import { useNavigate } from "react-router-dom";
import { usePolicy } from "../context/PolicyContext";

export default function InputPage() {
  const navigate = useNavigate();
  const { inputText, setInputText, handleSimplify, handleReset } = usePolicy();

  const onSimplify = () => {
    if (inputText.trim().length === 0) return;
    handleSimplify();
    navigate("/result");
  };

  const onReset = () => {
    handleReset();
  };

  const onClear = () => {
    setInputText("");
  };

  return (
    <div className="bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark min-h-screen flex items-center justify-center p-4 selection:bg-primary selection:text-white transition-colors duration-300">
      <main className="w-full max-w-4xl bg-card-light dark:bg-card-dark rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden relative">
        {/* Gradient accent bar */}
        <div className="h-2 w-full bg-gradient-to-r from-blue-400 to-primary"></div>

        <div className="flex flex-col md:flex-row h-full">
          {/* Sidebar */}
          <aside className="w-full md:w-1/3 bg-gray-50 dark:bg-slate-800/50 p-8 border-r border-gray-100 dark:border-gray-700 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center text-white shadow-lg shadow-blue-500/30">
                  <span className="material-icons-round text-2xl">gavel</span>
                </div>
                <h1 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
                  T&C Applied
                </h1>
              </div>

              <div className="space-y-6">
                <div>
                  <h2 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-2">
                    About
                  </h2>
                  <p className="text-sm text-subtext-light dark:text-subtext-dark leading-relaxed">
                    Legal jargon is confusing. We use AI to simplify privacy
                    policies and terms of service, lowering their Flesch-Kincaid
                    score so they are actually readable.
                  </p>
                </div>

                {/* Feature card: Bias Detection */}
                <div className="p-4 bg-white dark:bg-slate-700 rounded-xl border border-gray-100 dark:border-gray-600 shadow-sm">
                  <div className="flex items-start gap-3">
                    <span className="material-icons-round text-primary mt-0.5">
                      psychology
                    </span>
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                        Bias Detection
                      </h3>
                      <p className="text-xs text-subtext-light dark:text-subtext-dark mt-1">
                        We highlight framing effects and self-enhancement biases
                        automatically.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Feature card: Plain English */}
                <div className="p-4 bg-white dark:bg-slate-700 rounded-xl border border-gray-100 dark:border-gray-600 shadow-sm">
                  <div className="flex items-start gap-3">
                    <span className="material-icons-round text-primary mt-0.5">
                      translate
                    </span>
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                        Plain English
                      </h3>
                      <p className="text-xs text-subtext-light dark:text-subtext-dark mt-1">
                        Transform complex legal phrasing into simple, everyday
                        language.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2 text-xs text-subtext-light dark:text-subtext-dark">
                <span className="material-icons-round text-base">security</span>
                <span>Your data is processed locally when possible.</span>
              </div>
            </div>
          </aside>

          {/* Main content area */}
          <div className="w-full md:w-2/3 p-8 flex flex-col h-full">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Input Policy Text
              </h2>
              <span className="px-3 py-1 bg-blue-50 dark:bg-blue-900/30 text-primary text-xs font-medium rounded-full">
                Beta v1.0
              </span>
            </div>

            <div className="flex-grow relative group">
              <textarea
                className="w-full h-80 md:h-96 p-4 bg-gray-50 dark:bg-slate-800/50 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none resize-none transition-all text-sm leading-relaxed text-gray-700 dark:text-gray-300 placeholder-gray-400 dark:placeholder-gray-500 shadow-inner"
                placeholder="Paste your privacy policy, terms of service, or any complex legal text here..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
              />
              {inputText.length > 0 && (
                <button
                  onClick={onClear}
                  className="absolute top-4 right-4 p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                  title="Clear text"
                >
                  <span className="material-icons-round text-sm">close</span>
                </button>
              )}
            </div>

            <div className="mt-6 flex items-center justify-between gap-4">
              <button
                onClick={onReset}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-medium text-subtext-light dark:text-subtext-dark hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
              >
                <span className="material-icons-round text-lg">
                  restart_alt
                </span>
                Reset
              </button>

              <div className="flex items-center gap-3">
                <div className="text-xs text-subtext-light dark:text-subtext-dark hidden sm:block">
                  {inputText.length} characters
                </div>
                <button
                  onClick={onSimplify}
                  disabled={inputText.trim().length === 0}
                  className="flex items-center gap-2 px-8 py-2.5 bg-primary hover:bg-primary-hover text-white rounded-xl text-sm font-medium shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
                >
                  <span className="material-icons-round text-lg">
                    auto_fix_high
                  </span>
                  Simplify
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Background decorative elements */}
      <div className="fixed top-0 left-0 w-full h-full -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-400/10 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-400/10 rounded-full blur-[100px]"></div>
      </div>
    </div>
  );
}
