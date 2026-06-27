import { Zap, Instagram, MessageSquare, FileText } from "lucide-react";

export default function MarketingEngine({ marketingResult }) {
  return (
    <div
      className="bg-white dark:bg-gray-800 rounded-xl p-5 md:p-6 flex-1"
      style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-[15px] font-semibold text-[#111827] dark:text-white flex items-center gap-2">
          <Zap className="text-yellow-500 fill-yellow-500" size={16} /> 마케팅 엔진
        </h2>
        <div className="flex items-center gap-2">
          <span className="text-[10px] bg-[#FFF7ED] text-[#EA580C] dark:bg-orange-900/30 dark:text-orange-400 px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
            <span className="w-1 h-1 rounded-full bg-orange-500"></span> 핵심
          </span>
          <span className="text-xs bg-primary text-white px-2.5 py-0.5 rounded-full font-semibold">AI</span>
        </div>
      </div>

      <div className="flex overflow-x-auto mb-4 -mx-1 px-1 gap-1">
        {[
          { icon: Instagram, label: "인스타그램", active: true },
          { icon: MessageSquare, label: "카카오", active: false },
          { icon: FileText, label: "네이버", active: false },
        ].map((tab, i) => (
          <button key={i} className={`px-4 py-2 text-xs font-medium whitespace-nowrap flex items-center gap-1.5 transition-colors rounded-lg ${tab.active ? "bg-[#EFF6FF] text-[#2563EB] font-semibold" : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"}`}>
            <tab.icon size={13} /> {tab.label}
          </button>
        ))}
      </div>

      <div className="bg-[#F9FAFB] dark:bg-gray-700/50 rounded-xl p-4 mb-4">
        <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-relaxed">
          날씨 분석 중 AI가 자동으로 상황을 판단하여 최적 마케팅 문구를 생성합니다. 프롬프트 작성이 필요 없습니다.
        </p>
      </div>

      <label className="text-xs font-semibold text-primary flex items-center gap-1.5 mb-2">
        <span className="w-4 h-4 rounded bg-[#EFF6FF] flex items-center justify-center text-[10px] text-[#2563EB] font-bold">AI</span>
        AI 생성 마케팅 문구
      </label>
      <div className="w-full min-h-[120px] bg-[#F9FAFB] dark:bg-gray-700/30 rounded-xl p-4 text-sm text-[#111827] dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
        {marketingResult ? marketingResult : <span className="text-gray-400 dark:text-gray-500">날씨 분석 시작 버튼을 누르면 AI가 자동으로 문구를 작성합니다.</span>}
      </div>
    </div>
  );
}
