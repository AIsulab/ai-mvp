import { FileText, Instagram, Facebook } from "lucide-react";

export default function SnsWidget({ snsTab, setSnsTab, snsEvent, setSnsEvent, onGenerate, isGenerating, result }) {
  const tabs = [
    { key: "인스타그램", icon: Instagram },
    { key: "블로그", icon: FileText },
    { key: "페이스북", icon: Facebook },
  ];

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-5">
      <h3 className="text-[14px] font-semibold text-gray-900 mb-3">SNS 콘텐츠 자동생성</h3>
      <div className="flex gap-2 mb-3">
        {tabs.map((tab) => (
          <button key={tab.key} onClick={() => setSnsTab(tab.key)}
            className={`px-3 py-1.5 rounded-lg text-[12px] font-medium border flex items-center gap-1 transition-all ${
              snsTab === tab.key
                ? "border-gray-900 bg-gray-900 text-white"
                : "border-gray-200 text-gray-500 hover:border-gray-300"
            }`}>
            <tab.icon size={11} /> {tab.key}
          </button>
        ))}
      </div>
      <input type="text" value={snsEvent} onChange={e => setSnsEvent(e.target.value)}
        placeholder="오늘의 이벤트/메뉴를 입력하세요"
        className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-[13px] text-gray-900 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200 mb-3 placeholder-gray-300" />
      <button onClick={onGenerate} disabled={isGenerating || !snsEvent}
        className="w-full bg-gray-900 text-white font-medium py-2.5 rounded-lg text-[13px] hover:bg-gray-800 transition-all disabled:opacity-50 mb-3 flex items-center justify-center gap-1.5">
        {isGenerating ? "생성 중..." : <><FileText size={12} /> SNS 문구 생성</>}
      </button>
      {result && (
        <div className="bg-gray-50 border border-gray-100 rounded-lg p-3">
          <p className="text-[12px] text-gray-500 mb-1.5 font-medium">생성된 콘텐츠</p>
          <p className="text-[13px] text-gray-700 whitespace-pre-wrap leading-relaxed">{result}</p>
        </div>
      )}
    </div>
  );
}
