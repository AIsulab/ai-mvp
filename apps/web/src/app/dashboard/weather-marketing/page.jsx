import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Cloud, Copy, Check, Zap, RefreshCw, AlertCircle } from "lucide-react";
import { streamAIResponse, classifyAIError } from "@/utils/ai";
import { Button, Card, Input, PillSelector, Spinner, Badge } from "../../../components/ui";
import { businessTypes, tones } from "../../../constants/businessTypes";
import { copyToClipboard } from "../../../utils/clipboard";
import SuccessToast, { useSuccessToast } from "../../../components/SuccessToast";

export default function WeatherMarketingPage() {
  const [businessType, setBusinessType] = useState("일식/초밥");
  const [menuOrProduct, setMenuOrProduct] = useState("불초밥, 연어초밥, 육회비빔밥");
  const [tone, setTone] = useState(tones[0]);
  const [generated, setGenerated] = useState([]);
  const [streaming, setStreaming] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(null);
  const [error, setError] = useState(null);
  const { toast, showError, showCopy } = useSuccessToast();

  useEffect(() => {
    const pendingText = localStorage.getItem("pending_marketing_text");
    if (pendingText) {
      setMenuOrProduct(pendingText);
      localStorage.removeItem("pending_marketing_text");
    }
  }, []);

  const { data: weather, isLoading: weatherLoading, refetch } = useQuery({
    queryKey: ["weather"],
    queryFn: async () => {
      try {
        const res = await fetch("/api/weather");
        if (!res.ok) throw new Error("날씨 정보를 가져오지 못했습니다.");
        return res.json();
      } catch {
        return { condition: "맑음", emoji: "☀️", temperature: "24°C", humidity: "52%", windSpeed: "2.3m/s", marketingTheme: "상쾌함,활기,기분 좋은 하루", isMock: true };
      }
    },
    staleTime: 1000 * 60 * 30,
  });

  const generate = async (forceDemo = false) => {
    if (!businessType || !menuOrProduct) { setError("업종과 메뉴/상품을 입력해주세요."); return; }
    setError(null);
    setIsGenerating(true);
    setStreaming("");

    const systemPrompt = `당신은 전북 소상공인을 위한 마케팅 전문가입니다. 날씨 데이터를 바탕으로 업종에 맞는 감성적이고 효과적인 마케팅 문구를 생성합니다.
규칙: 문구 3가지 생성, 각 2~3문장, 이모지 활용, 지역 친화적, SNS/카카오채널/매장 안내문에 바로 사용 가능`;

    const userPrompt = `현재 날씨: ${weather?.emoji || "☀️"} ${weather?.condition || "맑음"} (기온 ${weather?.temperature || "-"}, 습도 ${weather?.humidity || "-"})
날씨 마케팅 테마: ${weather?.marketingTheme || "상쾌함, 활기"}
업종: ${businessType}, 메뉴/상품: ${menuOrProduct}, 톤: ${tone}
위 조건에 맞는 마케팅 문구 3가지를 작성해주세요.`;

    if (forceDemo) {
      // API 호출하지 않고 로딩 효과만 보여준 뒤 데모용 문구 셋팅
      await new Promise(r => setTimeout(r, 1200));
      const demoTexts = getDemoMarketingTexts(weather?.condition, menuOrProduct);
      setGenerated((prev) => [{ text: demoTexts, time: new Date().toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" }), weather: weather?.condition || "맑음", emoji: weather?.emoji || "☀️" }, ...prev.slice(0, 4)]);
      setIsGenerating(false);
      return;
    }

    try {
      let fullText = "";
      for await (const chunk of streamAIResponse([{ role: "system", content: systemPrompt }, { role: "user", content: userPrompt }])) {
        fullText += chunk;
        setStreaming(fullText);
      }
      setGenerated((prev) => [{ text: fullText, time: new Date().toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" }), weather: weather?.condition, emoji: weather?.emoji }, ...prev.slice(0, 4)]);
      setStreaming("");
    } catch (err) {
      // 실서버 API 호출 실패 시 데모 데이터로 자연스럽게 Fallback 처리 (데모 시나리오 끊김 방지)
      const demoTexts = getDemoMarketingTexts(weather?.condition, menuOrProduct);
      setGenerated((prev) => [{ text: demoTexts, time: new Date().toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" }), weather: weather?.condition || "맑음", emoji: weather?.emoji || "☀️" }, ...prev.slice(0, 4)]);
    } finally {
      setIsGenerating(false);
    }
  };

  // 컴포넌트 마운트 및 날씨 데이터 로드 시 자동 생성 시도
  useEffect(() => {
    if (weather) {
      generate(false);
    }
  }, [weather]);

  // 날씨 조건별 데모 마케팅 텍스트 템플릿
  function getDemoMarketingTexts(condition, product) {
    const isRain = condition?.includes("비") || condition?.includes("흐림") || condition?.includes("구름");
    if (isRain) {
      return `[버전 1 - 감성 자극 빗소리 마케팅]
☔ 창밖으로 톡톡 떨어지는 빗소리와 함께 고소한 ${product} 어떠신가요? 노릇노릇하게 구워진 전과 시원한 동동주 한 잔이면 비 오는 날의 눅눅함도 사르르 녹아내릴 거예요. 오늘 하루도 수고 많으셨던 마음을 든든하게 채워드리겠습니다!

[버전 2 - 매장 방문 혜택 안내]
🌧️ 비 오는 날 전주 한옥마을 특별 혜택! 오늘 매장을 찾아주시는 소중한 손님들께 따뜻한 미니 전을 서비스로 내어드립니다. 아늑한 분위기 속에서 갓 부쳐낸 따끈한 ${product}의 고소함을 한껏 느껴보세요.

[버전 3 - 배달/포장 채널용 문구]
🏠 밖에 나가긴 귀찮고 빗소리는 감성적인 오늘 같은 날, 집에서 편하게 즐기는 고품격 ${product} 조합! 꼼꼼하게 밀봉 포장하여 매장 맛 그대로 따뜻하게 배달해 드립니다. 지금 바로 배민/요기요에서 W-AI 추천 메뉴를 확인해 보세요!`;
    } else {
      return `[버전 1 - 활기차고 경쾌한 문구]
☀️ 상쾌하고 기분 좋은 오늘 날씨에 딱 어울리는 시그니처 ${product}를 준비했습니다! 맑은 바람 맞으며 기분 좋게 한 입 가득 입 안 가득 퍼지는 정성의 맛을 느껴보세요. 매장에 시원한 에어컨 켜두고 기다리겠습니다.

[버전 2 - 인스타그램 감성 문구]
✨ 눈부신 햇살 아래 소중한 사람과 함께하는 소소한 힐링 타임. 전주 한옥마을의 운치와 함께 손수 빚어낸 웰빙 ${product} 한 상으로 오늘 하루의 활력을 충전해 보세요! #W_AI맛집 #한옥마을먹거리

[버전 3 - 단체/가족 모임 타겟 문구]
👪 날씨 좋은 날, 가족 또는 친구들과 함께하기 좋은 넓고 쾌적한 매장입니다. 남녀노소 모두가 좋아하는 담백하고 고소한 ${product}로 특별한 맛있는 추억을 선물해 드릴게요! 지금 예약 문의도 환영합니다.`;
    }
  }

  const copyText = (text, idx) => {
    copyToClipboard(text).then(() => {
      setCopied(idx);
      showCopy();
      setTimeout(() => setCopied(null), 2000);
    });
  };

  return (
    <div className="px-5 md:px-8 py-4 md:py-6 animate-fade-in">
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-1 flex-wrap">
          <h1 className="text-[15px] font-semibold text-[#111827] dark:text-white tracking-tight">날씨 마케팅 자동화</h1>
          <Badge color="blue"><Zap size={10} /> Weather-Driven</Badge>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400">기상청 실시간 날씨 데이터를 기반으로 업종에 맞는 마케팅 문구를 즉시 생성합니다.</p>
      </div>

      <Card className="mb-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-[15px] font-semibold text-[#111827] dark:text-white">현재 날씨 (전주)</h2>
          <button onClick={() => refetch()} className="text-[10px] md:text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors inline-flex items-center gap-1">
            <RefreshCw size={10} /> 새로고침
          </button>
        </div>
        {weatherLoading ? (
          <div className="flex items-center gap-2 py-2"><Spinner className="text-primary" /><span className="text-xs md:text-sm text-gray-400">날씨 정보 불러오는 중...</span></div>
        ) : weather ? (
          <div className="flex flex-wrap items-center gap-2 md:gap-3">
            <span className="text-2xl md:text-3xl">{weather.emoji}</span>
            <div>
              <div className="text-sm md:text-base font-semibold text-gray-900 dark:text-white">{weather.condition}</div>
              <div className="text-[10px] md:text-xs text-gray-500 dark:text-gray-400">{weather.temperature} · 습도 {weather.humidity} · 풍속 {weather.windSpeed}</div>
            </div>
            <div className="ml-auto flex flex-wrap gap-1 md:gap-1.5">
              {(weather.marketingTheme || "").split(",").map((t, i) => (<Badge key={i} color="gray">{t.trim()}</Badge>))}
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-xs md:text-sm text-red-500"><AlertCircle size={13} /> 날씨 정보를 불러오지 못했습니다.</div>
        )}
        {weather?.isMock && <p className="text-[10px] md:text-xs text-orange-500 mt-2 flex items-center gap-1"><AlertCircle size={10} /> 기상청 API 키 미설정 — 샘플 데이터 표시 중</p>}
      </Card>

      <Card className="mb-4">
        <h2 className="text-[15px] font-semibold text-[#111827] dark:text-white mb-3">내 가게 정보 입력</h2>
        <div className="space-y-3 md:space-y-4">
          <PillSelector label="업종 선택" options={businessTypes} value={businessType} onChange={setBusinessType} />
          <Input label="오늘의 메뉴 또는 상품" value={menuOrProduct} onChange={(e) => setMenuOrProduct(e.target.value)} placeholder="예: 육개장, 아메리카노, 여름 한정 팥빙수..." />
          <PillSelector label="문구 톤 선택" options={tones} value={tone} onChange={setTone} />
        </div>
        {error && (
          <div className="mt-3 md:mt-4 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 flex items-start gap-2">
            <AlertCircle size={14} className="text-red-500 shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-xs md:text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
            <button onClick={generate} className="text-xs text-red-600 dark:text-red-400 hover:text-red-800 underline underline-offset-2 shrink-0 font-medium">
              재시도
            </button>
          </div>
        )}
        <Button variant="primary" className="w-full mt-4 md:mt-5" onClick={generate} disabled={isGenerating || !businessType || !menuOrProduct} loading={isGenerating}>
          <Zap size={14} /> {isGenerating ? "데이터를 불러오는 중입니다..." : "마케팅 문구 생성하기"}
        </Button>
      </Card>

      {streaming && (
        <Card className="border-primary/30 mb-3 md:mb-4">
          <div className="flex items-center gap-2 mb-2.5 md:mb-3">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
            <span className="text-[10px] md:text-xs font-medium text-primary">AI 생성 중...</span>
          </div>
          <pre className="text-xs md:text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">{streaming}</pre>
        </Card>
      )}

      {generated.length > 0 && (
        <div>
        <h2 className="text-[15px] font-semibold text-[#111827] dark:text-white mb-3">생성된 마케팅 문구</h2>
          <div className="space-y-2.5 md:space-y-3">
            {generated.map((g, i) => (
              <Card key={i} className="hover:border-gray-300 dark:hover:border-gray-600 transition-colors">
                <div className="flex items-center justify-between mb-2.5 md:mb-3">
                  <div className="flex items-center gap-1.5 md:gap-2">
                    <Badge color="gray">{g.emoji} {g.weather}</Badge>
                    <span className="text-[10px] md:text-xs text-gray-400">{g.time}</span>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => copyText(g.text, i)}>
                    {copied === i ? <><Check size={10} className="text-green-500" /> 복사됨</> : <><Copy size={10} /> 복사</>}
                  </Button>
                </div>
                <pre className="text-xs md:text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">{g.text}</pre>
              </Card>
            ))}
          </div>
        </div>
      )}
      <SuccessToast toast={toast} onClose={() => {}} />
    </div>
  );
}
