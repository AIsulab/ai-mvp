import { Cloud, Thermometer, Droplets, Wind, AlertCircle } from "lucide-react";
import { Card } from "../../../components/ui";

export default function WeatherWidget({ weather }) {
  return (
    <Card className="flex-1">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-base font-semibold text-gray-900 flex items-center gap-2">
          <Cloud className="text-blue-500" size={18} /> 날씨 현황판
        </h3>
        <span className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded-md font-medium border border-blue-100">
          대기중
        </span>
      </div>
      <div className="text-xs text-gray-400 mb-4 bg-gray-50 p-3 rounded-lg text-center border border-gray-100">
        날씨 분석 버튼을 눌러주세요
      </div>
      <div className="grid grid-cols-2 gap-3 mb-5">
        <div className="bg-gray-50 border border-gray-100 rounded-lg p-4 text-center">
          <Thermometer size={20} className="text-red-400 mx-auto mb-2" />
          <div className="text-sm font-semibold text-gray-800">{weather?.temperature || "--"}</div>
          <div className="text-[10px] text-gray-500 mt-1">기온(℃)</div>
        </div>
        <div className="bg-gray-50 border border-gray-100 rounded-lg p-4 text-center">
          <Droplets size={20} className="text-blue-500 mx-auto mb-2" />
          <div className="text-sm font-semibold text-gray-800">{weather?.humidity || "--"}</div>
          <div className="text-[10px] text-gray-500 mt-1">습도(%)</div>
        </div>
        <div className="bg-gray-50 border border-gray-100 rounded-lg p-4 text-center">
          <Cloud size={20} className="text-orange-400 mx-auto mb-2" />
          <div className="text-sm font-semibold text-gray-800">{weather?.rainProb || "--"}</div>
          <div className="text-[10px] text-gray-500 mt-1">강수확률</div>
        </div>
        <div className="bg-gray-50 border border-gray-100 rounded-lg p-4 text-center">
          <Wind size={20} className="text-gray-500 mx-auto mb-2" />
          <div className="text-sm font-semibold text-gray-800">{weather?.windSpeed || "--"}</div>
          <div className="text-[10px] text-gray-500 mt-1">풍속(m/s)</div>
        </div>
      </div>
      <div className="bg-yellow-50 border border-yellow-100 p-3 rounded-lg flex items-start gap-2">
        <AlertCircle size={14} className="text-yellow-600 shrink-0 mt-0.5" />
        <div>
          <div className="text-xs font-semibold text-yellow-800 mb-0.5">기상청 API</div>
          <div className="text-[10px] text-yellow-700 leading-tight">기상청 단기예보 API (공공데이터포털) · 전북 빅데이터 허브 연동</div>
        </div>
      </div>
    </Card>
  );
}
