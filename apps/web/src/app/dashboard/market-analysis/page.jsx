import { useState, useEffect } from "react";
import { MapPin, TrendingUp, Users, AlertCircle, Info, Layers, Activity, CreditCard } from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, LineChart, Line
} from "recharts";
import { MapContainer, TileLayer, Circle, Tooltip, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const regions = {
  "전주시 완산구": [35.8135, 127.1458],
  "전주시 덕진구": [35.8453, 127.1278],
  "군산시": [35.9676, 126.7368],
  "익산시": [35.9482, 126.9577],
};
const categories = ["외식업", "서비스업", "도소매업", "교육/학원", "기타"];

const mockPopulationData = [
  { time: "06-09", count: 1200 }, { time: "09-12", count: 3500 },
  { time: "12-15", count: 4200 }, { time: "15-18", count: 3800 },
  { time: "18-21", count: 5100 }, { time: "21-24", count: 2100 },
];

const mockSalesData = [
  { month: "1월", amount: 2100 }, { month: "2월", amount: 1950 },
  { month: "3월", amount: 2400 }, { month: "4월", amount: 2600 },
  { month: "5월", amount: 2800 }, { month: "6월", amount: 3100 },
];

// 핫플레이스 시각화를 위한 Mock 좌표 생성기
const generateHotspots = (center, count, radius) => {
  return Array.from({ length: count }).map(() => ({
    lat: center[0] + (Math.random() - 0.5) * radius,
    lng: center[1] + (Math.random() - 0.5) * radius,
    intensity: Math.random() * 100,
  }));
};

function ChangeView({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, zoom, { duration: 1.5 });
  }, [center, zoom, map]);
  return null;
}

