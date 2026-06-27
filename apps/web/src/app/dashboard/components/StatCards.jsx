export default function StatCards({ weather }) {
  const stats = [
    { label: "현재 강수확률", value: weather?.rainProb || "--%", sub: "날씨 마케팅하기 좋은 날", icon: "💧" },
    { label: "기온", value: weather?.temperature || "--°C", sub: "체감 온도는 조금 더 낮아요", icon: "🌡️" },
    { label: "상권 유동인구", value: "19,280", unit: "명", sub: "평소 대비 4.2% 증가", icon: "👥" },
    { label: "오늘 마케팅 지수", value: "매우 좋음", color: "text-accent", sub: "날씨 기반 AI 분석 결과", icon: "📈" },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
      {stats.map((s, i) => (
        <div
          key={i}
          className="bg-white dark:bg-gray-800 rounded-xl p-5 animate-slide-up"
          style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.06)", animationDelay: `${i * 60}ms` }}
        >
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg">{s.icon}</span>
            <span className="text-xs text-[#6B7280] dark:text-gray-400 font-medium">{s.label}</span>
          </div>
          <div className={`text-2xl font-bold ${s.color || "text-[#111827] dark:text-white"}`}>
            {s.value}
            {s.unit && <span className="text-sm font-normal text-gray-400 ml-1">{s.unit}</span>}
          </div>
          <div className="text-xs text-green-500 mt-2 font-medium">{s.sub}</div>
        </div>
      ))}
    </div>
  );
}
