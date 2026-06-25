import { useState, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { Cloud, Copy, Check, Zap, RefreshCw, AlertCircle } from "lucide-react";

const businessTypes = [
  "카페",
  "식당/한식",
  "치킨/배달",
  "편의점",
  "미용실",
  "세탁소",
  "빵집/베이커리",
  "피부관리",
  "헬스장",
  "기타",
];
const tones = [
  "친근하고 따뜻하게",
  "세련되고 프로페셔널하게",
  "유머러스하고 재미있게",
  "감성적이고 시적으로",
];

// Mock AI 생성 함수 (실제 배포시 API 연동으로 교체)
const generateMockMarketing = (weather, businessType, menuOrProduct, tone) => {
  const toneStyles = {
    "친근하고 따뜻하게": "따뜻하고 정감 있는",
    "세련되고 프로페셔널하게": "깔끔하고 세련된",
    "유머러스하고 재미있게": "재미있고 유쾌한",
    "감성적이고 시적으로": "감성적이고 아름다운",
  };
  const style = toneStyles[tone] || "따뜻한";
  const emoji = weather?.emoji || "☀️";
  const condition = weather?.condition || "맑은";

  return `1. ${emoji} 오늘 같은 ${condition} 날엔, ${menuOrProduct}(이)가 제격이죠! ${style} 한 끼로 하루를 완성하세요 ✨

2. ${condition} 날씨에 딱 맞는 ${businessType}의 자신작 ${menuOrProduct}! 사장님이 정성껏 준비했습니다. 지금 바로 만나보세요 🙌

3. "${condition}인 오늘, ${menuOrProduct} 한 입이면 기분까지 좋아집니다" — ${businessType} 사장님의 ${style} 추천 메뉴입니다 💛`;
};

export default function WeatherMarketingPage() {
  const [businessType, setBusinessType] = useState("");
  const [menuOrProduct, setMenuOrProduct] = useState("");
  const [tone, setTone] = useState(tones[0]);
  const [generated, setGenerated] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(null);
  const [error, setError] = useState(null);

  const {
    data: weather,
    isLoading: weatherLoading,
    refetch,
  } = useQuery({
    queryKey: ["weather"],
    queryFn: async () => {
      try {
        const res = await fetch("/api/weather");
        if (!res.ok) throw new Error("날씨 정보를 가져오지 못했습니다.");
        return res.json();
      } catch {
        // Fallback mock weather data
        return {
          condition: "맑음",
          emoji: "☀️",
          temperature: "24°C",
          humidity: "52%",
          windSpeed: "2.3m/s",
          marketingTheme: "상쾌함,활기,기분 좋은 하루",
          isMock: true,
        };
      }
    },
    staleTime: 1000 * 60 * 30,
  });

  const generate = async () => {
    if (!businessType || !menuOrProduct) {
      setError("업종과 메뉴/상품을 입력해주세요.");
      return;
    }
    setError(null);
    setIsGenerating(true);

    // Simulate AI generation delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const text = generateMockMarketing(weather, businessType, menuOrProduct, tone);
    setGenerated((prev) => [
      {
        text,
        time: new Date().toLocaleTimeString("ko-KR", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        weather: weather?.condition,
        emoji: weather?.emoji,
      },
      ...prev.slice(0, 4),
    ]);
    setIsGenerating(false);
  };

  const copyText = (text, idx) => {
    navigator.clipboard.writeText(text);
    setCopied(idx);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <h1 className="text-xl font-semibold text-gray-900 tracking-tight">
            날씨 마케팅 자동화
          </h1>
          <span className="text-xs bg-blue-50 text-blue-600 px-2.5 py-1 rounded-full font-medium inline-flex items-center gap-1">
            <Zap size={10} /> Weather-Driven Engine
          </span>
        </div>
        <p className="text-sm text-gray-500">
          기상청 실시간 날씨 데이터를 기반으로 업종에 맞는 마케팅 문구를 즉시
          생성합니다.
        </p>
      </div>

      {/* Weather Card */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 mb-5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-gray-900">
            현재 날씨 (전주)
          </h2>
          <button
            onClick={() => refetch()}
            className="text-xs text-gray-400 hover:text-gray-600 transition-colors inline-flex items-center gap-1"
          >
            <RefreshCw size={11} /> 새로고침
          </button>
        </div>
        {weatherLoading ? (
          <div className="flex items-center gap-2 py-2">
            <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-sm text-gray-400">
              날씨 정보 불러오는 중...
            </span>
          </div>
        ) : weather ? (
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-3xl">{weather.emoji}</span>
            <div>
              <div className="text-base font-semibold text-gray-900">
                {weather.condition}
              </div>
              <div className="text-xs text-gray-500">
                {weather.temperature} · 습도 {weather.humidity} · 풍속{" "}
                {weather.windSpeed}
              </div>
            </div>
            <div className="ml-auto flex flex-wrap gap-1.5">
              {(weather.marketingTheme || "").split(",").map((t, i) => (
                <span
                  key={i}
                  className="text-xs border border-gray-200 text-gray-600 px-2 py-0.5 rounded-full"
                >
                  {t.trim()}
                </span>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-sm text-red-500">
            <AlertCircle size={14} /> 날씨 정보를 불러오지 못했습니다.
          </div>
        )}
        {weather?.isMock && (
          <p className="text-xs text-orange-500 mt-2 flex items-center gap-1">
            <AlertCircle size={11} /> 기상청 API 키 미설정 — 샘플 데이터 표시 중
          </p>
        )}
      </div>

      {/* Form */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 mb-5">
        <h2 className="text-sm font-semibold text-gray-900 mb-4">
          내 가게 정보 입력
        </h2>
        <div className="space-y-4">
          <div>
            <label className="text-xs font-medium text-gray-500 mb-2 block">
              업종 선택
            </label>
            <div className="flex flex-wrap gap-2">
              {businessTypes.map((b) => (
                <button
                  key={b}
                  onClick={() => setBusinessType(b)}
                  className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                    businessType === b
                      ? "border-[#2563EB] bg-[#EFF6FF] text-[#2563EB] font-medium"
                      : "border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  {b}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500 mb-2 block">
              오늘의 메뉴 또는 상품
            </label>
            <input
              type="text"
              value={menuOrProduct}
              onChange={(e) => setMenuOrProduct(e.target.value)}
              placeholder="예: 육개장, 아메리카노, 여름 한정 팥빙수..."
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-0 hover:border-gray-300 transition-colors"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500 mb-2 block">
              문구 톤 선택
            </label>
            <div className="flex flex-wrap gap-2">
              {tones.map((t) => (
                <button
                  key={t}
                  onClick={() => setTone(t)}
                  className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                    tone === t
                      ? "border-[#2563EB] bg-[#EFF6FF] text-[#2563EB] font-medium"
                      : "border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        </div>

        {error && (
          <div className="mt-4 text-sm text-red-500 flex items-center gap-1.5">
            <AlertCircle size={14} /> {error}
          </div>
        )}

        <button
          onClick={generate}
          disabled={isGenerating || !businessType || !menuOrProduct}
          className="mt-5 w-full bg-[#2563EB] text-white py-3 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
        >
          {isGenerating ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>{" "}
              생성 중...
            </>
          ) : (
            <>
              <Zap size={15} /> 마케팅 문구 생성하기
            </>
          )}
        </button>
      </div>

      {/* Generated results */}
      {generated.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold text-gray-900 mb-3">
            생성된 마케팅 문구
          </h2>
          <div className="space-y-3">
            {generated.map((g, i) => (
              <div
                key={i}
                className="bg-white border border-gray-200 rounded-xl p-5 hover:border-gray-300 transition-colors"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs border border-gray-200 text-gray-600 px-2 py-0.5 rounded-full">
                      {g.emoji} {g.weather}
                    </span>
                    <span className="text-xs text-gray-400">{g.time}</span>
                  </div>
                  <button
                    onClick={() => copyText(g.text, i)}
                    className="text-xs text-gray-500 hover:text-gray-700 transition-colors inline-flex items-center gap-1 border border-gray-200 px-2.5 py-1 rounded-full hover:border-gray-300"
                  >
                    {copied === i ? (
                      <>
                        <Check size={11} className="text-green-500" /> 복사됨
                      </>
                    ) : (
                      <>
                        <Copy size={11} /> 복사
                      </>
                    )}
                  </button>
                </div>
                <pre className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
                  {g.text}
                </pre>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
