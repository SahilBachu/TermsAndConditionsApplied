export interface SimplifiedSection {
  title: string;
  content: string;
}

export interface Bias {
  id: string;
  icon: string;
  title: string;
  description: string;
  severity: "high" | "medium" | "low";
  borderColor: string;
  hoverBorderColor: string;
  iconColor: string;
}

export interface ChatMessage {
  id: string;
  role: "assistant" | "user";
  content: string;
  timestamp: string;
}

export const mockSimplifiedSections: SimplifiedSection[] = [
  {
    title: "Changing the Rules",
    content:
      "We can change these terms whenever we want. If you keep using the app after we post changes, it means you agree to them—even if you haven't read them. We don't have to notify you personally when updates happen.",
  },
  {
    title: "Your Content Rights",
    content:
      "When you post things like photos or comments on our app, you still own them. However, you give us permission to use, copy, and show your content anywhere in the world for our marketing advertisements, without paying you any royalties.",
  },
  {
    title: "Account Termination",
    content:
      "You can stop using our service at any time. If you disagree with any new rules we make in the future, your only option is to delete your account and stop accessing the service immediately.",
  },
];

export const mockFullSimplifiedText: string[] = [
  "Our marketing strategy has been updated to focus on a broad spectrum of demographics, moving away from an exclusive focus on young urban professionals. This shift addresses the assumption that only specific groups are receptive to innovation, allowing us to engage with a more diverse audience.",
  "We have implemented new protocols for data handling that prioritize user privacy and transparency. Demographic data is now collected strictly for service improvement purposes. We explicitly state that personal information is not shared with third-party advertisers without clear, affirmative consent from the user.",
  "Additionally, the terms regarding service termination have been clarified. Users may terminate their accounts at any time without penalty. Data retention policies have been adjusted to ensure that user data is deleted within 30 days of account closure, aligning with global privacy standards.",
  "Furthermore, we have removed clauses that could be interpreted as binding arbitration without recourse. Users now retain full rights to pursue legal action if necessary, fostering a more balanced relationship between the service provider and the consumer.",
];

export const mockChangeSummary =
  'Removed subjective language related to "tech-savviness". Clarified data sharing clauses. Added explicit data deletion timelines.';

export const mockBiases: Bias[] = [
  {
    id: "bias-1",
    icon: "warning",
    title: "Unilateral Modification",
    description:
      'Terms allow changes without direct user notification or consent ("Silent Consent").',
    severity: "high",
    borderColor: "border-red-100 dark:border-red-900/30",
    hoverBorderColor: "hover:border-red-200 dark:hover:border-red-800",
    iconColor: "text-red-500",
  },
  {
    id: "bias-2",
    icon: "policy",
    title: "Broad Licensing",
    description:
      "User content can be used for marketing worldwide without compensation.",
    severity: "medium",
    borderColor: "border-orange-100 dark:border-orange-900/30",
    hoverBorderColor: "hover:border-orange-200 dark:hover:border-orange-800",
    iconColor: "text-orange-500",
  },
];

export const mockChatBiases: Bias[] = [
  {
    id: "chat-bias-1",
    icon: "filter_alt_off",
    title: "Exclusionary Framing",
    description: "",
    severity: "high",
    borderColor: "border-red-100 dark:border-red-900/20",
    hoverBorderColor: "hover:border-red-200 dark:hover:border-red-800",
    iconColor: "text-red-500",
  },
  {
    id: "chat-bias-2",
    icon: "psychology",
    title: "Cognitive Bias",
    description: "",
    severity: "medium",
    borderColor: "border-red-100 dark:border-red-900/20",
    hoverBorderColor: "hover:border-red-200 dark:hover:border-red-800",
    iconColor: "text-red-500",
  },
];

export const mockInitialChatMessage: ChatMessage = {
  id: "msg-1",
  role: "assistant",
  content:
    "Hello! I've updated the layout with the full simplified text. I've also isolated the critical biases below for your review. What would you like to know about these changes?",
  timestamp: "Today, 10:23 AM",
};

export const mockSuggestedQuestions = [
  { label: "Question 1", detail: "What is exclusionary framing?" },
  { label: "Question 2", detail: "Show me the original text?" },
  { label: "Question 3", detail: "Are there legal risks?" },
];
