import { useState } from "react";
import {
  Cloud,
  MapPin,
  MessageSquare,
  Zap,
  TrendingUp,
  Droplets,
  Wind,
  Thermometer,
  Instagram,
  Facebook,
  FileText,
  AlertCircle,
  Database,
  Building2,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";

const storeTypes = ["음식점", "카페", "뷰티/미용", "소매업", "기타"];
const regions = ["전주", "군산", "익산", "정읍", "남원", "김제"];


export default function DashboardPage() {
  // Store Info State
  const [storeInfo, setStoreInfo] = useState({
    type: "음식점",
    name: "전주 한옥마을 파전집",
    menu: "파전, 막걸리",
    region: "전주",
  });

  // Weather Query
  const { data: weather, isLoading: weatherLoading } = useQuery({
    queryKey: ["weather", storeInfo.region],
    queryFn: async () => {
      try {
        const res = await fetch("/api/weather");
        if (!res.ok) throw new Error();
        return res.json();
      } catch {
        return {
          condition: "흐림",
          emoji: "☁️",
          temperature: "22°C",
          humidity: "65%",
          windSpeed: "3.2m/s",
          rainProb: "40%",
          marketingTheme: "기분전환,특별 할인",
        };
      }
    },
    staleTime: 1000 * 60 * 30,
  });

  // Action States
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [marketingResult, setMarketingResult] = useState("");

  const [reviewInput, setReviewInput] = useState("");
  const [isReplying, setIsReplying] = useState(false);
  const [replyResult, setReplyResult] = useState("");

  const [snsTab, setSnsTab] = useState("인스타그램");
  const [snsEvent, setSnsEvent] = useState("");
  const [isSnsGenerating, setIsSnsGenerating] = useState(false);
  const [snsResult, setSnsResult] = useState("");

  // Handlers
  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    setMarketingResult("");
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "marketing", storeInfo, weather }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "API Error");
      setMarketingResult(data.result);
    } catch (err) {
      setMarketingResult("❌ AI 생성 중 오류가 발생했습니다.\n에러: " + err.message);
    }
    setIsAnalyzing(false);
  };

  const handleReviewReply = async () => {
    if (!reviewInput) return;
    setIsReplying(true);
    setReplyResult("");
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "review", reviewText: reviewInput }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "API Error");
      setReplyResult(data.result);
    } catch (err) {
      setReplyResult("❌ 답변 생성 중 오류가 발생했습니다.\n에러: " + err.message);
    }
    setIsReplying(false);
  };

  const handleSnsGenerate = async () => {
    if (!snsEvent) return;
    setIsSnsGenerating(true);
    setSnsResult("");
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "sns", snsTab, snsEvent, storeInfo }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "API Error");
      setSnsResult(data.result);
    } catch (err) {
      setSnsResult("❌ 콘텐츠 생성 중 오류가 발생했습니다.\n에러: " + err.message);
    }
    setIsSnsGenerating(false);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* 1. Hero Section (Dark Blue) */}
      <div className="bg-[#0B1B3D] text-white py-12 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex-1">
            <div className="inline-flex items-center gap-1.5 bg-yellow-500/20 text-yellow-400 px-3 py-1 rounded-full text-xs font-medium mb-4 border border-yellow-500/30">
              <span className="w-1.5 h-1.5 bg-yellow-400 rounded-full animate-pulse"></span>
              날씨가 돈이 됩니다
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4 leading-tight tracking-tight">
              사장님, 오늘 날씨에 맞는<br />
              <span className="text-yellow-400">마케팅 문구 준비하셨나요?</span>
            </h1>
            <p className="text-blue-200 text-sm mb-8 leading-relaxed max-w-lg">
              기상청 공공데이터 + 전북 유동인구 데이터 + AI를 결합해<br />
              프롬프트 없이도 클릭 한 번에 맞춤 마케팅을 자동 생성합니다.
            </p>
            <div className="flex gap-8">
              <div>
                <div className="text-2xl font-bold">470만</div>
                <div className="text-xs text-blue-300 mt-1">국내 소상공인</div>
              </div>
              <div>
                <div className="text-2xl font-bold">10%</div>
                <div className="text-xs text-blue-300 mt-1">AI 활용률</div>
              </div>
              <div>
                <div className="text-2xl font-bold">1~2시간</div>
                <div className="text-xs text-blue-300 mt-1">절감 가능 시간/일</div>
              </div>
            </div>
          </div>
          
          {/* Weather Widget */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 w-full md:w-64 text-center shadow-2xl">
            {weatherLoading ? (
              <div className="py-8 flex justify-center">
                <div className="w-8 h-8 border-4 border-white/30 border-t-yellow-400 rounded-full animate-spin"></div>
              </div>
            ) : (
              <>
                <div className="text-5xl mb-3">{weather?.emoji}</div>
                <div className="text-3xl font-bold mb-1">{weather?.temperature}</div>
                <div className="text-sm text-blue-200 mb-4">{weather?.condition}</div>
                <div className="text-xs font-medium text-yellow-400 bg-yellow-400/10 py-1.5 px-3 rounded-full inline-flex items-center gap-1.5">
                  <MapPin size={12} /> {storeInfo.region} / 전북
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-6xl mx-auto px-6 -mt-6">
        
        {/* 2. Store Info Input Form */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <h2 className="text-sm font-semibold text-gray-900">내 가게 정보</h2>
            <span className="text-xs text-gray-500">(한 번만 입력하세요)</span>
          </div>
          <div className="flex flex-col md:flex-row gap-4 items-end">
            <div className="flex-1 w-full">
              <label className="text-xs font-medium text-gray-500 mb-1.5 block">업종</label>
              <select 
                value={storeInfo.type}
                onChange={e => setStoreInfo({...storeInfo, type: e.target.value})}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-blue-500 bg-gray-50"
              >
                {storeTypes.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div className="flex-1 w-full">
              <label className="text-xs font-medium text-gray-500 mb-1.5 block">가게 이름</label>
              <input 
                type="text" 
                value={storeInfo.name}
                onChange={e => setStoreInfo({...storeInfo, name: e.target.value})}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-blue-500"
              />
            </div>
            <div className="flex-[1.5] w-full">
              <label className="text-xs font-medium text-gray-500 mb-1.5 block">주요 메뉴/상품</label>
              <input 
                type="text" 
                value={storeInfo.menu}
                onChange={e => setStoreInfo({...storeInfo, menu: e.target.value})}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-blue-500"
              />
            </div>
            <div className="flex-1 w-full">
              <label className="text-xs font-medium text-gray-500 mb-1.5 block">지역</label>
              <select 
                value={storeInfo.region}
                onChange={e => setStoreInfo({...storeInfo, region: e.target.value})}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-blue-500 bg-gray-50"
              >
                {regions.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
            <button 
              onClick={handleAnalyze}
              disabled={isAnalyzing}
              className="w-full md:w-auto whitespace-nowrap bg-orange-500 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-orange-600 transition-colors disabled:opacity-70 flex items-center justify-center gap-1.5"
            >
              {isAnalyzing ? "분석 중..." : <><Zap size={14} /> 날씨 분석 시작</>}
            </button>
          </div>
        </div>

        {/* 3. 4 Stat Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
            <div className="text-xs text-gray-500 font-medium mb-2">현재 강수확률</div>
            <div className="text-2xl font-bold text-gray-900">{weather?.rainProb || "--%"}</div>
            <div className="text-xs text-green-500 mt-2 font-medium">날씨 마케팅하기 좋은 날</div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
            <div className="text-xs text-gray-500 font-medium mb-2">기온</div>
            <div className="text-2xl font-bold text-gray-900">{weather?.temperature || "--°C"}</div>
            <div className="text-xs text-green-500 mt-2 font-medium">체감 온도는 조금 더 낮아요</div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
            <div className="text-xs text-gray-500 font-medium mb-2">상권 유동인구</div>
            <div className="text-2xl font-bold text-gray-900">19,280<span className="text-sm font-normal text-gray-500 ml-1">명</span></div>
            <div className="text-xs text-green-500 mt-2 font-medium">평소 대비 4.2% 증가</div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
            <div className="text-xs text-gray-500 font-medium mb-2">오늘 마케팅 지수</div>
            <div className="text-2xl font-bold text-orange-500">매우 좋음</div>
            <div className="text-xs text-gray-500 mt-2 font-medium">날씨 기반 AI 분석 결과</div>
          </div>
        </div>

        {/* 4. 2-column Grid Widgets */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">
          
          {/* Left Column (5/12) */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            
            {/* Weather Dashboard Widget */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex-1">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-base font-semibold text-gray-900 flex items-center gap-2">
                  <Cloud className="text-blue-500" size={18} /> 날씨 현황판
                </h3>
                <span className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded-md font-medium border border-blue-100">
                  대기중
                </span>
              </div>
              <div className="text-xs text-gray-400 mb-4 bg-gray-50 p-3 rounded-lg text-center border border-gray-100">
                날씨 분석 버튼을 눌러주세요
              </div>
              <div className="grid grid-cols-2 gap-3 mb-5">
                <div className="bg-gray-50 border border-gray-100 rounded-lg p-4 text-center">
                  <Thermometer size={20} className="text-red-400 mx-auto mb-2" />
                  <div className="text-sm font-semibold text-gray-800">{weather?.temperature || "--"}</div>
                  <div className="text-[10px] text-gray-500 mt-1">기온(℃)</div>
                </div>
                <div className="bg-gray-50 border border-gray-100 rounded-lg p-4 text-center">
                  <Droplets size={20} className="text-blue-500 mx-auto mb-2" />
                  <div className="text-sm font-semibold text-gray-800">{weather?.humidity || "--"}</div>
                  <div className="text-[10px] text-gray-500 mt-1">습도(%)</div>
                </div>
                <div className="bg-gray-50 border border-gray-100 rounded-lg p-4 text-center">
                  <Cloud size={20} className="text-orange-400 mx-auto mb-2" />
                  <div className="text-sm font-semibold text-gray-800">{weather?.rainProb || "--"}</div>
                  <div className="text-[10px] text-gray-500 mt-1">강수확률</div>
                </div>
                <div className="bg-gray-50 border border-gray-100 rounded-lg p-4 text-center">
                  <Wind size={20} className="text-gray-500 mx-auto mb-2" />
                  <div className="text-sm font-semibold text-gray-800">{weather?.windSpeed || "--"}</div>
                  <div className="text-[10px] text-gray-500 mt-1">풍속(m/s)</div>
                </div>
              </div>
              <div className="bg-yellow-50 border border-yellow-100 p-3 rounded-lg flex items-start gap-2">
                <AlertCircle size={14} className="text-yellow-600 shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-semibold text-yellow-800 mb-0.5">기상청 API</div>
                  <div className="text-[10px] text-yellow-700 leading-tight">기상청 단기예보 API (공공데이터포털) · 전북 빅데이터 허브 연동</div>
                </div>
              </div>
            </div>

            {/* Review Reply Widget */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex-1">
              <h3 className="text-base font-semibold text-gray-900 flex items-center gap-2 mb-4">
                <span className="text-yellow-500">⭐</span> 리뷰 답변 자동화
              </h3>
              <div className="mb-3">
                <label className="text-[11px] text-gray-500 mb-1.5 block font-medium">고객 리뷰를 붙여넣으세요</label>
                <textarea 
                  rows="3"
                  value={reviewInput}
                  onChange={e => setReviewInput(e.target.value)}
                  placeholder="예: 파전이 엄청 바삭하고 맛있었어요! 막걸리랑 잘 어울렸습니다. 다음에 또 올게요 😍"
                  className="w-full border border-gray-200 rounded-lg p-3 text-sm resize-none focus:border-blue-500 outline-none"
                ></textarea>
              </div>
              <div className="flex justify-end mb-4">
                <button 
                  onClick={handleReviewReply}
                  disabled={isReplying || !reviewInput}
                  className="bg-[#2563EB] text-white px-5 py-2 rounded-lg text-xs font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {isReplying ? "생성 중..." : "AI 답변 생성"}
                </button>
              </div>
              <div>
                <label className="text-[11px] text-gray-500 mb-1.5 block font-medium">AI 답변</label>
                <div className="w-full min-h-[80px] bg-blue-50/50 border border-blue-100 rounded-lg p-3 text-sm text-gray-700 whitespace-pre-wrap">
                  {replyResult ? replyResult : <span className="text-gray-400 text-xs">리뷰를 입력하고 AI 답변 생성 버튼을 누르세요.</span>}
                </div>
              </div>
            </div>

          </div>

          {/* Right Column (7/12) */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            
            {/* Weather Marketing Engine Widget */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex-1">
              <div className="flex justify-between items-center mb-5 border-b border-gray-100 pb-4">
                <h3 className="text-base font-semibold text-gray-900 flex items-center gap-2">
                  <Zap className="text-yellow-500 fill-yellow-500" size={18} /> 웨더-드리븐 마케팅 엔진
                </h3>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full font-bold border border-orange-200 flex items-center gap-1">
                    <span className="w-1 h-1 rounded-full bg-orange-500"></span> 핵심 기능
                  </span>
                  <span className="text-xs bg-blue-600 text-white px-2.5 py-1 rounded-md font-medium">AI 생성</span>
                </div>
              </div>
              
              <div className="flex border-b border-gray-200 mb-4">
                <button className="px-4 py-2 border-b-2 border-blue-600 text-sm font-semibold text-blue-600 flex items-center gap-1.5">
                  <Instagram size={14} /> 인스타그램
                </button>
                <button className="px-4 py-2 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:text-gray-700 flex items-center gap-1.5">
                  <MessageSquare size={14} /> 카카오 알림톡
                </button>
                <button className="px-4 py-2 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:text-gray-700 flex items-center gap-1.5">
                  <FileText size={14} className="text-green-500" /> 네이버 포스팅
                </button>
              </div>

              <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 mb-4">
                <div className="text-xs font-semibold text-gray-700 mb-2">자동 생성된 프롬프트 컨텍스트:</div>
                <p className="text-[11px] text-gray-500 leading-relaxed">
                  날씨 분석 중 AI가 자동으로 상황을 판단하여 최적 마케팅 문구를 생성합니다.<br/>프롬프트를 직접 작성하실 필요가 없습니다.
                </p>
              </div>

              <label className="text-[11px] font-semibold text-blue-600 flex items-center gap-1.5 mb-2">
                <span className="w-4 h-4 rounded bg-blue-100 flex items-center justify-center text-[10px]">AI</span>
                AI 생성 마케팅 문구
              </label>
              <div className="w-full min-h-[150px] bg-blue-50/50 border border-blue-100 rounded-xl p-4 text-sm text-gray-700 whitespace-pre-wrap leading-relaxed shadow-inner">
                {marketingResult ? marketingResult : <span className="text-gray-400">날씨 분석 시작 버튼을 누르면 AI가 자동으로 문구를 작성합니다.</span>}
              </div>
            </div>

            {/* SNS Content Generation Widget */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex-1">
              <h3 className="text-base font-semibold text-gray-900 flex items-center gap-2 mb-4">
                <FileText className="text-blue-500" size={18} /> SNS 콘텐츠 자동생성
              </h3>
              
              <div className="mb-4">
                <label className="text-[11px] text-gray-500 mb-1.5 block font-medium">플랫폼 선택</label>
                <div className="flex gap-2">
                  <button onClick={() => setSnsTab("인스타그램")} className={`px-4 py-1.5 rounded-full text-xs font-medium border flex items-center gap-1.5 transition-colors ${snsTab === "인스타그램" ? "border-blue-600 bg-blue-50 text-blue-700" : "border-gray-200 text-gray-600"}`}>
                    <Instagram size={12} /> 인스타그램
                  </button>
                  <button onClick={() => setSnsTab("블로그")} className={`px-4 py-1.5 rounded-full text-xs font-medium border flex items-center gap-1.5 transition-colors ${snsTab === "블로그" ? "border-blue-600 bg-blue-50 text-blue-700" : "border-gray-200 text-gray-600"}`}>
                    <FileText size={12} /> 블로그
                  </button>
                  <button onClick={() => setSnsTab("페이스북")} className={`px-4 py-1.5 rounded-full text-xs font-medium border flex items-center gap-1.5 transition-colors ${snsTab === "페이스북" ? "border-blue-600 bg-blue-50 text-blue-700" : "border-gray-200 text-gray-600"}`}>
                    <Facebook size={12} /> 페이스북
                  </button>
                </div>
              </div>

              <div className="mb-4">
                <label className="text-[11px] text-gray-500 mb-1.5 block font-medium">오늘의 특별사항</label>
                <input 
                  type="text"
                  value={snsEvent}
                  onChange={e => setSnsEvent(e.target.value)}
                  placeholder="예: 오늘 재료 한정 수량, 10% 할인 이벤트"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500 bg-gray-50 focus:bg-white transition-colors"
                />
              </div>

              <button 
                onClick={handleSnsGenerate}
                disabled={isSnsGenerating || !snsEvent}
                className="bg-[#2563EB] text-white px-5 py-2 rounded-lg text-xs font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-1.5 mb-4"
              >
                {isSnsGenerating ? "생성 중..." : <><FileText size={12} /> SNS 문구 생성</>}
              </button>

              <div>
                <label className="text-[11px] text-gray-500 mb-1.5 flex items-center gap-1 font-medium">
                  <Wind size={12} className="text-gray-400" /> 생성된 SNS 게시물
                </label>
                <div className="w-full min-h-[100px] bg-gray-50 border border-gray-100 rounded-lg p-3 text-sm text-gray-700 whitespace-pre-wrap">
                  {snsResult ? snsResult : <span className="text-gray-400 text-xs">플랫폼 선택 후 생성 버튼을 누르세요.</span>}
                </div>
              </div>

            </div>

          </div>
        </div>

        {/* 5. Footer Data Sources */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-10">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
              <Database className="text-gray-500" size={16} /> 전북 공공데이터 연동 현황
            </h3>
            <span className="text-[10px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded border border-blue-100">연동 완료</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="border border-gray-100 bg-gray-50/50 p-4 rounded-lg">
              <div className="flex items-center gap-1.5 mb-1">
                <span className="w-2 h-2 rounded-full bg-green-500"></span>
                <span className="text-xs font-bold text-gray-800">기상청 단기예보 API</span>
              </div>
              <p className="text-[10px] text-gray-500 leading-tight">전주/익산/군산 등 전북 주요도시 예보 1시간 단위 · 3시간 주기 자동 갱신</p>
            </div>
            <div className="border border-gray-100 bg-gray-50/50 p-4 rounded-lg">
              <div className="flex items-center gap-1.5 mb-1">
                <span className="w-2 h-2 rounded-full bg-green-500"></span>
                <span className="text-xs font-bold text-gray-800">전북 빅데이터 허브</span>
              </div>
              <p className="text-[10px] text-gray-500 leading-tight">전북 지역 상권 유동인구 데이터 · 업종별 매출 통계 분석</p>
            </div>
            <div className="border border-gray-100 bg-gray-50/50 p-4 rounded-lg">
              <div className="flex items-center gap-1.5 mb-1">
                <span className="w-2 h-2 rounded-full bg-green-500"></span>
                <span className="text-xs font-bold text-gray-800">소상공인 상권정보</span>
              </div>
              <p className="text-[10px] text-gray-500 leading-tight">소상공인시장진흥공단 API · 업종별 밀집도 트렌드 상권 기초 자료</p>
            </div>
            <div className="border border-gray-100 bg-gray-50/50 p-4 rounded-lg">
              <div className="flex items-center gap-1.5 mb-1">
                <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                <span className="text-xs font-bold text-gray-800">전북 소상공인 지원사업</span>
              </div>
              <p className="text-[10px] text-gray-500 leading-tight">전북특별자치도 · 업종/매출/창업연차 기반 지원금 자동 매칭</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
