import { Zap, Instagram, MessageSquare, FileText } from "lucide-react";
import { Card } from "../../../components/ui";

export default function MarketingEngine({ marketingResult }) {
  return (
    <Card className="flex-1">
      <div className="flex justify-between items-center mb-4 border-b border-gray-100 pb-4">
        <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
          <Zap className="text-yellow-500 fill-yellow-500" size={16} /> 마케팅 엔진
        </h3>
        <div className="flex items-center gap-2">
          <span className="text-[10px] bg-orange-50 text-orange-600 px-2 py-0.5 rounded-full font-semibold border border-orange-100">핵심</span>
          <span className="text-xs bg-primary text-white px-2 py-0.5 rounded-full font-medium">AI</span>
        </div>
      </div>
      <div className="flex overflow-x-auto border-b border-gray-100 mb-4 -mx-1 px-1">
        {[
          { icon: Instagram, label: "인스타그램", active: true },
          { icon: MessageSquare, label: "카카오", active: false },
          { icon: FileText, label: "네이버", active: false },
        ].map((tab, i) => (
          <button key={i} className={`px-3 md:px-4 py-2 border-b-2 text-xs md:text-sm font-medium whitespace-nowrap flex items-center gap-1.5 transition-colors ${tab.active ? "border-primary text-primary" : "border-transparent text-gray-400 hover:text-gray-600"}`}>
            <tab.icon size={13} /> {tab.label}
          </button>
        ))}
      </div>
      <div className="bg-gray-50 border border-gray-100 rounded-xl p-3 md:p-4 mb-4">
        <p className="text-[11px] text-gray-500 leading-relaxed">
          날씨 분석 중 AI가 자동으로 상황을 판단하여 최적 마케팅 문구를 생성합니다.
        </p>
      </div>
      <label className="text-[11px] font-semibold text-primary flex items-center gap-1.5 mb-2">
        <span className="w-3.5 h-3.5 rounded bg-primary-50 flex items-center justify-center text-[10px] text-primary font-bold">AI</span>
        AI 생성 마케팅 문구
      </label>
      <div className="w-full min-h-[120px] bg-primary-50 border border-primary-100 rounded-xl p-3 md:p-4 text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
        {marketingResult ? marketingResult : <span className="text-gray-400">날씨 분석 시작 버튼을 누르면 AI가 자동으로 문구를 작성합니다.</span>}
      </div>
    </Card>
  );
}
