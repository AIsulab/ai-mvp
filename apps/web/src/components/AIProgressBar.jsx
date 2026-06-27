import { Sparkles } from "lucide-react";

export default function AIProgressBar({ progress = 0, status = "thinking", message = "" }) {
  const stages = [
    { label: "데이터 분석", threshold: 20 },
    { label: "컨텍스트 구성", threshold: 40 },
    { label: "AI 생성 중", threshold: 70 },
    { label: "최적화", threshold: 90 },
    { label: "완료", threshold: 100 },
  ];

  const currentStage = stages.findIndex((s) => progress <= s.threshold);
  const stageLabel = status === "done" ? "완료" : stages[Math.max(0, currentStage)]?.label || "준비";

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-4 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          {status !== "done" ? (
            <Sparkles size={14} className="text-primary animate-pulse-soft" />
          ) : (
            <div className="w-3.5 h-3.5 rounded-full bg-green-500 flex items-center justify-center">
              <svg width="8" height="8" viewBox="0 0 8 8" fill="none"><path d="M1 4L3 6L7 2" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
          )}
          <span className="text-xs font-semibold text-gray-900 dark:text-white">
            {status === "done" ? "생성 완료" : "AI가 문구를 작성하고 있습니다"}
          </span>
        </div>
        <span className="text-[10px] text-gray-400 dark:text-gray-500 font-medium">{stageLabel}</span>
      </div>

      <div className="relative h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
        <div
          className={`absolute inset-y-0 left-0 rounded-full transition-all duration-500 ease-out ${
            status === "done"
              ? "bg-green-500"
              : "bg-gradient-to-r from-primary to-blue-400"
          }`}
          style={{ width: `${Math.min(progress, 100)}%` }}
        />
      </div>

      {message && (
        <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-2 leading-relaxed">{message}</p>
      )}
    </div>
  );
}