export default function MarketAnalysisPage() {
  const [regionName, setRegionName] = useState(Object.keys(regions)[0]);
  const [category, setCategory] = useState(categories[0]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showResult, setShowResult] = useState(false);
  
  // GIS Layer State
  const [activeLayer, setActiveLayer] = useState("population"); // 'population', 'sales', 'competition'
  const [hotspots, setHotspots] = useState([]);

  useEffect(() => {
    // 지역이 바뀔 때마다 랜덤 핫스팟 생성 (MVP용 시뮬레이션)
    const center = regions[regionName];
    setHotspots(generateHotspots(center, 30, 0.05));
  }, [regionName]);

  const analyze = async () => {
    setIsAnalyzing(true);
    setShowResult(false);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setShowResult(true);
    setIsAnalyzing(false);
  };

  const getLayerColor = () => {
    if (activeLayer === "population") return { color: "#ef4444", fillColor: "#ef4444" }; // Red
    if (activeLayer === "sales") return { color: "#3b82f6", fillColor: "#3b82f6" }; // Blue
    return { color: "#f97316", fillColor: "#f97316" }; // Orange
  };

  return (
    <div className="max-w-5xl mx-auto pb-10">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <h1 className="text-xl font-semibold text-gray-900 tracking-tight">
            상권 분석 리포트 (SGIS 연동)
          </h1>
          <span className="text-xs bg-green-50 text-green-700 px-2.5 py-1 rounded-full font-medium inline-flex items-center gap-1">
            <MapPin size={10} /> 전북 공공데이터
          </span>
        </div>
        <p className="text-sm text-gray-500">
          지도 기반의 핫플레이스 시각화와 유동인구, 매출 데이터를 결합해 상권 경쟁력을 분석합니다.
        </p>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-5 mb-6 flex flex-col md:flex-row gap-4 items-end shadow-sm">
        <div className="flex-1 w-full">
          <label className="text-xs font-medium text-gray-500 mb-2 block">
            지역 선택
          </label>
          <select
            value={regionName}
            onChange={(e) => setRegionName(e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-900 focus-visible:ring-2 focus-visible:ring-blue-600 outline-none"
          >
            {Object.keys(regions).map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </div>
        <div className="flex-1 w-full">
          <label className="text-xs font-medium text-gray-500 mb-2 block">
            업종 선택
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-900 focus-visible:ring-2 focus-visible:ring-blue-600 outline-none"
          >
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
        <button
          onClick={analyze}
          disabled={isAnalyzing}
          className="w-full md:w-auto bg-[#2563EB] text-white px-8 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {isAnalyzing ? (
            <><div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>분석 중</>
          ) : ("GIS 상권 분석")}
        </button>
      </div>

      {showResult && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          
          {/* GIS Map Section */}
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
            <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                <MapPin className="text-[#2563EB]" size={16} /> 
                {regionName} 핫플레이스 지도
              </h3>
              
              <div className="flex bg-gray-100 p-1 rounded-lg">
                <button
                  onClick={() => setActiveLayer("population")}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors flex items-center gap-1 ${activeLayer === "population" ? "bg-white text-red-600 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
                >
                  <Users size={14} /> 유동인구 핫스팟
                </button>
                <button
                  onClick={() => setActiveLayer("sales")}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors flex items-center gap-1 ${activeLayer === "sales" ? "bg-white text-blue-600 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
                >
                  <CreditCard size={14} /> 매출 핫스팟
                </button>
                <button
                  onClick={() => setActiveLayer("competition")}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors flex items-center gap-1 ${activeLayer === "competition" ? "bg-white text-orange-600 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
                >
                  <Activity size={14} /> 경쟁 심화구역
                </button>
              </div>
            </div>
            
            <div className="h-[400px] w-full bg-gray-100 relative z-0">
              <MapContainer 
                center={regions[regionName]} 
                zoom={14} 
                style={{ height: "100%", width: "100%", zIndex: 0 }}
                zoomControl={false}
              >
                <ChangeView center={regions[regionName]} zoom={14} />
                <TileLayer
                  url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                />
                
                {hotspots.map((spot, i) => (
                  <Circle
                    key={i}
                    center={[spot.lat, spot.lng]}
                    pathOptions={{
                      ...getLayerColor(),
                      fillOpacity: 0.4 + (spot.intensity / 200),
                      weight: 1
                    }}
                    radius={200 + (spot.intensity * 3)}
                  >
                    <Tooltip sticky>
                      <span className="font-semibold">{activeLayer === 'population' ? '일평균 유동인구' : activeLayer === 'sales' ? '월평균 매출' : '동일업종 밀집도'}</span>
                      <br/>
                      지수: {Math.round(spot.intensity)}점
                    </Tooltip>
                  </Circle>
                ))}
              </MapContainer>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
              <div className="flex items-center gap-2 text-gray-500 mb-2">
                <Users size={16} />
                <span className="text-sm font-medium">일평균 유동인구</span>
              </div>
              <div className="text-2xl font-semibold text-gray-900">
                19,280<span className="text-base font-normal text-gray-500 ml-1">명</span>
              </div>
              <div className="text-xs text-red-500 mt-2 flex items-center gap-1 font-medium">
                <TrendingUp size={12} /> 전월 대비 4.2% 증가
              </div>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
              <div className="flex items-center gap-2 text-gray-500 mb-2">
                <AlertCircle size={16} />
                <span className="text-sm font-medium">상권 경쟁 강도</span>
              </div>
              <div className="text-2xl font-semibold text-orange-500">높음</div>
              <div className="text-xs text-gray-500 mt-2 font-medium">
                지도상 <span className="text-orange-500 font-bold">오렌지색</span> 핫스팟 주의
              </div>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
              <div className="flex items-center gap-2 text-gray-500 mb-2">
                <Activity size={16} />
                <span className="text-sm font-medium">최대 매출 시간대</span>
              </div>
              <div className="text-2xl font-semibold text-blue-600">
                18:00 - 21:00
              </div>
              <div className="text-xs text-gray-500 mt-2 font-medium">
                전체 매출의 41% 발생
              </div>
            </div>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
              <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-1.5">
                시간대별 유동인구 추이
                <Info size={14} className="text-gray-400" />
              </h3>
              <div className="h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={mockPopulationData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                    <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#6b7280" }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#6b7280" }} />
                    <RechartsTooltip cursor={{ fill: "#f9fafb" }} contentStyle={{ borderRadius: "8px", border: "1px solid #e5e7eb", boxShadow: "0 1px 2px 0 rgb(0 0 0 / 0.05)" }} />
                    <Bar dataKey="count" fill="#ef4444" radius={[4, 4, 0, 0]} maxBarSize={40} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
              <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-1.5">
                월별 평균 매출 추이 (단위: 만원)
              </h3>
              <div className="h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={mockSalesData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#6b7280" }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#6b7280" }} />
                    <RechartsTooltip contentStyle={{ borderRadius: "8px", border: "1px solid #e5e7eb", boxShadow: "0 1px 2px 0 rgb(0 0 0 / 0.05)" }} />
                    <Line type="monotone" dataKey="amount" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4, strokeWidth: 2, fill: "#fff" }} activeDot={{ r: 6, fill: "#3b82f6" }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* AI Insights */}
          <div className="bg-blue-50/50 border border-blue-200 rounded-xl p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-100 rounded-full blur-3xl -mr-10 -mt-10"></div>
            <h3 className="text-sm font-bold text-blue-900 mb-4 flex items-center gap-2 relative z-10">
              <span className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs">
                AI
              </span>
              SGIS 핫플레이스 경영 인사이트
            </h3>
            <ul className="space-y-3 relative z-10">
              <li className="text-sm text-blue-900 flex items-start gap-2 bg-white/60 p-3 rounded-lg border border-blue-100/50">
                <span className="mt-0.5 font-bold text-blue-600">1.</span>
                <span>
                  <strong>저녁 시간대 집중 공략:</strong> 지도상 붉은색 유동인구 핫스팟이 18시~21시 사이에 활성화됩니다. 이 시간대 한정 세트 메뉴나 이벤트를 기획해보세요.
                </span>
              </li>
              <li className="text-sm text-blue-900 flex items-start gap-2 bg-white/60 p-3 rounded-lg border border-blue-100/50">
                <span className="mt-0.5 font-bold text-blue-600">2.</span>
                <span>
                  <strong>경쟁 구역 회피 마케팅:</strong> 오렌지색 경쟁 심화 구역에 위치해 있다면 배달 반경을 조금 더 넓히거나, 경쟁 매장과 차별화된 시그니처 메뉴 홍보가 시급합니다.
                </span>
              </li>
              <li className="text-sm text-blue-900 flex items-start gap-2 bg-white/60 p-3 rounded-lg border border-blue-100/50">
                <span className="mt-0.5 font-bold text-blue-600">3.</span>
                <span>
                  <strong>매출 핫스팟 분석:</strong> 파란색 매출 밀집 구역은 오피스 상권과 겹칩니다. 점심시간 직장인 타겟의 스피드 메뉴를 도입하는 것을 추천합니다.
                </span>
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
