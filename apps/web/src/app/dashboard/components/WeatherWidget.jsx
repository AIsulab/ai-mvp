import { Cloud, Thermometer, Droplets, Wind, AlertCircle } from "lucide-react";

export default function WeatherWidget({ weather }) {
  return (
    <div
      className="bg-white dark:bg-gray-800 rounded-xl p-5 md:p-6 flex-1"
      style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-[15px] font-semibold text-[#111827] dark:text-white flex items-center gap-2">
          <Cloud className="text-blue-500" size={16} /> 날씨 현황판
        </h2>
        <span className="text-xs bg-[#EFF6FF] text-[#2563EB] dark:bg-blue-900/30 dark:text-blue-400 px-2.5 py-1 rounded-full font-medium">
          대기중
        </span>
      </div>

      <div className="text-xs text-gray-400 dark:text-gray-500 mb-4 bg-gray-50 dark:bg-gray-700/50 p-3 rounded-xl text-center">
        날씨 분석 버튼을 눌러주세요
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        {[
          { icon: Thermometer, color: "text-red-400", value: weather?.temperature, label: "기온(℃)" },
          { icon: Droplets, color: "text-blue-500", value: weather?.humidity, label: "습도(%)" },
          { icon: Cloud, color: "text-orange-400", value: weather?.rainProb, label: "강수확률" },
          { icon: Wind, color: "text-gray-500", value: weather?.windSpeed, label: "풍속(m/s)" },
        ].map((item, i) => (
          <div
            key={i}
            className="bg-[#F9FAFB] dark:bg-gray-700/50 rounded-xl p-3 text-center"
          >
            <item.icon size={16} className={`${item.color} mx-auto mb-2`} />
            <div className="text-sm font-semibold text-[#111827] dark:text-white">{item.value || "--"}</div>
            <div className="text-[10px] text-gray-500 dark:text-gray-400 mt-1">{item.label}</div>
          </div>
        ))}
      </div>

      <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-xl flex items-start gap-2">
        <AlertCircle size={13} className="text-yellow-600 dark:text-yellow-500 shrink-0 mt-0.5" />
        <div>
          <div className="text-xs font-semibold text-yellow-800 dark:text-yellow-400 mb-0.5">기상청 API</div>
          <div className="text-[10px] text-yellow-700 dark:text-yellow-500/80 leading-tight">기상청 단기예보 API (공공데이터포털) · 전북 빅데이터 허브 연동</div>
        </div>
      </div>
    </div>
  );
}
