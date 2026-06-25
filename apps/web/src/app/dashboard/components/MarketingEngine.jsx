import { Zap, Instagram, MessageSquare, FileText, Wind } from "lucide-react";
import { Card, Input, Button } from "../../../components/ui";

export default function MarketingEngine({ marketingResult }) {
  return (
    <Card className="flex-1">
      <div className="flex justify-between items-center mb-5 border-b border-gray-100 pb-4">
        <h3 className="text-base font-semibold text-gray-900 flex items-center gap-2">
          <Zap className="text-yellow-500 fill-yellow-500" size={18} /> 웨더-드리븐 마케팅 엔진
        </h3>
        <div className="flex items-center gap-2">
          <span className="text-[10px] bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full font-bold border border-orange-200 flex items-center gap-1">
            <span className="w-1 h-1 rounded-full bg-orange-500"></span> 핵심 기능
          </span>
          <span className="text-xs bg-primary text-white px-2.5 py-1 rounded-md font-medium">AI 생성</span>
        </div>
      </div>

      <div className="flex border-b border-gray-200 mb-4">
        <button className="px-4 py-2 border-b-2 border-primary text-sm font-semibold text-primary flex items-center gap-1.5">
          <Instagram size={14} /> 인스타그램
        </button>
        <button className="px-4 py-2 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:text-gray-700 flex items-center gap-1.5">
          <MessageSquare size={14} /> 카카오 알림톡
        </button>
        <button className="px-4 py-2 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:text-gray-700 flex items-center gap-1.5">
          <FileText size={14} className="text-green-500" /> 네이버 포스팅
        </button>
      </div>

      <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 mb-4">
        <div className="text-xs font-semibold text-gray-700 mb-2">자동 생성된 프롬프트 컨텍스트:</div>
        <p className="text-[11px] text-gray-500 leading-relaxed">
          날씨 분석 중 AI가 자동으로 상황을 판단하여 최적 마케팅 문구를 생성합니다.<br/>프롬프트를 직접 작성하실 필요가 없습니다.
        </p>
      </div>

      <label className="text-[11px] font-semibold text-primary flex items-center gap-1.5 mb-2">
        <span className="w-4 h-4 rounded bg-primary-light flex items-center justify-center text-[10px]">AI</span>
        AI 생성 마케팅 문구
      </label>
      <div className="w-full min-h-[150px] bg-blue-50/50 border border-blue-100 rounded-xl p-4 text-sm text-gray-700 whitespace-pre-wrap leading-relaxed shadow-inner">
        {marketingResult ? marketingResult : <span className="text-gray-400">날씨 분석 시작 버튼을 누르면 AI가 자동으로 문구를 작성합니다.</span>}
      </div>
    </Card>
  );
}
