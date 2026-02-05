import { createContext, useContext, useState, type ReactNode } from "react";
import {
  mockSimplifiedSections,
  mockFullSimplifiedText,
  mockChangeSummary,
  mockBiases,
  mockChatBiases,
  type SimplifiedSection,
  type Bias,
} from "../data/mockData";

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
  handleSimplify: () => void;
  handleReset: () => void;
}

const PolicyContext = createContext<PolicyContextType | undefined>(undefined);

export function PolicyProvider({ children }: { children: ReactNode }) {
  const [inputText, setInputText] = useState("");
  const [isSimplified, setIsSimplified] = useState(false);

  const handleSimplify = () => {
    setIsSimplified(true);
  };

  const handleReset = () => {
    setInputText("");
    setIsSimplified(false);
  };

  return (
    <PolicyContext.Provider
      value={{
        inputText,
        setInputText,
        simplifiedSections: isSimplified ? mockSimplifiedSections : [],
        fullSimplifiedText: isSimplified ? mockFullSimplifiedText : [],
        changeSummary: isSimplified ? mockChangeSummary : "",
        biases: isSimplified ? mockBiases : [],
        chatBiases: isSimplified ? mockChatBiases : [],
        readabilityGrade: "Grade 6.0",
        isSimplified,
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
