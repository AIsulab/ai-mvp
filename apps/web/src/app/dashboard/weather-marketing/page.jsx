import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Cloud, Copy, Check, Zap, RefreshCw, AlertCircle } from "lucide-react";
import { streamAIResponse } from "@/utils/ai";
import { Button, Card, Input, PillSelector, Spinner, Badge } from "../../../components/ui";
import { businessTypes, tones } from "../../../constants/businessTypes";

export default function WeatherMarketingPage() {
  const [businessType, setBusinessType] = useState("");
  const [menuOrProduct, setMenuOrProduct] = useState("");
  const [tone, setTone] = useState(tones[0]);
  const [generated, setGenerated] = useState([]);
  const [streaming, setStreaming] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(null);
  const [error, setError] = useState(null);

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

  const generate = async () => {
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

    try {
      let fullText = "";
      for await (const chunk of streamAIResponse([{ role: "system", content: systemPrompt }, { role: "user", content: userPrompt }])) {
        fullText += chunk;
        setStreaming(fullText);
      }
      setGenerated((prev) => [{ text: fullText, time: new Date().toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" }), weather: weather?.condition, emoji: weather?.emoji }, ...prev.slice(0, 4)]);
      setStreaming("");
    } catch (err) {
      setError("생성 중 오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setIsGenerating(false);
    }
  };

  const copyText = (text, idx) => { navigator.clipboard.writeText(text); setCopied(idx); setTimeout(() => setCopied(null), 2000); };

  return (
    <div className="animate-fade-in">
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
        {error && <div className="mt-3 md:mt-4 text-xs md:text-sm text-red-500 flex items-center gap-1.5"><AlertCircle size={13} /> {error}</div>}
        <Button variant="primary" className="w-full mt-4 md:mt-5" onClick={generate} disabled={isGenerating || !businessType || !menuOrProduct} loading={isGenerating}>
          <Zap size={14} /> 마케팅 문구 생성하기
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
    </div>
  );
}
