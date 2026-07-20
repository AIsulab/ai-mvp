import { useState, useEffect, useRef, useCallback } from "react";
import { Wifi, MapPin, RefreshCw, Search, BarChart2, Map, AlertTriangle } from "lucide-react";
import { Card, Badge, Spinner, Button } from "../../../components/ui";
import { useTheme } from "../../../contexts/ThemeContext";
// SDK 로드/초기화는 useNaverMap 모듈의 공유 유틸을 재사용
import { loadNaverSDK, tryInitMap } from "../../../hooks/useNaverMap";

const NAVER_MAP_KEY = import.meta.env.VITE_NAVER_MAP_CLIENT_ID || "";
const SBIZ_GIS_URL = "https://bigdata.sbiz.or.kr/#/hotplace/gis";
const DEFAULT_CENTER = { lat: 35.8242238, lng: 127.1479532 };

function getInitialPosition() {
  if (typeof window === "undefined") return DEFAULT_CENTER;
  const params = new URLSearchParams(window.location.search);
  const lat = parseFloat(params.get("lat"));
  const lng = parseFloat(params.get("lng"));
  if (!isNaN(lat) && !isNaN(lng)) return { lat, lng };
  const saved = localStorage.getItem("mapCenter");
  if (saved) { try { return JSON.parse(saved); } catch {} }
  return DEFAULT_CENTER;
}

