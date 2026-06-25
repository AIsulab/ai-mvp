import { useState } from "react";
import { MapPin, TrendingUp, Users, AlertCircle, Info } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";

const regions = [
  "전주시 완산구",
  "전주시 덕진구",
  "군산시",
  "익산시",
  "정읍시",
  "남원시",
  "김제시",
];
const categories = ["외식업", "서비스업", "도소매업", "교육/학원", "기타"];

const mockPopulationData = [
  { time: "06-09", count: 1200 },
  { time: "09-12", count: 3500 },
  { time: "12-15", count: 4200 },
  { time: "15-18", count: 3800 },
  { time: "18-21", count: 5100 },
  { time: "21-24", count: 2100 },
];

const mockSalesData = [
  { month: "1월", amount: 2100 },
  { month: "2월", amount: 1950 },
  { month: "3월", amount: 2400 },
  { month: "4월", amount: 2600 },
  { month: "5월", amount: 2800 },
  { month: "6월", amount: 3100 },
];

export default function MarketAnalysisPage() {
  const [region, setRegion] = useState(regions[0]);
  const [category, setCategory] = useState(categories[0]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showResult, setShowResult] = useState(false);

  const analyze = async () => {
    setIsAnalyzing(true);
    setShowResult(false);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setShowResult(true);
    setIsAnalyzing(false);
  };

  return (
    <div className="max-w-5xl mx-auto pb-10">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <h1 className="text-xl font-semibold text-gray-900 tracking-tight">
            상권 분석 리포트
          </h1>
          <span className="text-xs bg-green-50 text-green-700 px-2.5 py-1 rounded-full font-medium inline-flex items-center gap-1">
            <MapPin size={10} /> 전북 공공데이터
          </span>
        </div>
        <p className="text-sm text-gray-500">
          유동인구 및 카드 매출 데이터를 기반으로 지역별 상권 경쟁력과 트렌드를
          분석합니다.
        </p>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-5 mb-6 flex flex-col md:flex-row gap-4 items-end">
        <div className="flex-1 w-full">
          <label className="text-xs font-medium text-gray-500 mb-2 block">
            지역 선택
          </label>
          <select
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-900 focus-visible:ring-2 focus-visible:ring-blue-600 transition-colors"
          >
            {regions.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>
        <div className="flex-1 w-full">
          <label className="text-xs font-medium text-gray-500 mb-2 block">
            업종 선택
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-900 focus-visible:ring-2 focus-visible:ring-blue-600 transition-colors"
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <button
          onClick={analyze}
          disabled={isAnalyzing}
          className="w-full md:w-auto bg-[#2563EB] text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {isAnalyzing ? (
            <>
              <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              분석 중
            </>
          ) : (
            "리포트 생성"
          )}
        </button>
      </div>

      {showResult && (
        <div className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white border border-gray-200 rounded-xl p-5">
              <div className="flex items-center gap-2 text-gray-500 mb-2">
                <Users size={16} />
                <span className="text-sm font-medium">일평균 유동인구</span>
              </div>
              <div className="text-2xl font-semibold text-gray-900">
                19,280<span className="text-base font-normal text-gray-500 ml-1">명</span>
              </div>
              <div className="text-xs text-green-500 mt-2 flex items-center gap-1">
                <TrendingUp size={12} /> 전월 대비 4.2% 증가
              </div>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-5">
              <div className="flex items-center gap-2 text-gray-500 mb-2">
                <AlertCircle size={16} />
                <span className="text-sm font-medium">상권 경쟁 강도</span>
              </div>
              <div className="text-2xl font-semibold text-orange-500">높음</div>
              <div className="text-xs text-gray-500 mt-2">
                반경 1km 내 동일 업종 42개
              </div>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-5">
              <div className="flex items-center gap-2 text-gray-500 mb-2">
                <MapPin size={16} />
                <span className="text-sm font-medium">최대 매출 시간대</span>
              </div>
              <div className="text-2xl font-semibold text-blue-600">
                18:00 - 21:00
              </div>
              <div className="text-xs text-gray-500 mt-2">
                전체 매출의 41% 발생
              </div>
            </div>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white border border-gray-200 rounded-xl p-5">
              <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-1.5">
                시간대별 유동인구 추이
                <Info size={14} className="text-gray-400" />
              </h3>
              <div className="h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={mockPopulationData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                    <XAxis
                      dataKey="time"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 12, fill: "#6b7280" }}
                      dy={10}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 12, fill: "#6b7280" }}
                    />
                    <RechartsTooltip
                      cursor={{ fill: "#f9fafb" }}
                      contentStyle={{ borderRadius: "8px", border: "1px solid #e5e7eb", boxShadow: "0 1px 2px 0 rgb(0 0 0 / 0.05)" }}
                    />
                    <Bar
                      dataKey="count"
                      fill="#3b82f6"
                      radius={[4, 4, 0, 0]}
                      maxBarSize={40}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-5">
              <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-1.5">
                월별 평균 매출 추이 (단위: 만원)
              </h3>
              <div className="h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={mockSalesData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                    <XAxis
                      dataKey="month"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 12, fill: "#6b7280" }}
                      dy={10}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 12, fill: "#6b7280" }}
                    />
                    <RechartsTooltip
                      contentStyle={{ borderRadius: "8px", border: "1px solid #e5e7eb", boxShadow: "0 1px 2px 0 rgb(0 0 0 / 0.05)" }}
                    />
                    <Line
                      type="monotone"
                      dataKey="amount"
                      stroke="#8b5cf6"
                      strokeWidth={3}
                      dot={{ r: 4, strokeWidth: 2 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* AI Insights */}
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-6">
            <h3 className="text-sm font-semibold text-blue-900 mb-3 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs">
                AI
              </span>
              경영 인사이트 요약
            </h3>
            <ul className="space-y-2.5">
              <li className="text-sm text-blue-800 flex items-start gap-2">
                <span className="mt-0.5">•</span>
                <span>
                  <strong>저녁 시간대 집중 공략:</strong> 18시~21시 사이에 유동인구와 매출이 집중됩니다. 이 시간대 한정 세트 메뉴나 이벤트를 기획해보세요.
                </span>
              </li>
              <li className="text-sm text-blue-800 flex items-start gap-2">
                <span className="mt-0.5">•</span>
                <span>
                  <strong>경쟁 강도 주의:</strong> 주변에 동일 업종 매장이 42개로 경쟁이 치열합니다. 차별화된 시그니처 메뉴나 특색 있는 서비스가 필요합니다.
                </span>
              </li>
              <li className="text-sm text-blue-800 flex items-start gap-2">
                <span className="mt-0.5">•</span>
                <span>
                  <strong>매출 상승세 유지:</strong> 3월부터 매출이 꾸준히 상승하고 있습니다. 다가오는 여름 시즌을 대비해 시원한 메뉴를 추가하는 것을 추천합니다.
                </span>
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
