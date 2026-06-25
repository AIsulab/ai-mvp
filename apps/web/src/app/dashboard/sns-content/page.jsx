import { useState } from "react";
import { Zap, Copy, Check, AlertCircle, Instagram } from "lucide-react";

const businessTypes = [
  "카페",
  "식당/한식",
  "치킨/배달",
  "베이커리",
  "편의점",
  "미용실",
  "옷가게",
  "기타",
];
const platforms = ["인스타그램", "카카오채널", "블로그", "스레드"];
const moods = [
  "따뜻하고 감성적",
  "트렌디하고 힙하게",
  "정보 전달 위주",
  "유머/친근하게",
];

const generateMockSns = (businessType, event, platform, mood) => {
  return `📝 본문:
오늘 ${businessType}에서 특별한 소식이 있어요! ✨
${event} 준비했습니다 🎉
${mood} 분위기로 여러분을 초대합니다. 
지금 바로 방문해주세요! 💕

#️⃣ 해시태그:
#${businessType.replace("/", "")} #전주맛집 #전북맛집 #오늘의메뉴 #${event.replace(/\s/g, "")} #맛스타그램 #먹스타그램 #전주카페 #전북소상공인 #소상공인응원 #${platform} #일상 #맛집추천 #전주일상

💡 스토리/릴스 아이디어:
${event} 준비 과정을 타임랩스로 촬영 → "오늘의 정성" 자막 추가 → 완성된 메뉴 클로즈업으로 마무리`;
};

export default function SnsContentPage() {
  const [businessType, setBusinessType] = useState("");
  const [event, setEvent] = useState("");
  const [platform, setPlatform] = useState(platforms[0]);
  const [mood, setMood] = useState(moods[0]);
  const [result, setResult] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(null);
  const [error, setError] = useState(null);

  const generate = async () => {
    if (!businessType || !event) {
      setError("업종과 오늘의 이벤트/메뉴를 입력해주세요.");
      return;
    }
    setError(null);
    setIsGenerating(true);
    setResult(null);

    await new Promise((resolve) => setTimeout(resolve, 1500));
    const text = generateMockSns(businessType, event, platform, mood);
    setResult(text);
    setIsGenerating(false);
  };

  const copy = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <h1 className="text-xl font-semibold text-gray-900 tracking-tight">
            SNS 콘텐츠 자동 생성
          </h1>
          <span className="text-xs bg-purple-50 text-purple-600 px-2.5 py-1 rounded-full font-medium">
            AI 자동화
          </span>
        </div>
        <p className="text-sm text-gray-500">
          업종과 오늘의 이벤트를 입력하면 AI가 SNS 게시글과 해시태그를 즉시
          완성합니다.
        </p>
      </div>

      {/* Form */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 mb-5">
        <h2 className="text-sm font-semibold text-gray-900 mb-4">
          콘텐츠 정보 입력
        </h2>
        <div className="space-y-4">
          <div>
            <label className="text-xs font-medium text-gray-500 mb-2 block">
              업종
            </label>
            <div className="flex flex-wrap gap-2">
              {businessTypes.map((b) => (
                <button
                  key={b}
                  onClick={() => setBusinessType(b)}
                  className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${businessType === b ? "border-[#2563EB] bg-[#EFF6FF] text-[#2563EB] font-medium" : "border-gray-200 text-gray-600 hover:border-gray-300"}`}
                >
                  {b}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500 mb-2 block">
              오늘의 메뉴 · 이벤트 · 할인
            </label>
            <input
              type="text"
              value={event}
              onChange={(e) => setEvent(e.target.value)}
              placeholder="예: 아메리카노 2+1 이벤트, 오늘의 신메뉴 갈비탕..."
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 hover:border-gray-300 transition-colors"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-gray-500 mb-2 block">
                플랫폼
              </label>
              <div className="flex flex-wrap gap-2">
                {platforms.map((p) => (
                  <button
                    key={p}
                    onClick={() => setPlatform(p)}
                    className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${platform === p ? "border-[#2563EB] bg-[#EFF6FF] text-[#2563EB] font-medium" : "border-gray-200 text-gray-600 hover:border-gray-300"}`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 mb-2 block">
                분위기
              </label>
              <div className="flex flex-wrap gap-2">
                {moods.map((m) => (
                  <button
                    key={m}
                    onClick={() => setMood(m)}
                    className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${mood === m ? "border-[#2563EB] bg-[#EFF6FF] text-[#2563EB] font-medium" : "border-gray-200 text-gray-600 hover:border-gray-300"}`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {error && (
          <div className="mt-3 text-sm text-red-500 flex items-center gap-1.5">
            <AlertCircle size={14} />
            {error}
          </div>
        )}

        <button
          onClick={generate}
          disabled={isGenerating || !businessType || !event}
          className="mt-5 w-full bg-[#2563EB] text-white py-3 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
        >
          {isGenerating ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>{" "}
              생성 중...
            </>
          ) : (
            <>
              <Instagram size={15} /> SNS 콘텐츠 생성하기
            </>
          )}
        </button>
      </div>

      {/* Output */}
      {result && (
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-semibold text-gray-900">
                생성된 콘텐츠
              </h2>
              <span className="text-xs border border-gray-200 text-gray-600 px-2 py-0.5 rounded-full">
                {platform}
              </span>
            </div>
            <button
              onClick={() => copy(result, "main")}
              className="text-xs text-gray-500 hover:text-gray-700 transition-colors inline-flex items-center gap-1 border border-gray-200 px-2.5 py-1 rounded-full hover:border-gray-300"
            >
              {copied === "main" ? (
                <>
                  <Check size={11} className="text-green-500" />
                  복사됨
                </>
              ) : (
                <>
                  <Copy size={11} />
                  전체 복사
                </>
              )}
            </button>
          </div>
          <pre className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
            {result}
          </pre>
        </div>
      )}
    </div>
  );
}
