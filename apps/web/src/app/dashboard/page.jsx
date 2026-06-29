import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import HeroSection from "./components/HeroSection";
import StoreInfoForm from "./components/StoreInfoForm";
import StatCards from "./components/StatCards";
import WeatherWidget from "./components/WeatherWidget";
import ReviewWidget from "./components/ReviewWidget";
import MarketingEngine from "./components/MarketingEngine";
import SnsWidget from "./components/SnsWidget";
import DataSourceFooter from "./components/DataSourceFooter";
import WeatherChart from "./components/WeatherChart";
import MarketingHeatmap from "./components/MarketingHeatmap";

export default function DashboardPage() {
  const [storeInfo, setStoreInfo] = useState({
    type: "음식점",
    name: "전주 한옥마을 파전집",
    menu: "파전, 막걸리",
    region: "전주",
  });

  const { data: weather, isLoading: weatherLoading } = useQuery({
    queryKey: ["weather", storeInfo.region],
    queryFn: async () => {
      try {
        const res = await fetch("/api/weather");
        if (!res.ok) throw new Error();
        return res.json();
      } catch {
        return { condition: "흐림", emoji: "☁️", temperature: "22°C", humidity: "65%", windSpeed: "3.2m/s", rainProb: "40%", marketingTheme: "기분전환,특별 할인" };
      }
    },
    staleTime: 1000 * 60 * 30,
  });

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [marketingResult, setMarketingResult] = useState("");
  const [reviewInput, setReviewInput] = useState("");
  const [isReplying, setIsReplying] = useState(false);
  const [replyResult, setReplyResult] = useState("");
  const [snsTab, setSnsTab] = useState("인스타그램");
  const [snsEvent, setSnsEvent] = useState("");
  const [isSnsGenerating, setIsSnsGenerating] = useState(false);
  const [snsResult, setSnsResult] = useState("");

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    setMarketingResult("");
    try {
      const res = await fetch("/api/generate", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "marketing", storeInfo, weather }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setMarketingResult(data.result);
    } catch (err) { setMarketingResult("AI 생성 중 오류가 발생했습니다.\n에러: " + err.message); }
    setIsAnalyzing(false);
  };

  const handleReviewReply = async () => {
    if (!reviewInput) return;
    setIsReplying(true);
    setReplyResult("");
    try {
      const res = await fetch("/api/generate", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "review", reviewText: reviewInput }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setReplyResult(data.result);
    } catch (err) { setReplyResult("답변 생성 중 오류가 발생했습니다.\n에러: " + err.message); }
    setIsReplying(false);
  };

  const handleSnsGenerate = async () => {
    if (!snsEvent) return;
    setIsSnsGenerating(true);
    setSnsResult("");
    try {
      const res = await fetch("/api/generate", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "sns", snsTab, snsEvent, storeInfo }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setSnsResult(data.result);
    } catch (err) { setSnsResult("콘텐츠 생성 중 오류가 발생했습니다.\n에러: " + err.message); }
    setIsSnsGenerating(false);
  };

  return (
    <div className="min-h-screen">
      <HeroSection weather={weather} weatherLoading={weatherLoading} region={storeInfo.region} />

      <div className="px-4 md:px-6 py-4 md:py-6 space-y-4 md:space-y-5">
        <StoreInfoForm storeInfo={storeInfo} setStoreInfo={setStoreInfo} onAnalyze={handleAnalyze} isAnalyzing={isAnalyzing} />

        <StatCards weather={weather} />

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="bg-white rounded-xl border border-gray-100 p-4">
            <h3 className="text-[13px] font-semibold text-gray-900 mb-3">시간대별 기온/강수</h3>
            <WeatherChart />
          </div>
          <div className="bg-white rounded-xl border border-gray-100 p-4">
            <MarketingHeatmap />
          </div>
        </div>

        {/* Widgets */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          <div className="lg:col-span-5 flex flex-col gap-4">
            <WeatherWidget weather={weather} />
            <ReviewWidget reviewInput={reviewInput} setReviewInput={setReviewInput} onGenerate={handleReviewReply} isReplying={isReplying} result={replyResult} />
          </div>
          <div className="lg:col-span-7 flex flex-col gap-4">
            <MarketingEngine marketingResult={marketingResult} />
            <SnsWidget snsTab={snsTab} setSnsTab={setSnsTab} snsEvent={snsEvent} setSnsEvent={setSnsEvent} onGenerate={handleSnsGenerate} isGenerating={isSnsGenerating} result={snsResult} />
          </div>
        </div>

        <DataSourceFooter />
      </div>
    </div>
  );
}
