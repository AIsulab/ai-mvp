import { Zap, Instagram, MessageSquare, FileText } from "lucide-react";

export default function MarketingEngine({ marketingResult }) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-5">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-[14px] font-semibold text-gray-900 flex items-center gap-1.5">
          <Zap size={15} className="text-gray-400" /> 마케팅 엔진
        </h3>
        <span className="text-[11px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full font-medium">AI</span>
      </div>
      <div className="flex gap-2 mb-3 border-b border-gray-100 pb-2">
        {[
          { icon: Instagram, label: "인스타", active: true },
          { icon: MessageSquare, label: "카카오", active: false },
          { icon: FileText, label: "네이버", active: false },
        ].map((tab, i) => (
          <button key={i} className={`text-[12px] font-medium flex items-center gap-1 pb-1 border-b-2 transition-colors ${tab.active ? "border-gray-900 text-gray-900" : "border-transparent text-gray-400 hover:text-gray-600"}`}>
            <tab.icon size={12} /> {tab.label}
          </button>
        ))}
      </div>
      <div className="bg-gray-50 rounded-lg p-4 min-h-[110px]">
        {marketingResult ? (
          <p className="text-[13px] text-gray-700 whitespace-pre-wrap leading-relaxed">{marketingResult}</p>
        ) : (
          <p className="text-[12px] text-gray-400">분석 시작 버튼을 누르면 AI가 문구를 작성합니다</p>
        )}
      </div>
    </div>
  );
}
