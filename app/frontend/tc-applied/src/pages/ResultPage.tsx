import { useNavigate } from "react-router-dom";
import { usePolicy } from "../context/PolicyContext";
import Navbar from "../components/Navbar";
import BiasCard from "../components/BiasCard";

export default function ResultPage() {
  const navigate = useNavigate();
  const { simplifiedSections, biases, readabilityGrade } = usePolicy();

  return (
    <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 font-sans antialiased min-h-screen flex flex-col transition-colors duration-300">
      <Navbar />

      <main className="flex-1 w-full max-w-4xl mx-auto p-6 md:p-12 flex flex-col items-center justify-start">
        <div className="w-full bg-white dark:bg-slate-800 rounded-2xl shadow-xl shadow-slate-200/50 dark:shadow-black/30 border border-slate-100 dark:border-slate-700 relative overflow-hidden transition-all duration-300">
          {/* Header */}
          <div className="px-6 py-5 md:px-8 md:py-6 border-b border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400 shrink-0">
                <span className="material-icons-round text-2xl">
                  auto_fix_high
                </span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100 tracking-tight">
                  Simplified Policy
                </h1>
                <div className="flex items-center gap-2 mt-1">
                  <span className="material-icons-round text-sm text-slate-400">
                    description
                  </span>
                  <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                    Privacy_Policy_Analysis.docx
                  </span>
                </div>
              </div>
            </div>

            {/* Readability badge */}
            <div className="flex items-center self-start md:self-center gap-3 px-4 py-2 bg-emerald-50 dark:bg-emerald-900/10 text-emerald-700 dark:text-emerald-400 rounded-lg border border-emerald-100 dark:border-emerald-900/20">
              <div className="flex flex-col items-end">
                <span className="text-[10px] uppercase font-bold tracking-wider opacity-70">
                  Readability
                </span>
                <span className="text-sm font-bold">{readabilityGrade}</span>
              </div>
              <div className="h-8 w-8 rounded-full bg-white dark:bg-slate-800 flex items-center justify-center shadow-sm">
                <span className="material-icons-round text-lg">school</span>
              </div>
            </div>
          </div>

          {/* Simplified content */}
          <div className="p-6 md:p-10 space-y-6">
            <p className="text-lg text-slate-700 dark:text-slate-200 leading-relaxed font-medium">
              Here is the simplified version of the document you uploaded.
              We've removed complex legal jargon to help you understand your
              rights and obligations quickly.
            </p>

            <div className="space-y-6 pl-4 border-l-2 border-slate-200 dark:border-slate-700">
              {simplifiedSections.map((section, index) => (
                <div key={index} className="relative">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
                    {section.title}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                    {section.content}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Critical Biases section */}
          {biases.length > 0 && (
            <div className="bg-red-50/50 dark:bg-red-900/10 border-t border-red-100 dark:border-red-900/30 p-6 md:p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg text-red-600 dark:text-red-400">
                    <span className="material-icons-round">gavel</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white">
                      Critical Biases Found
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {biases.length} clauses flagged by AI analysis
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {biases.map((bias) => (
                  <BiasCard key={bias.id} bias={bias} />
                ))}
              </div>
            </div>
          )}

          {/* Floating chat button */}
          <div className="absolute bottom-6 right-6 md:bottom-8 md:right-8 z-10">
            <button
              onClick={() => navigate("/chat")}
              className="bg-white dark:bg-slate-700 text-slate-400 dark:text-slate-300 hover:text-primary dark:hover:text-primary hover:bg-slate-50 dark:hover:bg-slate-600 p-3 rounded-full border border-slate-200 dark:border-slate-600 shadow-lg shadow-slate-200/50 dark:shadow-black/50 transition-all hover:scale-105 active:scale-95"
              title="Ask AI Assistant"
            >
              <span className="material-icons-round text-2xl">
                chat_bubble_outline
              </span>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
