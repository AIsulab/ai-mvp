import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis,
  CartesianGrid, Tooltip
} from "recharts";
import {
  TrendingUp, Search, Sparkles, Copy, Check, AlertCircle,
  HelpCircle, ExternalLink, ArrowRight, Database, FileText,
  BarChart2, Globe, HeartHandshake, Zap
} from "lucide-react";
import { Button, Card, Input, Badge, Spinner } from "../../../components/ui";
import { businessTypes } from "../../../constants/businessTypes";
import { copyToClipboard } from "../../../utils/clipboard";
import SuccessToast, { useSuccessToast } from "../../../components/SuccessToast";

export default function KeywordInsightPage() {
  const navigate = useNavigate();
  const [businessType, setBusinessType] = useState("일식/초밥");
  const [keyword, setKeyword] = useState("전주 초밥 맛집");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const streamingTimerRef = useRef(null);
  
  // 수집 데이터 상태
  const [data, setData] = useState(null);
  
  // AI 로컬 스트리밍 타이핑 상태
  const [aiStreaming, setAiStreaming] = useState("");
  const [aiResult, setAiResult] = useState(null);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  
  // 복사 피드백 및 토스트
  const [copiedId, setCopiedId] = useState(null);
  const { toast, showError, showCopy } = useSuccessToast();

  // 최초 로딩 시 자동 1회 조회 및 언마운트 타이머 정리
  useEffect(() => {
    handleSearch();
    return () => {
      if (streamingTimerRef.current) clearInterval(streamingTimerRef.current);
    };
  }, []);

  const handleSearch = async () => {
    if (!keyword.trim()) {
      setError("키워드를 입력해주세요.");
      return;
    }
    setError(null);
    setLoading(true);
    setData(null);
    setAiResult(null);
    setAiStreaming("");

    try {
      const res = await fetch(`/api/keywords?query=${encodeURIComponent(keyword)}&businessType=${encodeURIComponent(businessType)}`);
      if (!res.ok) throw new Error("네이버 키워드 정보를 가져오지 못했습니다.");
      const json = await res.json();
      if (!json.success) throw new Error(json.error || "데이터 수집 실패");
      
      setData(json);
      setLoading(false);
      
      // 수집 완료된 데이터를 바탕으로 로컬 타이핑 스트리밍 효과 기동
      if (json.aiAnalysis) {
        simulateAiStreaming(json.aiAnalysis);
      }
    } catch (err) {
      const msg = err.message || "오류가 발생했습니다.";
      setError(msg);
      showError(msg);
      setLoading(false);
    }
  };

  // 로컬 타이핑 시뮬레이션 (사용자 경험 극대화)
  const simulateAiStreaming = (fullText) => {
    if (streamingTimerRef.current) clearInterval(streamingTimerRef.current);
    setIsGeneratingAI(true);
    setAiStreaming("");
    setAiResult(null);

    let i = 0;
    streamingTimerRef.current = setInterval(() => {
      if (i < fullText.length) {
        // 한 번에 2~3글자씩 타이핑하여 빠르게 출력
        const chunk = fullText.slice(0, i + 3);
        setAiStreaming(chunk);
        i += 3;
      } else {
        clearInterval(streamingTimerRef.current);
        streamingTimerRef.current = null;
        setAiResult(fullText);
        setAiStreaming("");
        setIsGeneratingAI(false);
      }
    }, 15);
  };

  // 블로그 수 기반 경쟁도 판단
  const getCompetitionLevel = (count) => {
    if (count < 10000) return { label: "매우 낮음", color: "green", pct: 15 };
    if (count < 50000) return { label: "낮음", color: "teal", pct: 40 };
    if (count < 150000) return { label: "보통", color: "orange", pct: 65 };
    return { label: "높음", color: "red", pct: 90 };
  };

  const copyText = (text, id) => {
    copyToClipboard(text).then(() => {
      setCopiedId(id);
      showCopy();
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  // 기존 탭 연동을 위한 Deep Link 핸들러
  const sendToMarketingTab = (text, targetPath) => {
    // 로컬 스토리지에 해당 추천 문구를 임시 보관
    localStorage.setItem("pending_marketing_text", text);
    // 해당 탭 화면으로 이동시킴
    navigate(targetPath);
  };

  // Recharts 커스텀 툴팁
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-2.5 rounded-lg shadow-md border border-gray-100 dark:border-gray-700 text-xs">
          <p className="font-semibold text-gray-500 mb-1">{payload[0].payload.date}</p>
          <p className="text-primary font-bold">검색 지수: {payload[0].value}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="px-5 md:px-8 py-4 md:py-6 animate-fade-in text-gray-900 dark:text-gray-100">
      
      {/* ── 헤더 영역 ── */}
      <div className="mb-4 md:mb-5">
        <div className="flex items-center gap-2 mb-1 flex-wrap">
          <h1 className="text-base md:text-lg font-semibold tracking-tight">키워드 인사이트</h1>
          <Badge color="blue">트렌드 분석</Badge>
        </div>
        <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400">
          지역명과 특정 키워드를 기반으로 최근 90일 검색량 트렌드와 경쟁도, AI 진단 보고서를 원클릭으로 제공받아 마케팅 기회를 포착하세요.
        </p>
      </div>

      {/* ── 인풋 섹션 ── */}
      <Card className="mb-4 md:mb-5">
        <div className="flex flex-col md:flex-row md:items-end gap-3 md:gap-4">
          <div className="flex-1">
            <label className="block text-xs font-semibold text-gray-450 dark:text-gray-500 mb-1.5">내 업종 선택</label>
            <select
              value={businessType}
              onChange={(e) => setBusinessType(e.target.value)}
              className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2.5 text-xs md:text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent hover:border-gray-300 dark:hover:border-gray-600 transition-colors"
            >
              {businessTypes.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
          
          <div className="flex-[2]">
            <Input
              label="분석할 키워드 입력"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="예: 전주 바베큐치킨, 익산 미용실, 군산 짬뽕..."
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
          </div>

          <Button
            variant="primary"
            className="w-full md:w-auto h-[40px] px-6 shrink-0"
            onClick={handleSearch}
            disabled={loading || isGeneratingAI}
            loading={loading}
          >
            <Search size={14} /> 분석하기
          </Button>
        </div>

        {error && (
          <div className="mt-3 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 flex items-start gap-2">
            <AlertCircle size={14} className="text-red-500 shrink-0 mt-0.5" />
            <p className="text-xs md:text-sm text-red-600 dark:text-red-400 flex-1">{error}</p>
          </div>
        )}
      </Card>

      {/* ── 데이터 뷰 ── */}
      {data && (
        <div className="space-y-4 md:space-y-5">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            
            {/* 1. 검색 트렌드 차트 카드 (2/3 너비) */}
            <Card className="lg:col-span-2 flex flex-col justify-between">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xs md:text-sm font-semibold flex items-center gap-1.5">
                  <TrendingUp size={14} className="text-blue-500" /> 최근 90일 검색량 추이
                </h3>
                <span className="text-[10px] text-gray-400 dark:text-gray-500 font-mono">NAVER DATALAB</span>
              </div>
              <div className="h-[220px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={data.trend} margin={{ top: 5, right: 10, left: -25, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.04)" />
                    <XAxis dataKey="date" tickLine={false} axisLine={false} style={{ fontSize: 9, fill: "#9ca3af" }} />
                    <YAxis tickLine={false} axisLine={false} style={{ fontSize: 9, fill: "#9ca3af" }} domain={[0, 100]} />
                    <Tooltip content={<CustomTooltip />} />
                    <Line type="monotone" dataKey="value" stroke="#6366f1" strokeWidth={2.5} dot={false} activeDot={{ r: 5, strokeWidth: 0 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Card>

            {/* 2. 경쟁도 지표 카드 (1/3 너비) */}
            <Card className="flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xs md:text-sm font-semibold flex items-center gap-1.5">
                    <BarChart2 size={14} className="text-purple-500" /> 블로그 경쟁도 진단
                  </h3>
                  <Badge color={getCompetitionLevel(data.blogCount).color}>
                    {getCompetitionLevel(data.blogCount).label}
                  </Badge>
                </div>

                <div className="mb-4">
                  <div className="text-2xl font-extrabold tracking-tight">
                    {data.blogCount.toLocaleString()}
                  </div>
                  <div className="text-[11px] text-gray-400 dark:text-gray-500 mt-1">블로그 누적 포스트 수</div>
                </div>

                {/* 게이지바 */}
                <div className="w-full h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden mb-3">
                  <div
                    className={`h-full transition-all duration-500 ${
                      getCompetitionLevel(data.blogCount).color === "green" ? "bg-green-500" :
                      getCompetitionLevel(data.blogCount).color === "teal" ? "bg-teal-500" :
                      getCompetitionLevel(data.blogCount).color === "orange" ? "bg-orange-500" : "bg-red-500"
                    }`}
                    style={{ width: `${getCompetitionLevel(data.blogCount).pct}%` }}
                  />
                </div>
              </div>

              <div className="p-2.5 bg-gray-50 dark:bg-gray-800/40 rounded-xl text-[10px] text-gray-500 dark:text-gray-400 leading-relaxed flex gap-1.5 items-start">
                <AlertCircle size={12} className="shrink-0 mt-0.5" />
                <span>
                  블로그 발행량이 많을수록 상위 노출 경쟁이 심합니다. 보통/낮음 수준일 때 롱테일 마케팅 시 상위 노출 기회가 대폭 늘어납니다.
                </span>
              </div>
            </Card>

          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            
            {/* 3. 검색 결과 분석 리스트 (2/3 너비) */}
            <Card className="lg:col-span-2">
              <h3 className="text-xs md:text-sm font-semibold mb-3 flex items-center gap-1.5">
                <Globe size={14} className="text-cyan-500" /> 주요 네이버 검색 상위 노출 현황
              </h3>
              <div className="space-y-2">
                {data.searchResults.map((item, idx) => (
                  <div key={idx} className="p-2.5 rounded-xl border border-gray-100 dark:border-gray-850 hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                    <a
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-bold text-gray-900 dark:text-white hover:text-primary transition-colors flex items-center gap-1 leading-snug"
                    >
                      {item.title} <ExternalLink size={10} className="text-gray-400 shrink-0" />
                    </a>
                    <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-1 line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                ))}
              </div>
            </Card>

            {/* 4. 연관 검색어 카드 (1/3 너비) */}
            <Card className="flex flex-col justify-between">
              <div>
                <h3 className="text-xs md:text-sm font-semibold mb-3 flex items-center gap-1.5">
                  <Database size={14} className="text-amber-500" /> 함께 찾는 연관 검색 키워드
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {data.relatedKeywords.map((tag, idx) => (
                    <span
                      key={idx}
                      onClick={() => { setKeyword(tag); handleSearch(); }}
                      className="text-[10px] md:text-xs bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 px-3 py-1.5 rounded-full border border-gray-100 dark:border-gray-700 cursor-pointer transition-all active:scale-[0.98]"
                    >
                      🔍 {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-gray-150 dark:border-gray-800 text-[9px] text-gray-400 text-center">
                태그를 클릭하면 해당 키워드로 즉시 재분석합니다.
              </div>
            </Card>

          </div>

          {/* ── AI 분석 결과 패널 (종합 진단 및 콘텐츠 추천) ── */}
          {(aiStreaming || aiResult) && (
            <Card className="border-indigo-500/20 bg-gradient-to-br from-indigo-50/10 to-transparent dark:from-indigo-950/5">
              <div className="flex items-center justify-between mb-4 border-b border-gray-100 dark:border-gray-800 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-indigo-500/10 flex items-center justify-center">
                    <Sparkles size={14} className="text-indigo-500 animate-pulse" />
                  </div>
                  <div>
                    <h3 className="text-xs md:text-sm font-bold text-gray-900 dark:text-white">AI 종합 진단 및 콘텐츠 플래너</h3>
                    <p className="text-[9px] md:text-[10px] text-gray-400">데이터랩 수치에 특화된 OpenAI 인텔리전스 분석</p>
                  </div>
                </div>
                {aiResult && (
                  <Button variant="ghost" size="sm" onClick={() => copyText(aiResult, "ai")}>
                    {copiedId === "ai" ? <><Check size={10} className="text-green-500" /> 복사됨</> : <><Copy size={10} /> 리포트 전체 복사</>}
                  </Button>
                )}
              </div>

              {/* 분석 결과 텍스트 스트리밍/렌더러 */}
              <div className="text-xs md:text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
                {aiStreaming || aiResult}
              </div>

              {/* 퀵패스 연동 레이어 (로컬스토리지를 거쳐 대시보드 탭 연동) */}
              {aiResult && (
                <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-800 flex flex-col sm:flex-row gap-3 items-center justify-between">
                  <div className="flex items-center gap-1.5 text-[11px] text-gray-400">
                    <HeartHandshake size={14} className="text-gray-400 shrink-0" />
                    <span>추천받은 카피를 복사해 원하는 마케팅 도구 탭으로 즉시 가져가세요.</span>
                  </div>
                  <div className="flex gap-2 w-full sm:w-auto">
                    <button
                      onClick={() => sendToMarketingTab(`[키워드 마케팅: ${keyword}]\n${aiResult.split("---")[1] || aiResult}`, "/dashboard/weather-marketing")}
                      className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-2 bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-bold rounded-lg hover:bg-blue-500/15 transition-all active:scale-[0.98]"
                    >
                      <Zap size={11} /> 날씨 마케팅 연동 <ArrowRight size={10} />
                    </button>
                    <button
                      onClick={() => sendToMarketingTab(`[키워드 마케팅: ${keyword}]\n${aiResult.split("---")[2] || aiResult}`, "/dashboard/sns-content")}
                      className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-2 bg-purple-500/10 text-purple-600 dark:text-purple-400 text-xs font-bold rounded-lg hover:bg-purple-500/15 transition-all active:scale-[0.98]"
                    >
                      <Sparkles size={11} /> SNS 마케팅 연동 <ArrowRight size={10} />
                    </button>
                  </div>
                </div>
              )}
            </Card>
          )}

          {isGeneratingAI && (
            <Card className="border-indigo-500/20 text-center py-8">
              <Spinner className="text-indigo-500 mx-auto mb-2" />
              <p className="text-xs text-gray-500 dark:text-gray-400 animate-pulse">
                수집된 빅데이터를 정밀 종합 분석하여 맞춤 마케팅 전략을 도출하는 중입니다...
              </p>
            </Card>
          )}

        </div>
      )}

      {loading && !data && (
        <Card className="p-12 text-center flex flex-col items-center justify-center">
          <Spinner className="text-primary mb-3" />
          <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 font-semibold animate-pulse">
            네이버 데이터랩 및 검색 트렌드를 수집하고 있습니다. 잠시만 기다려 주세요...
          </p>
        </Card>
      )}

      <SuccessToast toast={toast} onClose={() => {}} />
    </div>
  );
}
