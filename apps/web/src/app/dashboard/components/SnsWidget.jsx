import { FileText, Instagram, Facebook, Wind } from "lucide-react";
import { Input, Button } from "../../../components/ui";

export default function SnsWidget({ snsTab, setSnsTab, snsEvent, setSnsEvent, onGenerate, isGenerating, result }) {
  const tabs = [
    { key: "인스타그램", icon: Instagram },
    { key: "블로그", icon: FileText },
    { key: "페이스북", icon: Facebook },
  ];

  return (
    <div
      className="bg-white dark:bg-gray-800 rounded-xl p-5 md:p-6 flex-1"
      style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}
    >
      <h2 className="text-[15px] font-semibold text-[#111827] dark:text-white flex items-center gap-2 mb-4">
        <FileText className="text-blue-500" size={16} /> SNS 콘텐츠 자동생성
      </h2>

      <div className="mb-4">
        <label className="text-xs text-gray-500 dark:text-gray-400 mb-2 block font-medium">플랫폼 선택</label>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setSnsTab(tab.key)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5 transition-all whitespace-nowrap ${
                snsTab === tab.key
                  ? "bg-[#EFF6FF] text-[#2563EB]"
                  : "bg-[#F3F4F6] text-[#4B5563] hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-400"
              }`}
            >
              <tab.icon size={11} /> {tab.key}
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

      <div className="mt-3 mb-4">
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
        <label className="text-xs text-gray-500 dark:text-gray-400 mb-2 flex items-center gap-1 font-medium">
          <Wind size={11} className="text-gray-400" /> 생성된 SNS 게시물
        </label>
        <div className="w-full min-h-[100px] bg-[#F9FAFB] dark:bg-gray-700/50 rounded-xl p-3 text-sm text-[#111827] dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
          {result ? result : <span className="text-gray-400 dark:text-gray-500 text-xs">플랫폼 선택 후 생성 버튼을 누르세요.</span>}
        </div>
      </div>
    </div>
  );
}
