import { Cloud, Thermometer, Droplets, Wind, AlertCircle } from "lucide-react";
import { Card } from "../../../components/ui";

export default function WeatherWidget({ weather }) {
  return (
    <Card className="flex-1">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2 tracking-tight">
          <Cloud className="text-primary" size={16} /> 날씨 현황판
        </h3>
        <span className="text-[10px] bg-accent-green-light text-accent-green px-2 py-1 rounded-[8px] font-medium">
          대기중
        </span>
      </div>
      <div className="text-xs text-gray-400 mb-4 bg-gray-50 p-3 rounded-[12px] text-center">
        날씨 분석 버튼을 눌러주세요
      </div>
      <div className="grid grid-cols-2 gap-2.5 mb-4">
        {[
          { icon: Thermometer, color: "text-coral", value: weather?.temperature, label: "기온(℃)" },
          { icon: Droplets, color: "text-primary", value: weather?.humidity, label: "습도(%)" },
          { icon: Cloud, color: "text-accent-orange", value: weather?.rainProb, label: "강수확률" },
          { icon: Wind, color: "text-gray-500", value: weather?.windSpeed, label: "풍속(m/s)" },
        ].map((item, i) => (
          <div key={i} className="bg-gray-50 rounded-[12px] p-3 text-center hover:bg-gray-100 transition-colors">
            <item.icon size={16} className={`${item.color} mx-auto mb-1.5`} />
            <div className="text-xs font-semibold text-gray-900 tracking-tight">{item.value || "--"}</div>
            <div className="text-[10px] text-gray-400 mt-0.5">{item.label}</div>
          </div>
        ))}
      </div>
      <div className="bg-primary-50 border border-primary-100 p-3 rounded-[12px] flex items-start gap-2">
        <AlertCircle size={13} className="text-primary shrink-0 mt-0.5" />
        <div>
          <div className="text-[10px] font-semibold text-primary mb-0.5">기상청 API</div>
          <div className="text-[10px] text-primary-600 leading-tight">기상청 단기예보 API · 전북 빅데이터 허브 연동</div>
        </div>
      </div>
    </Card>
  );
}
