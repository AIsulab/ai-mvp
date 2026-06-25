import { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { MapPin, TrendingUp, AlertCircle, BarChart2 } from "lucide-react";

const regions = [
  "전주시 완산구",
  "전주시 덕진구",
  "익산시",
  "군산시",
  "정읍시",
  "남원시",
  "김제시",
];
const businessTypes = [
  "카페",
  "식당/한식",
  "치킨/배달",
  "베이커리",
  "편의점",
  "미용실",
  "기타",
];

const FOOT_TRAFFIC = [
  { time: "09시", count: 1240 },
  { time: "11시", count: 2890 },
  { time: "13시", count: 4210 },
  { time: "15시", count: 3100 },
  { time: "17시", count: 3750 },
  { time: "19시", count: 4580 },
  { time: "21시", count: 2200 },
];

const MONTHLY_TREND = [
  { month: "1월", 매출: 4200, 방문자: 380 },
  { month: "2월", 매출: 3800, 방문자: 350 },
  { month: "3월", 매출: 5100, 방문자: 460 },
  { month: "4월", 매출: 5600, 방문자: 510 },
  { month: "5월", 매출: 6200, 방문자: 580 },
  { month: "6월", 매출: 5800, 방문자: 540 },
];

const COMPETITION = [
  { name: "카페", value: 28, color: "#2563EB" },
  { name: "식당", value: 35, color: "#EA580C" },
  { name: "치킨", value: 18, color: "#7C3AED" },
  { name: "편의점", value: 12, color: "#059669" },
  { name: "기타", value: 7, color: "#9CA3AF" },
];

const insights = [
  {
    emoji: "📈",
    title: "피크 타임",
    value: "오후 7시~9시",
    desc: "저녁 유동인구 가장 많음. 이 시간대 SNS 게시물 효과 극대화",
  },
  {
    emoji: "🏆",
    title: "추천 메뉴",
    value: "계절 한정 메뉴",
    desc: "6월 기준 냉면·빙수 검색량 전월 대비 340% 증가",
  },
  {
    emoji: "⚠️",
    title: "경쟁 포화도",
    value: "중간 수준",
    desc: "선택 업종의 동일 상권 내 유사 업체 수: 12개",
  },
  {
    emoji: "💡",
    title: "AI 제안",
    value: "배달 채널 확장",
    desc: "해당 지역 배달 주문 비율 67% — 오프라인 대비 효율 높음",
  },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-3 text-xs shadow-none">
        <p className="font-medium text-gray-900 mb-1">{label}</p>
        {payload.map((p, i) => (
          <p key={i} style={{ color: p.color }} className="text-gray-600">
            {p.name}: {p.value.toLocaleString()}
            {p.name === "매출" ? "만원" : "명"}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function MarketAnalysisPage() {
  const [region, setRegion] = useState(regions[0]);
  const [businessType, setBusinessType] = useState(businessTypes[0]);
  const [activeTab, setActiveTab] = useState("traffic");

  const tabs = [
    { key: "traffic", label: "유동인구 분석" },
    { key: "trend", label: "매출 트렌드" },
    { key: "competition", label: "경쟁 현황" },
    { key: "insight", label: "AI 인사이트" },
  ];

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <h1 className="text-xl font-semibold text-gray-900 tracking-tight">
            AI 상권 분석
          </h1>
          <span className="text-xs bg-green-50 text-green-700 px-2.5 py-1 rounded-full font-medium">
            전북 공공데이터
          </span>
        </div>
        <p className="text-sm text-gray-500">
          전북 소상공인 공공데이터를 기반으로 상권 현황과 경영 인사이트를
          제공합니다.
        </p>
      </div>

      {/* Filter */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 mb-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-medium text-gray-500 mb-2 block">
              지역 선택
            </label>
            <select
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 hover:border-gray-300 transition-colors bg-white"
            >
              {regions.map((r) => (
                <option key={r}>{r}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500 mb-2 block">
              업종 선택
            </label>
            <select
              value={businessType}
              onChange={(e) => setBusinessType(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 hover:border-gray-300 transition-colors bg-white"
            >
              {businessTypes.map((b) => (
                <option key={b}>{b}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="flex items-center gap-2 mt-3">
          <MapPin size={12} className="text-gray-400" />
          <span className="text-xs text-gray-500">
            {region} · {businessType} 상권 기준 분석 데이터
          </span>
          <span className="text-xs border border-gray-200 text-gray-400 px-2 py-0.5 rounded-full ml-auto">
            전북 공공데이터 기반
          </span>
        </div>
      </div>

      {/* Stats bar */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        {[
          {
            label: "상권 내 동업종",
            value: "12개",
            trend: "▲ 2",
            trendColor: "text-red-500",
          },
          {
            label: "월 평균 유동인구",
            value: "2.8만명",
            trend: "▲ 8%",
            trendColor: "text-green-600",
          },
          {
            label: "배달 주문 비율",
            value: "67%",
            trend: "▲ 5%p",
            trendColor: "text-blue-600",
          },
        ].map((s, i) => (
          <div
            key={i}
            className="bg-white border border-gray-200 rounded-xl p-4"
          >
            <div className="text-xs text-gray-500 mb-2">{s.label}</div>
            <div className="text-lg font-semibold text-gray-900">{s.value}</div>
            <div className={`text-xs font-medium mt-1 ${s.trendColor}`}>
              {s.trend} 전월대비
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="flex border-b border-gray-200 px-1 pt-1">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-3 text-sm transition-colors ${
                activeTab === tab.key
                  ? "text-gray-900 font-medium border-b-2 border-[#2563EB] -mb-[1px]"
                  : "text-gray-500 border-b-2 border-transparent hover:text-gray-700"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="p-6">
          {activeTab === "traffic" && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-gray-900">
                  시간대별 유동인구
                </h3>
                <span className="text-xs text-gray-400">오늘 기준 · 명</span>
              </div>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={FOOT_TRAFFIC} barSize={28}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#F3F4F6"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="time"
                    tick={{ fontSize: 11, fill: "#9CA3AF" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: "#9CA3AF" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar
                    dataKey="count"
                    name="유동인구"
                    fill="#2563EB"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
              <p className="text-xs text-gray-400 mt-3 flex items-center gap-1">
                <AlertCircle size={11} /> 전북 소상공인 공공데이터 기반 추정치
              </p>
            </div>
          )}

          {activeTab === "trend" && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-gray-900">
                  월별 매출 트렌드
                </h3>
                <span className="text-xs text-gray-400">
                  2025년 상반기 · 만원
                </span>
              </div>
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={MONTHLY_TREND}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#F3F4F6"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="month"
                    tick={{ fontSize: 11, fill: "#9CA3AF" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: "#9CA3AF" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Line
                    type="monotone"
                    dataKey="매출"
                    stroke="#2563EB"
                    strokeWidth={2}
                    dot={{ fill: "#2563EB", r: 4 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="방문자"
                    stroke="#EA580C"
                    strokeWidth={2}
                    dot={{ fill: "#EA580C", r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}

          {activeTab === "competition" && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-gray-900">
                  업종별 경쟁 현황
                </h3>
                <span className="text-xs text-gray-400">상권 내 비율 · %</span>
              </div>
              <div className="flex flex-col md:flex-row items-center gap-6">
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={COMPETITION}
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={85}
                      dataKey="value"
                      paddingAngle={2}
                    >
                      {COMPETITION.map((entry, i) => (
                        <Cell key={i} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(v) => `${v}%`} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="space-y-2 min-w-max">
                  {COMPETITION.map((c, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <div
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: c.color }}
                      ></div>
                      <span className="text-sm text-gray-700 w-14">
                        {c.name}
                      </span>
                      <span className="text-sm font-medium text-gray-900">
                        {c.value}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "insight" && (
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-4">
                AI 경영 인사이트
              </h3>
              <div className="space-y-3">
                {insights.map((ins, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200"
                  >
                    <span className="text-xl">{ins.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-medium text-gray-500">
                          {ins.title}
                        </span>
                        <span className="text-sm font-semibold text-gray-900">
                          {ins.value}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 leading-relaxed">
                        - {ins.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-400 mt-4 flex items-center gap-1">
                <AlertCircle size={11} /> 전북 소상공인 공공데이터 + AI 분석
                기반
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
