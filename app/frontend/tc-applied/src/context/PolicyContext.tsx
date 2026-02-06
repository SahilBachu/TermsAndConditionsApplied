import { createContext, useContext, useState, type ReactNode } from "react";
import { type SimplifiedSection, type Bias } from "../data/mockData";

const API_URL = "http://localhost:3001/api";

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
  const [inputText, setInputText] = useState("");
  const [isSimplified, setIsSimplified] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const [simplifiedSections, setSimplifiedSections] = useState<
    SimplifiedSection[]
  >([]);
  const [fullSimplifiedText, setFullSimplifiedText] = useState<string[]>([]);
  const [changeSummary, setChangeSummary] = useState("");
  const [biases, setBiases] = useState<Bias[]>([]);
  const [chatBiases, setChatBiases] = useState<Bias[]>([]);
  const [readabilityGrade, setReadabilityGrade] = useState("");

  const handleSimplify = async () => {
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_URL}/analyze`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ policyText: inputText }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to analyze policy.");
      }

      const data = await response.json();

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

export function usePolicy() {
  const context = useContext(PolicyContext);
  if (context === undefined) {
    throw new Error("usePolicy must be used within a PolicyProvider");
  }
  return context;
}