export default function MarketAnalysisPage() {
  const [activeTab, setActiveTab] = useState("naver");
  const [showStores, setShowStores] = useState(true);
  const [showWifi, setShowWifi] = useState(true);
  const [stores, setStores] = useState([]);
  const [wifis, setWifis] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapError, setMapError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [mapCenter, setMapCenter] = useState(getInitialPosition);
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const markersRef = useRef([]);
  const infoWindowsRef = useRef([]);
  const { isDark } = useTheme();

  // SDK 로드는 useNaverMap.js의 공유 싱글턴 사용 (중복 로드 방지)

  const initMap = useCallback(async (center) => {
    if (activeTab !== "naver") return;
    setMapError(null);

    try {
      // 공유 SDK 로더 사용 (콜백 방식 + 싱글턴)
      const naver = await loadNaverSDK();
      if (!mapContainerRef.current) return;

      // 이미 지도가 있으면 중심 이동만
      if (mapRef.current) {
        mapRef.current.setCenter(new naver.LatLng(center.lat, center.lng));
        return;
      }

      console.log("[NaverMap] Creating map at", center.lat, center.lng);

      // 재시도 로직 포함 초기화 (최대 3회, 500ms 간격)
      const map = await tryInitMap(
        mapContainerRef.current,
        naver,
        {
          center: new naver.LatLng(center.lat, center.lng),
          zoom: 14, scaleControl: true, logoControl: false, mapDataControl: false,
        },
        3,
        500
      );

      naver.Event.addListener(map, "idle", () => {
        const c = map.getCenter();
        const newCenter = { lat: c.lat(), lng: c.lng() };
        setMapCenter(newCenter);
        localStorage.setItem("mapCenter", JSON.stringify(newCenter));
      });

      mapRef.current = map;
      setMapLoaded(true);
      console.log("[NaverMap] Map initialized successfully ✓");
    } catch (e) {
      console.error("[NaverMap] Map init error:", e);
      setMapError(
        `지도 초기화 실패: ${e.message}\n네이버 콘솔에서 sulab.store 도메인이 등록됐는지 확인하세요.`
      );
    }
  }, [activeTab]);

  const clearMarkers = useCallback(() => {
    markersRef.current.forEach((m) => m.setMap(null));
    markersRef.current = [];
    infoWindowsRef.current.forEach((iw) => iw.close());
    infoWindowsRef.current = [];
  }, []);

  const renderMarkers = useCallback(() => {
    if (!mapRef.current || !window.naver) return;
    clearMarkers();
    const naver = window.naver;

    if (showStores) {
      stores.forEach((store) => {
        const lat = parseFloat(store.lat || store.y);
        const lng = parseFloat(store.lon || store.x);
        if (isNaN(lat) || isNaN(lng)) return;
        const marker = new naver.maps.Marker({
          position: new naver.maps.LatLng(lat, lng), map: mapRef.current,
          icon: { content: `<div style="background:#2563EB;width:28px;height:28px;border-radius:50%;border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.3);display:flex;align-items:center;justify-content:center;"><div style="width:8px;height:8px;background:white;border-radius:50%;"></div></div>`, size: new naver.maps.Size(28, 28), anchor: new naver.maps.Point(14, 14) },
        });
        const content = `<div style="padding:8px;min-width:180px;font-family:Inter,system-ui,sans-serif;"><strong style="display:block;font-size:14px;margin-bottom:4px;color:#111827;">${store.bizesNm}</strong><span style="font-size:11px;color:#2563EB;background:#EFF6FF;padding:2px 8px;border-radius:12px;">${store.indsSclsNm || store.indsMclsNm || "상가"}</span><p style="font-size:11px;color:#6B7280;margin-top:6px;margin-bottom:0;">${store.ldongNm || store.adongNm || ""}</p>${store.telno ? `<p style="font-size:11px;color:#9CA3AF;margin-top:4px;margin-bottom:0;">📞 ${store.telno}</p>` : ""}</div>`;
        const infoWindow = new naver.maps.InfoWindow({ content });
        naver.maps.Event.addListener(marker, "click", () => { infoWindowsRef.current.forEach((iw) => iw.close()); infoWindow.open(mapRef.current, marker); });
        markersRef.current.push(marker);
        infoWindowsRef.current.push(infoWindow);
      });
    }

    if (showWifi) {
      wifis.forEach((wifi) => {
        if (!wifi.lat || !wifi.lon) return;
        const marker = new naver.maps.Marker({
          position: new naver.maps.LatLng(wifi.lat, wifi.lon), map: mapRef.current,
          icon: { content: `<div style="background:#22C55E;width:28px;height:28px;border-radius:50%;border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.3);display:flex;align-items:center;justify-content:center;"><div style="width:8px;height:8px;background:white;border-radius:50%;"></div></div>`, size: new naver.maps.Size(28, 28), anchor: new naver.maps.Point(14, 14) },
        });
        const content = `<div style="padding:8px;min-width:180px;font-family:Inter,system-ui,sans-serif;"><strong style="display:block;font-size:14px;margin-bottom:4px;color:#15803D;">${wifi.instlPlace}</strong><span style="font-size:11px;color:#16A34A;background:#F0FDF4;padding:2px 8px;border-radius:12px;border:1px solid #BBF7D0;">무료 와이파이</span><p style="font-size:11px;color:#6B7280;margin-top:6px;margin-bottom:0;">${wifi.addr || ""}</p>${wifi.wifiSsid ? `<p style="font-size:11px;color:#9CA3AF;margin-top:4px;margin-bottom:0;">📡 ${wifi.wifiSsid}</p>` : ""}</div>`;
        const infoWindow = new naver.maps.InfoWindow({ content });
        naver.maps.Event.addListener(marker, "click", () => { infoWindowsRef.current.forEach((iw) => iw.close()); infoWindow.open(mapRef.current, marker); });
        markersRef.current.push(marker);
        infoWindowsRef.current.push(infoWindow);
      });
    }
  }, [stores, wifis, showStores, showWifi, clearMarkers]);

  const fetchData = useCallback(async (center) => {
    setLoading(true);
    try {
      const sgisRes = await fetch(`/api/sgis?radius=1000&cx=${center.lng}&cy=${center.lat}`);
      const sgisData = await sgisRes.json();
      if (sgisData?.body?.items) setStores(sgisData.body.items);
      const wifiRes = await fetch(`/api/wifi`);
      const wifiData = await wifiRes.json();
      if (wifiData?.data?.items) setWifis(wifiData.data.items);
    } catch(e) { console.error("Data fetch error", e); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => {
    if (activeTab === "naver") initMap(mapCenter);
  }, [activeTab]);

  useEffect(() => {
    if (mapLoaded) renderMarkers();
  }, [mapLoaded, stores, wifis, showStores, showWifi, renderMarkers]);

  useEffect(() => {
    fetchData(mapCenter);
    return () => {
      clearMarkers();
      if (mapRef.current) {
        try { mapRef.current.destroy?.(); } catch {}
        mapRef.current = null;
      }
    };
  }, []);

  const handleRefresh = () => {
    if (activeTab === "sbiz") { fetchData(mapCenter); return; }
    const center = mapRef.current?.getCenter();
    if (center) {
      const newCenter = { lat: center.lat(), lng: center.lng() };
      setMapCenter(newCenter);
      localStorage.setItem("mapCenter", JSON.stringify(newCenter));
      fetchData(newCenter);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    try {
      const res = await fetch(`/api/naver?query=${encodeURIComponent(searchQuery)}&type=local&display=5`);
      const data = await res.json();
      const place = data?.items?.[0];
      if (place) {
        const lat = parseFloat(place.mapy || place.y);
        const lng = parseFloat(place.mapx || place.x);
        if (!isNaN(lat) && !isNaN(lng)) {
          setMapCenter({ lat, lng });
          localStorage.setItem("mapCenter", JSON.stringify({ lat, lng }));
          if (mapRef.current) mapRef.current.setCenter(new window.naver.maps.LatLng(lat, lng));
          fetchData({ lat, lng });
        }
      }
    } catch (e) { console.error("Search error", e); }
  };

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-56px)] animate-fade-in bg-gray-50 dark:bg-gray-900">
      {/* Left side: Maps & GIS */}
      <div className="flex-1 flex flex-col relative h-[50vh] lg:h-full min-h-[350px]">
        {/* Compact Tab Header */}
        <div className="absolute top-3 left-3 right-3 z-[400] flex items-center justify-between pointer-events-auto">
          <div className="flex gap-0.5 bg-white/95 dark:bg-gray-800/95 backdrop-blur-md rounded-xl p-1 shadow-lg border border-gray-100 dark:border-gray-700">
            <button
              onClick={() => setActiveTab("naver")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === "naver"
                  ? "bg-gray-900 text-white dark:bg-white dark:text-gray-900 shadow-sm"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              <Map size={13} /> 지도
            </button>
            <button
              onClick={() => setActiveTab("sbiz")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === "sbiz"
                  ? "bg-gray-900 text-white dark:bg-white dark:text-gray-900 shadow-sm"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              <BarChart2 size={13} /> GIS 분석
            </button>
          </div>

          {!loading && activeTab === "naver" && (
            <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-white/95 dark:bg-gray-800/95 backdrop-blur-md shadow-lg border border-gray-100 dark:border-gray-700 text-[11px] font-semibold text-gray-700 dark:text-gray-300">
              <span>상가 <strong className="text-blue-600 dark:text-blue-400">{stores.length}</strong></span>
              <span className="text-gray-300 dark:text-gray-600">|</span>
              <span>와이파이 <strong className="text-green-600 dark:text-green-400">{wifis.length}</strong></span>
            </div>
          )}
        </div>

        {activeTab === "naver" ? (
          <>
            {/* Search Bar */}
            <div className="absolute top-16 left-3 right-3 z-[400] flex gap-1.5">
              <Card padding="p-1.5" className="flex-1 flex items-center gap-2 bg-white/95 dark:bg-gray-800/95 backdrop-blur-md shadow-lg border border-gray-100 dark:border-gray-700">
                <Search size={14} className="text-gray-400 ml-1.5" />
                <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  placeholder="지역 검색 (예: 전주객사, 익산역)"
                  className="flex-1 bg-transparent outline-none text-xs text-gray-900 dark:text-white placeholder-gray-400" />
                <Button variant="primary" size="sm" onClick={handleSearch}>검색</Button>
              </Card>
              <Button variant="secondary" size="sm" className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-md shadow-lg border border-gray-100 dark:border-gray-700" onClick={handleRefresh} disabled={loading}>
                <RefreshCw size={13} className={loading ? "animate-spin" : ""} />
              </Button>
            </div>

            {/* Controls Panel - Desktop layers */}
            <div className="absolute top-28 left-3 z-[400] hidden md:block">
              <Card className="w-48 bg-white/95 dark:bg-gray-800/95 backdrop-blur-md shadow-lg border border-gray-100 dark:border-gray-700 p-2.5">
                <h3 className="text-[11px] font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-1.5">
                  <MapPin size={12} className="text-blue-600 dark:text-blue-400" /> 지도 레이어
                </h3>
                <div className="space-y-1.5">
                  <label className={`flex items-center justify-between p-1.5 rounded-lg cursor-pointer transition-colors ${showStores ? "bg-blue-500/10 text-blue-600" : "bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400"}`}>
                    <span className="text-xs font-semibold">상가업소</span>
                    <input type="checkbox" checked={showStores} onChange={(e) => setShowStores(e.target.checked)} className="w-3.5 h-3.5 rounded text-blue-600 focus:ring-blue-500/50" />
                  </label>
                  <label className={`flex items-center justify-between p-1.5 rounded-lg cursor-pointer transition-colors ${showWifi ? "bg-green-500/10 text-green-600" : "bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400"}`}>
                    <span className="text-xs font-semibold">와이파이존</span>
                    <input type="checkbox" checked={showWifi} onChange={(e) => setShowWifi(e.target.checked)} className="w-3.5 h-3.5 rounded text-green-600 focus:ring-green-500/50" />
                  </label>
                </div>
              </Card>
            </div>

            {/* Legend & Coordinates */}
            <div className="absolute bottom-3 left-3 z-[400] flex items-center gap-2">
              <Card padding="p-1.5" className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-md shadow-lg border border-gray-100 dark:border-gray-700 flex items-center gap-2.5 text-[9px] font-semibold text-gray-600 dark:text-gray-400">
                <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-blue-600"></div>상가</div>
                <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-green-500"></div>와이파이</div>
              </Card>
              <Card padding="p-1.5" className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-md shadow-lg border border-gray-100 dark:border-gray-700 text-[8px] font-mono text-gray-400">
                {mapCenter.lat.toFixed(4)}, {mapCenter.lng.toFixed(4)}
              </Card>
            </div>

            {/* Naver Map Container */}
            {mapError ? (
              <div className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-800">
                <div className="text-center p-6 max-w-sm">
                  <AlertTriangle size={32} className="text-yellow-500 mx-auto mb-2" />
                  <p className="text-xs font-semibold text-gray-900 dark:text-white mb-1">지도를 불러오지 못했습니다.</p>
                  <p className="text-[10px] text-red-500 dark:text-red-400 mb-3 font-mono">{mapError.split('\n')[0]}</p>
                  <button onClick={() => { setMapError(null); setMapLoaded(false); mapRef.current = null; initMap(mapCenter); }} className="px-3 py-1.5 bg-gray-900 text-white dark:bg-white dark:text-gray-900 text-xs font-semibold rounded-lg hover:opacity-90 transition-opacity">
                    다시 시도
                  </button>
                </div>
              </div>
            ) : (
              <div ref={mapContainerRef} className="w-full h-full" />
            )}
          </>
        ) : (
          /* SBIZ GIS iframe */
          <div className="w-full h-full">
            <iframe
              src={SBIZ_GIS_URL}
              className="w-full h-full border-0"
              title="소상공인 핫플레이스 GIS"
              allow="geolocation"
            />
          </div>
        )}
      </div>

      {/* Right side: Real-time Floating Population & Sales Insights Panel (Scenario 2) */}
      <div className="w-full lg:w-[360px] bg-white dark:bg-gray-950 border-t lg:border-t-0 lg:border-l border-gray-100 dark:border-gray-800 overflow-y-auto h-[50vh] lg:h-full flex flex-col">
        {/* Panel Header */}
        <div className="p-4 border-b border-gray-100 dark:border-gray-800 shrink-0">
          <div className="flex items-center gap-2 mb-1">
            <Badge color="blue">상권인사이트</Badge>
            <span className="text-[11px] text-gray-400 dark:text-gray-500 font-mono">LIVE DATA</span>
          </div>
          <h2 className="text-[15px] font-bold text-gray-900 dark:text-white flex items-center gap-1.5">
            <MapPin size={15} className="text-blue-600 dark:text-blue-400" /> 전주 한옥마을 상권
          </h2>
          <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">전라북도 전주시 완산구 풍남동 일대</p>
        </div>

        {/* Panel Body */}
        <div className="p-4 space-y-4 flex-1">
          {/* Card 1: Floating Population */}
          <div className="bg-gradient-to-br from-blue-50/50 to-indigo-50/30 dark:from-blue-950/20 dark:to-transparent border border-blue-100/60 dark:border-blue-900/40 rounded-2xl p-4 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-blue-700 dark:text-blue-400">실시간 유동인구</span>
              <Badge color="blue">▲ 12.4%</Badge>
            </div>
            <div className="flex items-baseline gap-1.5 mb-2">
              <span className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">19,280</span>
              <span className="text-xs text-gray-500 dark:text-gray-400">명</span>
            </div>
            <p className="text-[11px] text-gray-600 dark:text-gray-400 leading-relaxed">
              맑고 선선한 바람이 불면서 한옥마을 내 보행 인구 흐름이 주말 평균 흐름에 근접하여 활기를 띠고 있습니다.
            </p>
            {/* Demographics bar */}
            <div className="mt-3 pt-3 border-t border-blue-100/40 dark:border-blue-900/20">
              <div className="flex items-center justify-between text-[10px] text-gray-500 dark:text-gray-400 mb-1.5">
                <span>주요 방문층: <strong>20대 여성 (38%)</strong></span>
                <span>남여 비율: <strong>42 : 58</strong></span>
              </div>
              <div className="w-full h-1.5 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden flex">
                <div className="h-full bg-blue-500" style={{ width: '42%' }}></div>
                <div className="h-full bg-pink-500" style={{ width: '58%' }}></div>
              </div>
            </div>
          </div>

          {/* Card 2: Sales Insights by Category */}
          <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-4 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gray-900 dark:text-white">업종별 평균 매출 분석</span>
              <span className="text-[10px] text-gray-400">최근 1개월 기준</span>
            </div>

            {/* List */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800/40 rounded-xl">
                <div>
                  <div className="text-[11px] font-bold text-gray-900 dark:text-white">한식 및 주점</div>
                  <div className="text-[9px] text-gray-400">경쟁강도: 보통</div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-bold text-gray-950 dark:text-white">월 2,450만원</div>
                  <div className="text-[9px] text-emerald-500 font-semibold">▲ 5.2%</div>
                </div>
              </div>

              <div className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800/40 rounded-xl">
                <div>
                  <div className="text-[11px] font-bold text-gray-900 dark:text-white">카페 및 디저트</div>
                  <div className="text-[9px] text-gray-400">경쟁강도: 높음</div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-bold text-gray-950 dark:text-white">월 1,820만원</div>
                  <div className="text-[9px] text-gray-400 font-semibold">- 0.8%</div>
                </div>
              </div>
            </div>
          </div>

          {/* Card 3: AI Special Tip */}
          <div className="bg-amber-50/50 dark:bg-amber-950/10 border border-amber-100 dark:border-amber-950/40 rounded-2xl p-4">
            <h4 className="text-xs font-bold text-amber-800 dark:text-amber-400 mb-1 flex items-center gap-1">
              💡 W-AI 상권 권장 전략
            </h4>
            <p className="text-[11px] text-amber-800/90 dark:text-amber-500/80 leading-relaxed">
              구름 많은 날씨에는 야외 관광객의 전 소모 비중이 늘어납니다. <strong>모둠 전 + 전주 막걸리 패키지</strong> 기획 세트의 SNS/배달 채널 홍보글 노출 비중을 높여보세요.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

