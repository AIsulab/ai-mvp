export default function StatCards({ weather }) {
  const stats = [
    { label: "현재 강수확률", value: weather?.rainProb || "--%", sub: "날씨 마케팅하기 좋은 날", icon: "💧" },
    { label: "기온", value: weather?.temperature || "--°C", sub: "체감 온도는 조금 더 낮아요", icon: "🌡️" },
    { label: "상권 유동인구", value: "19,280", unit: "명", sub: "평소 대비 4.2% 증가", icon: "👥" },
    { label: "오늘 마케팅 지수", value: "매우 좋음", color: "text-accent-orange", sub: "날씨 기반 AI 분석 결과", icon: "📈" },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-5 md:mb-6">
      {stats.map((s, i) => (
        <div key={i} className="bg-white rounded-[12px] border border-gray-100 shadow-card p-4 md:p-5 animate-slide-up hover:shadow-card-lift transition-all hover:-translate-y-0.5" style={{ animationDelay: `${i * 60}ms` }}>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg">{s.icon}</span>
            <span className="text-xs text-gray-500 font-medium">{s.label}</span>
          </div>
          <div className={`text-xl md:text-2xl font-bold tracking-tight ${s.color || "text-gray-900"}`}>
            {s.value}
            {s.unit && <span className="text-xs font-normal text-gray-400 ml-1">{s.unit}</span>}
          </div>
          <div className="text-[10px] md:text-xs text-accent-green mt-2 font-medium">{s.sub}</div>
        </div>
      ))}
    </div>
  );
}
