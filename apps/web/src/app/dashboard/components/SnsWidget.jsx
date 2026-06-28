import { FileText, Instagram, Facebook, Wind } from "lucide-react";
import { Input, Button } from "../../../components/ui";

export default function SnsWidget({ snsTab, setSnsTab, snsEvent, setSnsEvent, onGenerate, isGenerating, result }) {
  const tabs = [
    { key: "인스타그램", icon: Instagram },
    { key: "블로그", icon: FileText },
    { key: "페이스북", icon: Facebook },
  ];

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-5 flex-1">
      <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2 mb-4">
        <FileText className="text-primary" size={16} /> SNS 콘텐츠 자동생성
      </h3>
      <div className="mb-4">
        <label className="text-[11px] text-gray-500 mb-1.5 block font-medium">플랫폼 선택</label>
        <div className="flex gap-1.5 md:gap-2 overflow-x-auto pb-1">
          {tabs.map((tab) => (
            <button key={tab.key} onClick={() => setSnsTab(tab.key)}
              className={`px-3 md:px-4 py-1.5 rounded-full text-xs font-medium border flex items-center gap-1.5 transition-all whitespace-nowrap ${
                snsTab === tab.key
                  ? "border-primary bg-primary-50 text-primary shadow-sm"
                  : "border-gray-200 text-gray-500 hover:border-gray-300"
              }`}>
              <tab.icon size={11} /> {tab.key}
            </button>
          ))}
        </div>
      </div>
      <Input label="오늘의 특별사항" value={snsEvent} onChange={e => setSnsEvent(e.target.value)} placeholder="예: 아메리카노 2+1 이벤트" />
      <div className="mt-3 md:mt-4 mb-3 md:mb-4">
        <Button variant="primary" size="sm" onClick={onGenerate} disabled={isGenerating || !snsEvent} loading={isGenerating}>
          <FileText size={12} /> SNS 문구 생성
        </Button>
      </div>
      <div>
        <label className="text-[11px] text-gray-500 mb-1.5 flex items-center gap-1 font-medium">
          <Wind size={11} className="text-gray-400" /> 생성된 SNS 게시물
        </label>
        <div className="w-full min-h-[80px] bg-gray-50 border border-gray-100 rounded-xl p-3 text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
          {result ? result : <span className="text-gray-400 text-xs">플랫폼 선택 후 생성 버튼을 누르세요.</span>}
        </div>
      </div>
    </div>
  );
}
