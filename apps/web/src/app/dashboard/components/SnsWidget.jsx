import { FileText, Instagram, Facebook } from "lucide-react";

export default function SnsWidget({ snsTab, setSnsTab, snsEvent, setSnsEvent, onGenerate, isGenerating, result }) {
  const tabs = [
    { key: "인스타그램", icon: Instagram },
    { key: "블로그", icon: FileText },
    { key: "페이스북", icon: Facebook },
  ];

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-5">
      <h3 className="text-[15px] font-semibold text-gray-900 mb-3">SNS 콘텐츠 자동생성</h3>
      <div className="flex gap-2 mb-3">
        {tabs.map((tab) => (
          <button key={tab.key} onClick={() => setSnsTab(tab.key)}
            className={`px-3.5 py-2 rounded-lg text-[13px] font-medium border flex items-center gap-1.5 transition-all ${
              snsTab === tab.key
                ? "border-gray-900 bg-gray-900 text-white"
                : "border-gray-200 text-gray-600 hover:border-gray-300"
            }`}>
            <tab.icon size={12} /> {tab.key}
          </button>
        ))}
      </div>
      <input type="text" value={snsEvent} onChange={e => setSnsEvent(e.target.value)}
        placeholder="오늘의 이벤트/메뉴를 입력하세요"
        className="w-full border border-gray-200 rounded-lg px-4 py-3 text-[14px] text-gray-900 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200 focus:border-gray-900 mb-3 placeholder-gray-400" />
      <button onClick={onGenerate} disabled={isGenerating || !snsEvent}
        className="w-full bg-gray-900 text-white font-medium py-3 rounded-lg text-[14px] hover:bg-gray-800 transition-all disabled:opacity-50 mb-3 flex items-center justify-center gap-1.5">
        {isGenerating ? "생성 중..." : <><FileText size={13} /> SNS 문구 생성</>}
      </button>
      {result && (
        <div className="bg-gray-50 border border-gray-100 rounded-lg p-4">
          <p className="text-[13px] text-gray-600 mb-1.5 font-medium">생성된 콘텐츠</p>
          <p className="text-[14px] text-gray-800 whitespace-pre-wrap leading-relaxed">{result}</p>
        </div>
      )}
    </div>
  );
}
