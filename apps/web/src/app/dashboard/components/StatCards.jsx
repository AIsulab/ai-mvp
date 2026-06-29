export default function StatCards({ weather }) {
  const stats = [
    { label: "강수확률", value: weather?.rainProb || "--%", icon: "💧" },
    { label: "기온", value: weather?.temperature || "--°C", icon: "🌡️" },
    { label: "유동인구", value: "19,280명", icon: "👥" },
    { label: "마케팅 지수", value: "매우 좋음", color: "text-orange-500", icon: "📈" },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {stats.map((s, i) => (
        <div key={i} className="bg-white rounded-xl border border-gray-100 p-3 hover:shadow-card transition-shadow">
          <div className="flex items-center gap-1.5 mb-2">
            <span className="text-[13px]">{s.icon}</span>
            <span className="text-[11px] text-gray-400">{s.label}</span>
          </div>
          <div className={`text-[16px] font-bold ${s.color || "text-gray-900"}`}>
            {s.value}
          </div>
        </div>
      ))}
    </div>
  );
}
