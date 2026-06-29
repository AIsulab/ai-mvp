import { TrendingUp, ArrowUp, ArrowDown } from "lucide-react";

const hourlyData = [
  { hour: "06", score: 20, label: "새벽" },
  { hour: "07", score: 35, label: "아침" },
  { hour: "08", score: 55, label: "출근" },
  { hour: "09", score: 70, label: "오전" },
  { hour: "10", score: 85, label: "오전" },
  { hour: "11", score: 95, label: "점심" },
  { hour: "12", score: 100, label: "점심" },
  { hour: "13", score: 90, label: "점심" },
  { hour: "14", score: 75, label: "오후" },
  { hour: "15", score: 65, label: "오후" },
  { hour: "16", score: 70, label: "오후" },
  { hour: "17", score: 85, label: "퇴근" },
  { hour: "18", score: 95, label: "저녁" },
  { hour: "19", score: 90, label: "저녁" },
  { hour: "20", score: 70, label: "저녁" },
  { hour: "21", score: 45, label: "밤" },
];

const getHeatColor = (score) => {
  if (score >= 90) return 'bg-accent-orange';
  if (score >= 70) return 'bg-accent-orange/60';
  if (score >= 50) return 'bg-accent-orange/30';
  return 'bg-accent-orange/10';
};

const getTextColor = (score) => {
  if (score >= 70) return 'text-white';
  return 'text-accent-orange';
};

export default function MarketingHeatmap() {
  const peakHour = hourlyData.reduce((max, d) => d.score > max.score ? d : max);
  const avgScore = Math.round(hourlyData.reduce((sum, d) => sum + d.score, 0) / hourlyData.length);

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-gray-900">시간대별 마케팅 지수</span>
          <span className="text-[10px] bg-accent-green-light text-accent-green px-2 py-0.5 rounded-full font-medium flex items-center gap-1">
            <ArrowUp size={8} /> 평균 {avgScore}점
          </span>
        </div>
        <span className="text-[10px] text-gray-400">오늘의 데이터</span>
      </div>

      <div className="grid grid-cols-8 gap-1 mb-2">
        {hourlyData.slice(0, 8).map((d, i) => (
          <div key={i} className="text-center">
            <div className={`w-full h-6 rounded-[4px] ${getHeatColor(d.score)} flex items-center justify-center`}>
              <span className={`text-[8px] font-bold ${getTextColor(d.score)}`}>{d.score}</span>
            </div>
            <span className="text-[8px] text-gray-400 mt-0.5 block">{d.hour}시</span>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-8 gap-1">
        {hourlyData.slice(8, 16).map((d, i) => (
          <div key={i} className="text-center">
            <div className={`w-full h-6 rounded-[4px] ${getHeatColor(d.score)} flex items-center justify-center`}>
              <span className={`text-[8px] font-bold ${getTextColor(d.score)}`}>{d.score}</span>
            </div>
            <span className="text-[8px] text-gray-400 mt-0.5 block">{d.hour}시</span>
          </div>
        ))}
      </div>

      <div className="mt-3 flex items-center justify-between text-[10px] text-gray-500">
        <span>피크 시간: <strong className="text-accent-orange">{peakHour.hour}시 ({peakHour.label})</strong></span>
        <span>지수 90점 이상 시 <strong className="text-accent-orange">집중 마케팅</strong> 권장</span>
      </div>
    </div>
  );
}
