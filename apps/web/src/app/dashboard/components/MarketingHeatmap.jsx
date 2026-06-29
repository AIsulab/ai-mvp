const hourlyData = [
  { hour: "06", score: 20 },
  { hour: "07", score: 35 },
  { hour: "08", score: 55 },
  { hour: "09", score: 70 },
  { hour: "10", score: 85 },
  { hour: "11", score: 95 },
  { hour: "12", score: 100 },
  { hour: "13", score: 90 },
  { hour: "14", score: 75 },
  { hour: "15", score: 65 },
  { hour: "16", score: 70 },
  { hour: "17", score: 85 },
  { hour: "18", score: 95 },
  { hour: "19", score: 90 },
  { hour: "20", score: 70 },
  { hour: "21", score: 45 },
];

const getHeatColor = (score) => {
  if (score >= 90) return 'bg-orange-500';
  if (score >= 70) return 'bg-orange-400';
  if (score >= 50) return 'bg-orange-300';
  return 'bg-orange-100';
};

export default function MarketingHeatmap() {
  return (
    <div>
      <h3 className="text-[13px] font-semibold text-gray-900 mb-3">시간대별 마케팅 지수</h3>
      <div className="grid grid-cols-8 gap-1 mb-1">
        {hourlyData.slice(0, 8).map((d, i) => (
          <div key={i} className="text-center">
            <div className={`w-full h-5 rounded ${getHeatColor(d.score)} flex items-center justify-center`}>
              <span className={`text-[8px] font-bold ${d.score >= 70 ? 'text-white' : 'text-orange-600'}`}>{d.score}</span>
            </div>
            <span className="text-[8px] text-gray-400 block mt-0.5">{d.hour}</span>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-8 gap-1">
        {hourlyData.slice(8, 16).map((d, i) => (
          <div key={i} className="text-center">
            <div className={`w-full h-5 rounded ${getHeatColor(d.score)} flex items-center justify-center`}>
              <span className={`text-[8px] font-bold ${d.score >= 70 ? 'text-white' : 'text-orange-600'}`}>{d.score}</span>
            </div>
            <span className="text-[8px] text-gray-400 block mt-0.5">{d.hour}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
