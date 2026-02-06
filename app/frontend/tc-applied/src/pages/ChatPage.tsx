import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { usePolicy } from "../context/PolicyContext";
import DarkModeToggle from "../components/DarkModeToggle";
import {
  mockInitialChatMessage,
  mockSuggestedQuestions,
  type ChatMessage,
} from "../data/mockData";

const API_URL = "http://localhost:3001/api";

export default function ChatPage() {
  const navigate = useNavigate();
  const { inputText, fullSimplifiedText, changeSummary, chatBiases } =
    usePolicy();
  const [messages, setMessages] = useState<ChatMessage[]>([
    mockInitialChatMessage,
  ]);
  const [chatInput, setChatInput] = useState("");
  const [isSending, setIsSending] = useState(false);

  const handleSendMessage = async () => {
    if (chatInput.trim().length === 0 || isSending) return;

    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: "user",
      content: chatInput,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setChatInput("");
    setIsSending(true);

    try {
      const conversationHistory = messages
        .filter((m) => m.id !== "msg-1")
        .map((m) => ({ role: m.role, content: m.content }));

      const response = await fetch(`${API_URL}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: chatInput,
          policyText: inputText,
          conversationHistory,
        }),
      });

      const data = await response.json();

      const aiResponse: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        role: "assistant",
        content: data.reply || "Sorry, I could not process that. Please try again.",
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      setMessages((prev) => [...prev, aiResponse]);
    } catch {
      const errorMessage: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        role: "assistant",
        content: "Sorry, something went wrong. Please try again.",
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsSending(false);
    }
  };

  const handleSuggestedQuestion = (question: string) => {
    setChatInput(question);
  };

  return (
    <div className="bg-background-dark text-slate-800 dark:text-slate-100 min-h-screen flex items-center justify-center p-4 lg:p-8">
      <div className="relative w-full max-w-6xl h-[850px] bg-background-light dark:bg-black rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row border border-gray-200 dark:border-gray-800">
        {/* Left panel: Simplified text + biases */}
        <div className="flex-1 flex flex-col p-6 md:p-8 relative z-0 h-full">
          {/* Header */}
          <header className="flex justify-between items-center mb-6 shrink-0">
            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-3 hover:opacity-80 transition-opacity"
            >
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-glow">
                <span className="material-icons-round">gavel</span>
              </div>
              <div>
                <h1 className="font-bold text-lg text-gray-900 dark:text-white">
                  T&C Applied
                </h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Policy Analysis Dashboard
                </p>
              </div>
            </button>
            <div className="flex gap-4 items-center">
              <DarkModeToggle />
            </div>
          </header>

          <div className="flex flex-col flex-1 min-h-0 gap-6">
            {/* Full simplified text card */}
            <div className="bg-white dark:bg-surface-dark p-6 md:p-8 rounded-3xl shadow-soft border border-gray-100 dark:border-gray-700 flex flex-col relative overflow-hidden flex-1">
              <div className="flex items-center gap-3 mb-6 shrink-0">
                <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded-lg text-green-600 dark:text-green-400">
                  <span className="material-icons-round">text_snippet</span>
                </div>
                <div>
                  <h2 className="font-bold text-gray-900 dark:text-white text-lg">
                    Full Simplified Text
                  </h2>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Optimized for neutrality and clarity
                  </p>
                </div>
              </div>

              <div className="overflow-y-auto pr-2 space-y-5 text-gray-600 dark:text-gray-300 leading-relaxed text-base">
                {fullSimplifiedText.map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
                {changeSummary && (
                  <p className="p-4 bg-blue-50 dark:bg-blue-900/10 rounded-2xl border border-blue-100 dark:border-blue-800/30 text-sm text-blue-800 dark:text-blue-200">
                    <strong>Summary of Changes:</strong> {changeSummary}
                  </p>
                )}
              </div>
            </div>

            {/* Critical biases */}
            <div className="shrink-0">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                <span className="material-icons-round text-red-500 text-sm">
                  warning
                </span>
                Critical Biases Detected
              </h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {chatBiases.map((bias) => (
                  <div
                    key={bias.id}
                    className={`bg-white dark:bg-surface-dark p-4 rounded-2xl border ${bias.borderColor} shadow-sm flex items-center justify-between group cursor-pointer ${bias.hoverBorderColor} transition-all`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-full bg-red-50 dark:bg-red-900/20 flex items-center justify-center ${bias.iconColor}`}
                      >
                        <span className="material-icons-round">
                          {bias.icon}
                        </span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-800 dark:text-gray-100 text-sm">
                          {bias.title}
                        </h4>
                        <p className="text-xs text-red-500 font-medium">
                          {bias.severity === "high"
                            ? "High Severity"
                            : "Medium Severity"}
                        </p>
                      </div>
                    </div>
                    <span className="material-icons-round text-gray-300 group-hover:text-red-400 transition-colors">
                      arrow_forward_ios
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Mobile overlay for chat panel */}
          <div className="absolute inset-0 bg-white/50 dark:bg-black/50 backdrop-blur-sm z-10 md:hidden pointer-events-none"></div>
        </div>

        {/* Right panel: AI Chat sidebar */}
        <div className="w-full md:w-[400px] bg-white dark:bg-surface-dark border-l border-gray-200 dark:border-gray-700 flex flex-col z-20 shadow-2xl relative">
          {/* Chat header */}
          <div className="p-5 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-white dark:bg-surface-dark sticky top-0 z-10">
            <div>
              <h2 className="font-bold text-gray-900 dark:text-white text-lg">
                AI Assistant
              </h2>
              <p className="text-xs text-green-500 flex items-center gap-1 font-medium">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>{" "}
                Online
              </p>
            </div>
            <button
              onClick={() => navigate("/result")}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition"
            >
              <span className="material-icons-round">close</span>
            </button>
          </div>

          {/* Chat messages */}
          <div className="flex-1 overflow-y-auto p-5 space-y-6 bg-gray-50/50 dark:bg-gray-900/30">
            {messages.map((msg, index) => (
              <div key={msg.id}>
                {index === 0 && (
                  <div className="flex justify-center mb-6">
                    <span className="text-[10px] uppercase tracking-wider text-gray-400 font-medium">
                      {msg.timestamp}
                    </span>
                  </div>
                )}

                {msg.role === "assistant" ? (
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white shadow-lg flex-shrink-0">
                      <span className="material-icons-round text-sm">
                        auto_awesome
                      </span>
                    </div>
                    <div className="flex flex-col gap-1 max-w-[90%]">
                      <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl rounded-tl-none shadow-sm text-sm text-gray-700 dark:text-gray-200 leading-relaxed border border-gray-100 dark:border-gray-700">
                        {msg.content}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex gap-3 justify-end">
                    <div className="flex flex-col gap-1 max-w-[90%]">
                      <div className="bg-primary text-white p-4 rounded-2xl rounded-tr-none shadow-sm text-sm leading-relaxed">
                        {msg.content}
                      </div>
                    </div>
                  </div>
                )}

                {/* Show suggested questions after the first assistant message */}
                {index === 0 && msg.role === "assistant" && (
                  <div className="pl-11 mt-4">
                    <p className="text-xs text-gray-400 font-medium mb-2">
                      Suggested questions:
                    </p>
                    <div className="flex flex-col gap-2">
                      {mockSuggestedQuestions.map((q, qIndex) => (
                        <button
                          key={qIndex}
                          onClick={() => handleSuggestedQuestion(q.detail)}
                          className="group text-left bg-white dark:bg-gray-800 hover:bg-blue-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700 hover:border-blue-200 dark:hover:border-blue-500/30 rounded-2xl px-4 py-2.5 transition-all duration-200 shadow-sm flex items-center justify-between w-full"
                        >
                          <span className="text-sm text-gray-600 dark:text-gray-300 group-hover:text-primary dark:group-hover:text-blue-400 font-medium">
                            {q.label}
                          </span>
                          <span className="text-xs text-gray-400 dark:text-gray-500 ml-2">
                            {q.detail}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Chat input */}
          <div className="p-5 bg-white dark:bg-surface-dark border-t border-gray-100 dark:border-gray-700">
            <div className="relative flex items-center">
              <input
                type="text"
                className="w-full pl-4 pr-12 py-3.5 bg-gray-50 dark:bg-gray-800 border-none rounded-2xl text-sm text-gray-800 dark:text-white focus:ring-2 focus:ring-primary/20 focus:bg-white dark:focus:bg-gray-900 transition-all shadow-inner placeholder-gray-400"
                placeholder="Ask a custom question..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSendMessage();
                }}
              />
              <button
                onClick={handleSendMessage}
                disabled={isSending}
                className="absolute right-2 p-2 bg-primary hover:bg-primary-dark text-white rounded-xl shadow-lg shadow-blue-500/30 transition-all hover:scale-105 active:scale-95 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className={`material-icons-round text-sm ${isSending ? "animate-spin" : ""}`}>
                  {isSending ? "hourglass_empty" : "send"}
                </span>
              </button>
            </div>
            <div className="mt-3 text-center">
              <p className="text-[10px] text-gray-400">
                AI can make mistakes. Please verify important info.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile floating chat button */}
      <button
        className="lg:hidden fixed bottom-6 right-6 w-14 h-14 bg-primary text-white rounded-full shadow-2xl flex items-center justify-center z-50"
        onClick={() => {}}
      >
        <span className="material-icons-round">chat</span>
      </button>
    </div>
  );
}
