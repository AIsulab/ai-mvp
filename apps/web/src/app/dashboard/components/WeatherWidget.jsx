import { Cloud, Thermometer, Droplets, Wind } from "lucide-react";

export default function WeatherWidget({ weather }) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-[13px] font-semibold text-gray-900 flex items-center gap-1.5">
          <Cloud size={14} className="text-gray-400" /> 날씨 현황
        </h3>
        <span className="text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">전주</span>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {[
          { icon: Thermometer, color: "text-orange-500", value: weather?.temperature, label: "기온" },
          { icon: Droplets, color: "text-blue-500", value: weather?.humidity, label: "습도" },
          { icon: Cloud, color: "text-gray-500", value: weather?.rainProb, label: "강수확률" },
          { icon: Wind, color: "text-gray-400", value: weather?.windSpeed, label: "풍속" },
        ].map((item, i) => (
          <div key={i} className="bg-gray-50 rounded-lg p-2.5 text-center">
            <item.icon size={13} className={`${item.color} mx-auto mb-1`} />
            <div className="text-[12px] font-semibold text-gray-900">{item.value || "--"}</div>
            <div className="text-[9px] text-gray-400">{item.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
