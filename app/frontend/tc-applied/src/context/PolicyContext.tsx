// PolicyContext - global state for the app
// Holds the policy text, simplified results, and handles the API call to analyze
import { createContext, useContext, useState, type ReactNode } from "react";
import { type SimplifiedSection, type Bias } from "../data/mockData";

// Use VITE_API_URL from env if set (for production on Render), otherwise default to localhost for dev
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001/api";

// Shape of everything the context provides to child components
interface PolicyContextType {
  inputText: string;
  setInputText: (text: string) => void;
  simplifiedSections: SimplifiedSection[];
  fullSimplifiedText: string[];
  changeSummary: string;
  biases: Bias[];
  chatBiases: Bias[];
  readabilityGrade: string;
  isSimplified: boolean;
  isLoading: boolean;
  error: string;
  handleSimplify: () => Promise<boolean>;
  handleReset: () => void;
}

const PolicyContext = createContext<PolicyContextType | undefined>(undefined);

export function PolicyProvider({ children }: { children: ReactNode }) {
  // The raw policy text the user pastes in
  const [inputText, setInputText] = useState("");
  const [isSimplified, setIsSimplified] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // All the data we get back from the /analyze endpoint
  const [simplifiedSections, setSimplifiedSections] = useState<
    SimplifiedSection[]
  >([]);
  const [fullSimplifiedText, setFullSimplifiedText] = useState<string[]>([]);
  const [changeSummary, setChangeSummary] = useState("");
  const [biases, setBiases] = useState<Bias[]>([]);
  const [chatBiases, setChatBiases] = useState<Bias[]>([]);
  const [readabilityGrade, setReadabilityGrade] = useState("");

  // Sends the policy to the backend for analysis
  const handleSimplify = async () => {
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_URL}/analyze`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ policyText: inputText }),
      });

      // Handle rate limiting - show the user when they can try again
      if (response.status === 429) {
        const errorData = await response.json();
        const retryMsg = errorData.retryAfter
          ? `Please try again in ${errorData.retryAfter} seconds.`
          : errorData.resetTime
            ? `Limit resets in ${errorData.resetTime}.`
            : "Please try again in a few minutes.";
        throw new Error(`API rate limit reached. ${retryMsg}`);
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to analyze policy.");
      }

      const data = await response.json();

      // Populate all the state with the response data
      setSimplifiedSections(data.simplifiedSections);
      setFullSimplifiedText(data.fullSimplifiedText);
      setChangeSummary(data.changeSummary);
      setBiases(data.biases);
      setChatBiases(data.chatBiases);
      setReadabilityGrade(data.readabilityGrade);
      setIsSimplified(true);
      return true;
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Something went wrong."
      );
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Clears everything so the user can start fresh
  const handleReset = () => {
    setInputText("");
    setIsSimplified(false);
    setError("");
    setSimplifiedSections([]);
    setFullSimplifiedText([]);
    setChangeSummary("");
    setBiases([]);
    setChatBiases([]);
    setReadabilityGrade("");
  };

  return (
    <PolicyContext.Provider
      value={{
        inputText,
        setInputText,
        simplifiedSections,
        fullSimplifiedText,
        changeSummary,
        biases,
        chatBiases,
        readabilityGrade,
        isSimplified,
        isLoading,
        error,
        handleSimplify,
        handleReset,
      }}
    >
      {children}
    </PolicyContext.Provider>
  );
}

// Custom hook so we don't have to useContext(PolicyContext) everywhere
export function usePolicy() {
  const context = useContext(PolicyContext);
  if (context === undefined) {
    throw new Error("usePolicy must be used within a PolicyProvider");
  }
  return context;
}
