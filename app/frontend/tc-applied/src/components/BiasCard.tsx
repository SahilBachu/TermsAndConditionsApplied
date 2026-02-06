// BiasCard - reusable card component for displaying a detected bias
// Used in both ResultPage (with description) and ChatPage (compact with arrow)
import type { Bias } from "../data/mockData";

interface BiasCardProps {
  bias: Bias;
  showDescription?: boolean;
  showArrow?: boolean;
}

export default function BiasCard({
  bias,
  showDescription = true,
  showArrow = false,
}: BiasCardProps) {
  // Map the severity to a readable label
  const severityLabel =
    bias.severity === "high"
      ? "High Severity"
      : bias.severity === "medium"
        ? "Medium Severity"
        : "Low Severity";

  return (
    <div
      className={`bg-white dark:bg-slate-800 p-4 rounded-xl border ${bias.borderColor} shadow-sm flex ${showArrow ? "items-center justify-between" : ""} gap-4 transition-all hover:shadow-md ${bias.hoverBorderColor} ${showArrow ? "cursor-pointer" : ""}`}
    >
      <div className={`flex ${showArrow ? "items-center" : ""} gap-3`}>
        {/* Icon - circular when in compact mode, inline when showing description */}
        {showArrow ? (
          <div
            className={`w-10 h-10 rounded-full bg-red-50 dark:bg-red-900/20 flex items-center justify-center ${bias.iconColor}`}
          >
            <span className="material-icons-round">{bias.icon}</span>
          </div>
        ) : (
          <span className={`material-icons-round ${bias.iconColor} mt-0.5`}>
            {bias.icon}
          </span>
        )}
        <div>
          <h4 className="font-bold text-sm text-slate-800 dark:text-slate-100">
            {bias.title}
          </h4>
          {/* Show severity label in compact mode, description in full mode */}
          {showArrow ? (
            <p className="text-xs text-red-500 font-medium">{severityLabel}</p>
          ) : showDescription && bias.description ? (
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-normal">
              {bias.description}
            </p>
          ) : null}
        </div>
      </div>
      {showArrow && (
        <span className="material-icons-round text-gray-300 group-hover:text-red-400 transition-colors">
          arrow_forward_ios
        </span>
      )}
    </div>
  );
}
