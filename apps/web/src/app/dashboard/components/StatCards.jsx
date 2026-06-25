export default function StatCards({ weather }) {
  const stats = [
    { label: "현재 강수확률", value: weather?.rainProb || "--%", sub: "날씨 마케팅하기 좋은 날" },
    { label: "기온", value: weather?.temperature || "--°C", sub: "체감 온도는 조금 더 낮아요" },
    { label: "상권 유동인구", value: "19,280", unit: "명", sub: "평소 대비 4.2% 증가" },
    { label: "오늘 마케팅 지수", value: "매우 좋음", color: "text-accent", sub: "날씨 기반 AI 분석 결과" },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      {stats.map((s, i) => (
        <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 animate-slide-up" style={{ animationDelay: `${i * 50}ms` }}>
          <div className="text-xs text-gray-500 font-medium mb-2">{s.label}</div>
          <div className={`text-2xl font-bold ${s.color || "text-gray-900"}`}>
            {s.value}
            {s.unit && <span className="text-sm font-normal text-gray-500 ml-1">{s.unit}</span>}
          </div>
          <div className="text-xs text-green-500 mt-2 font-medium">{s.sub}</div>
        </div>
      ))}
    </div>
  );
}
