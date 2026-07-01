import { useState, useEffect, useRef, useCallback } from "react";
import { Wifi, MapPin, RefreshCw, Search, BarChart2, Map, AlertTriangle } from "lucide-react";
import { Card, Badge, Spinner, Button } from "../../../components/ui";
import { useTheme } from "../../../contexts/ThemeContext";

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

  const loadNaverMap = useCallback(() => {
    return new Promise((resolve) => {
      if (window.naver && window.naver.maps) { resolve(window.naver.maps); return; }
      if (!NAVER_MAP_KEY) { setMapError("VITE_NAVER_MAP_CLIENT_ID 환경변수가 설정되지 않았습니다."); resolve(null); return; }
      const script = document.createElement("script");
      script.src = `https://openapi.map.naver.com/openapi/v3/maps.js?ncpClientId=${NAVER_MAP_KEY}&submodules=geocoder`;
      script.async = true;
      script.onload = () => {
        if (window.naver && window.naver.maps) {
          resolve(window.naver.maps);
        } else {
          setMapError("네이버 지도 API 인증 실패 — VITE_NAVER_MAP_CLIENT_ID를 확인해주세요.");
          resolve(null);
        }
      };
      script.onerror = () => {
        setMapError("지도를 불러오지 못했습니다. 네트워크 연결을 확인해주세요.");
        resolve(null);
      };
      document.head.appendChild(script);
    });
  }, []);

  const initMap = useCallback(async (center) => {
    if (activeTab !== "naver") return;
    setMapError(null);
    const naver = await loadNaverMap();
    if (!naver || !mapContainerRef.current) return;
    try {
      if (mapRef.current) { mapRef.current.setCenter(new naver.LatLng(center.lat, center.lng)); return; }
      const map = new naver.Map(mapContainerRef.current, {
        center: new naver.LatLng(center.lat, center.lng),
        zoom: 14, scaleControl: true, logoControl: false, mapDataControl: false,
      });
      naver.maps.Event.addListener(map, "idle", () => {
        const c = map.getCenter();
        const newCenter = { lat: c.lat(), lng: c.lng() };
        setMapCenter(newCenter);
        localStorage.setItem("mapCenter", JSON.stringify(newCenter));
      });
      mapRef.current = map;
      setMapLoaded(true);
    } catch (e) {
      setMapError("지도를 불러오지 못했습니다. 잠시 후 다시 시도해주세요.");
    }
  }, [loadNaverMap, activeTab]);

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

  useEffect(() => { if (activeTab === "naver") initMap(mapCenter); }, [activeTab]);

  useEffect(() => { if (mapLoaded) renderMarkers(); }, [mapLoaded, stores, wifis, showStores, showWifi, renderMarkers]);

  useEffect(() => { fetchData(mapCenter); }, []);

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
    <div className="flex flex-col h-full animate-fade-in">
      {/* Compact Tab Header */}
      <div className="px-3 md:px-4 py-2 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
        <div className="flex gap-0.5 md:gap-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-0.5 md:p-1">
          <button
            onClick={() => setActiveTab("naver")}
            className={`flex items-center gap-1.5 md:gap-2 px-2.5 md:px-4 py-1.5 rounded-md text-xs md:text-sm font-medium transition-all ${
              activeTab === "naver"
                ? "bg-white dark:bg-gray-800 text-primary shadow-sm"
                : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            }`}
          >
            <Map size={13} /> <span className="hidden sm:inline">네이버</span> 지도
          </button>
          <button
            onClick={() => setActiveTab("sbiz")}
            className={`flex items-center gap-1.5 md:gap-2 px-2.5 md:px-4 py-1.5 rounded-md text-xs md:text-sm font-medium transition-all ${
              activeTab === "sbiz"
                ? "bg-white dark:bg-gray-800 text-primary shadow-sm"
                : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            }`}
          >
            <BarChart2 size={13} /> <span className="hidden sm:inline">핫플레이스</span> GIS
          </button>
        </div>
        {!loading && activeTab === "naver" && (
          <div className="flex items-center gap-2 md:gap-3 text-[10px] md:text-xs">
            <span className="text-gray-500 dark:text-gray-400">상가 <strong className="text-primary">{stores.length}</strong></span>
            <span className="text-gray-300 dark:text-gray-600">|</span>
            <span className="text-gray-500 dark:text-gray-400">와이파이 <strong className="text-green-600">{wifis.length}</strong></span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 relative">
        {activeTab === "naver" ? (
          <>
            {/* Search Bar */}
            <div className="absolute top-3 left-3 right-3 md:top-4 md:left-4 md:right-4 z-[400] flex gap-1.5 md:gap-2 animate-slide-up">
              <Card padding="p-1.5 md:p-2" className="flex-1 flex items-center gap-1.5 md:gap-2">
                <Search size={14} className="text-gray-400 ml-1.5 md:ml-2" />
                <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  placeholder="지역 검색 (예: 전주객사, 익산역)"
                  className="flex-1 bg-transparent outline-none text-xs md:text-sm text-gray-900 dark:text-white placeholder-gray-400" />
                <Button variant="primary" size="sm" onClick={handleSearch}>검색</Button>
              </Card>
              <Button variant="secondary" size="sm" onClick={handleRefresh} disabled={loading}>
                <RefreshCw size={13} className={loading ? "animate-spin" : ""} /> <span className="hidden md:inline">새로고침</span>
              </Button>
            </div>

            {/* Controls Panel - Mobile: horizontal toggle bar */}
            <div className="absolute top-16 md:top-20 left-3 md:left-4 z-[400] animate-slide-up" style={{ animationDelay: '100ms' }}>
              <div className="md:hidden bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-2 flex gap-2">
                <label className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md cursor-pointer text-[10px] font-medium transition-colors ${showStores ? "bg-primary/10 text-primary" : "text-gray-500 dark:text-gray-400"}`}>
                  <div className="w-2 h-2 rounded-full bg-primary"></div>
                  상가
                  <input type="checkbox" checked={showStores} onChange={(e) => setShowStores(e.target.checked)} className="sr-only" />
                </label>
                <label className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md cursor-pointer text-[10px] font-medium transition-colors ${showWifi ? "bg-green-50 dark:bg-green-900/30 text-green-600" : "text-gray-500 dark:text-gray-400"}`}>
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  와이파이
                  <input type="checkbox" checked={showWifi} onChange={(e) => setShowWifi(e.target.checked)} className="sr-only" />
                </label>
              </div>
              <Card className="w-52 md:w-56 hidden md:block">
                <h3 className="text-xs font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <MapPin size={13} className="text-primary" /> 레이어
                </h3>
                <div className="space-y-2">
                  <label className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors ${showStores ? "bg-primary/10 dark:bg-primary/20" : "bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600"}`}>
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-primary"></div>
                      <span className="text-xs font-medium text-gray-700 dark:text-gray-300">상가업소</span>
                    </div>
                    <input type="checkbox" checked={showStores} onChange={(e) => setShowStores(e.target.checked)} className="w-3.5 h-3.5 text-primary rounded focus:ring-primary" />
                  </label>
                  <label className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors ${showWifi ? "bg-green-50 dark:bg-green-900/20" : "bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600"}`}>
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
                      <span className="text-xs font-medium text-gray-700 dark:text-gray-300">와이파이존</span>
                    </div>
                    <input type="checkbox" checked={showWifi} onChange={(e) => setShowWifi(e.target.checked)} className="w-3.5 h-3.5 text-green-500 rounded focus:ring-green-500" />
                  </label>
                </div>
              </Card>
            </div>

            {/* Legend - Mobile: compact */}
            <div className="absolute bottom-3 left-3 md:bottom-4 md:left-4 z-[400] animate-slide-up" style={{ animationDelay: '200ms' }}>
              <Card padding="p-2 md:p-2.5" className="flex items-center gap-2 md:gap-3">
                <div className="flex items-center gap-1 md:gap-1.5"><div className="w-2 h-2 md:w-2.5 md:h-2.5 rounded-full bg-primary"></div><span className="text-[9px] md:text-[11px] text-gray-600 dark:text-gray-400">상가</span></div>
                <div className="flex items-center gap-1 md:gap-1.5"><div className="w-2 h-2 md:w-2.5 md:h-2.5 rounded-full bg-green-500"></div><span className="text-[9px] md:text-[11px] text-gray-600 dark:text-gray-400">와이파이</span></div>
              </Card>
            </div>

            {/* Coordinates - Mobile: smaller */}
            <div className="absolute bottom-3 right-3 md:bottom-4 md:right-4 z-[400] animate-slide-up" style={{ animationDelay: '300ms' }}>
              <Card padding="p-1.5 md:p-2.5">
                <span className="text-[8px] md:text-[10px] text-gray-400 dark:text-gray-500 font-mono">{mapCenter.lat.toFixed(4)}, {mapCenter.lng.toFixed(4)}</span>
              </Card>
            </div>

            {/* Naver Map */}
            {mapError ? (
              <div className="w-full flex items-center justify-center bg-gray-100 dark:bg-gray-800" style={{ minHeight: '400px' }}>
                <div className="text-center p-6 max-w-sm">
                  <AlertTriangle size={36} className="text-orange-400 mx-auto mb-3" />
                  <p className="text-sm font-semibold text-gray-900 dark:text-white mb-1">지도를 불러오지 못했습니다.</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">잠시 후 다시 시도해주세요.</p>
                  <button onClick={() => { setMapError(null); setMapLoaded(false); mapRef.current = null; initMap(mapCenter); }} className="inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:underline">
                    <RefreshCw size={12} /> 다시 시도
                  </button>
                </div>
              </div>
            ) : (
              <div ref={mapContainerRef} className="w-full h-full" style={{ minHeight: '400px' }} />
            )}
          </>
        ) : (
          /* SBIZ GIS iframe */
          <div className="w-full h-full" style={{ minHeight: '400px' }}>
            <iframe
              src={SBIZ_GIS_URL}
              className="w-full h-full border-0"
              style={{ minHeight: 'calc(100vh - 200px)' }}
              title="소상공인 핫플레이스 GIS"
              allow="geolocation"
            />
          </div>
        )}
      </div>
    </div>
  );
}
