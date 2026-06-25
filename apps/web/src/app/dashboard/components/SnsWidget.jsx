import { FileText, Instagram, Facebook, Wind } from "lucide-react";
import { Input, Button } from "../../../components/ui";

export default function SnsWidget({ snsTab, setSnsTab, snsEvent, setSnsEvent, onGenerate, isGenerating, result }) {
  const tabs = [
    { key: "인스타그램", icon: Instagram },
    { key: "블로그", icon: FileText },
    { key: "페이스북", icon: Facebook },
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex-1">
      <h3 className="text-base font-semibold text-gray-900 flex items-center gap-2 mb-4">
        <FileText className="text-blue-500" size={18} /> SNS 콘텐츠 자동생성
      </h3>

      <div className="mb-4">
        <label className="text-[11px] text-gray-500 mb-1.5 block font-medium">플랫폼 선택</label>
        <div className="flex gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setSnsTab(tab.key)}
              className={`px-4 py-1.5 rounded-full text-xs font-medium border flex items-center gap-1.5 transition-colors ${
                snsTab === tab.key
                  ? "border-primary bg-primary-light text-primary"
                  : "border-gray-200 text-gray-600"
              }`}
            >
              <tab.icon size={12} /> {tab.key}
            </button>
          ))}
        </div>
      </div>

      <Input
        label="오늘의 특별사항"
        value={snsEvent}
        onChange={e => setSnsEvent(e.target.value)}
        placeholder="예: 오늘 재료 한정 수량, 10% 할인 이벤트"
      />

      <div className="mt-4 mb-4">
        <Button
          variant="primary"
          size="sm"
          onClick={onGenerate}
          disabled={isGenerating || !snsEvent}
          loading={isGenerating}
        >
          <FileText size={12} /> SNS 문구 생성
        </Button>
      </div>

      <div>
        <label className="text-[11px] text-gray-500 mb-1.5 flex items-center gap-1 font-medium">
          <Wind size={12} className="text-gray-400" /> 생성된 SNS 게시물
        </label>
        <div className="w-full min-h-[100px] bg-gray-50 border border-gray-100 rounded-lg p-3 text-sm text-gray-700 whitespace-pre-wrap">
          {result ? result : <span className="text-gray-400 text-xs">플랫폼 선택 후 생성 버튼을 누르세요.</span>}
        </div>
      </div>
    </div>
  );
}
