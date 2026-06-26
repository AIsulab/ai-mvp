import { useState, useEffect, useRef, useCallback } from "react";
import { Store, Wifi, MapPin, RefreshCw, Info, Search } from "lucide-react";
import { Card, Badge, Spinner, Button, Input } from "../../../components/ui";
import { useTheme } from "../../../contexts/ThemeContext";

const NAVER_MAPS_CLIENT_ID = process.env.NAVER_MAP_ID || "lu0ryww0wc";
const DEFAULT_CENTER = { lat: 35.818, lng: 127.148 };

function getInitialPosition() {
  if (typeof window === "undefined") return DEFAULT_CENTER;
  const params = new URLSearchParams(window.location.search);
  const lat = parseFloat(params.get("lat"));
  const lng = parseFloat(params.get("lng"));
  if (!isNaN(lat) && !isNaN(lng)) return { lat, lng };
  const saved = localStorage.getItem("mapCenter");
  if (saved) {
    try { return JSON.parse(saved); } catch {}
  }
  return DEFAULT_CENTER;
}

export default function MarketAnalysisPage() {
  const [showStores, setShowStores] = useState(true);
  const [showWifi, setShowWifi] = useState(true);
  const [stores, setStores] = useState([]);
  const [wifis, setWifis] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [mapCenter, setMapCenter] = useState(getInitialPosition);
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const markersRef = useRef([]);
  const infoWindowsRef = useRef([]);
  const { isDark } = useTheme();

  const loadNaverMap = useCallback(() => {
    return new Promise((resolve) => {
      if (window.naver && window.naver.maps) {
        resolve(window.naver.maps);
        return;
      }
      const script = document.createElement("script");
      script.src = `https://openapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${NAVER_MAPS_CLIENT_ID}`;
      script.async = true;
      script.onload = () => resolve(window.naver.maps);
      script.onerror = () => resolve(null);
      document.head.appendChild(script);
    });
  }, []);

  const initMap = useCallback(async (center) => {
    const naver = await loadNaverMap();
    if (!naver || !mapContainerRef.current) return;

    if (mapRef.current) {
      mapRef.current.setCenter(new naver.LatLng(center.lat, center.lng));
      return;
    }

    const map = new naver.Map(mapContainerRef.current, {
      center: new naver.LatLng(center.lat, center.lng),
      zoom: 15,
      scaleControl: true,
      logoControl: false,
      mapDataControl: false,
    });

    naver.maps.Event.addListener(map, "idle", () => {
      const c = map.getCenter();
      const newCenter = { lat: c.lat(), lng: c.lng() };
      setMapCenter(newCenter);
      localStorage.setItem("mapCenter", JSON.stringify(newCenter));
    });

    mapRef.current = map;
    setMapLoaded(true);
  }, [loadNaverMap]);

  const createMarkerIcon = (color) => {
    if (!window.naver) return undefined;
    return new window.naver.maps.Size(28, 28);
  };

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
          position: new naver.maps.LatLng(lat, lng),
          map: mapRef.current,
          icon: {
            content: `<div style="background:#2563EB;width:28px;height:28px;border-radius:50%;border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.3);display:flex;align-items:center;justify-content:center;"><div style="width:8px;height:8px;background:white;border-radius:50%;"></div></div>`,
            size: new naver.maps.Size(28, 28),
            anchor: new naver.maps.Point(14, 14),
          },
        });

        const content = `
          <div style="padding:8px;min-width:180px;font-family:Inter,system-ui,sans-serif;">
            <strong style="display:block;font-size:14px;margin-bottom:4px;color:#111827;">${store.bizesNm}</strong>
            <span style="font-size:11px;color:#2563EB;background:#EFF6FF;padding:2px 8px;border-radius:12px;">${store.indsSclsNm || store.indsMclsNm || "상가"}</span>
            <p style="font-size:11px;color:#6B7280;margin-top:6px;margin-bottom:0;">${store.ldongNm || store.adongNm || ""}</p>
            ${store.telno ? `<p style="font-size:11px;color:#9CA3AF;margin-top:4px;margin-bottom:0;">📞 ${store.telno}</p>` : ""}
          </div>
        `;

        const infoWindow = new naver.maps.InfoWindow({ content });
        naver.maps.Event.addListener(marker, "click", () => {
          infoWindowsRef.current.forEach((iw) => iw.close());
          infoWindow.open(mapRef.current, marker);
        });
        markersRef.current.push(marker);
        infoWindowsRef.current.push(infoWindow);
      });
    }

    if (showWifi) {
      wifis.forEach((wifi) => {
        if (!wifi.lat || !wifi.lon) return;

        const marker = new naver.maps.Marker({
          position: new naver.maps.LatLng(wifi.lat, wifi.lon),
          map: mapRef.current,
          icon: {
            content: `<div style="background:#22C55E;width:28px;height:28px;border-radius:50%;border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.3);display:flex;align-items:center;justify-content:center;"><div style="width:8px;height:8px;background:white;border-radius:50%;"></div></div>`,
            size: new naver.maps.Size(28, 28),
            anchor: new naver.maps.Point(14, 14),
          },
        });

        const content = `
          <div style="padding:8px;min-width:180px;font-family:Inter,system-ui,sans-serif;">
            <strong style="display:block;font-size:14px;margin-bottom:4px;color:#15803D;">${wifi.instlPlace}</strong>
            <span style="font-size:11px;color:#16A34A;background:#F0FDF4;padding:2px 8px;border-radius:12px;border:1px solid #BBF7D0;">무료 와이파이</span>
            <p style="font-size:11px;color:#6B7280;margin-top:6px;margin-bottom:0;">${wifi.addr || ""}</p>
            ${wifi.wifiSsid ? `<p style="font-size:11px;color:#9CA3AF;margin-top:4px;margin-bottom:0;">📡 ${wifi.wifiSsid}</p>` : ""}
          </div>
        `;

        const infoWindow = new naver.maps.InfoWindow({ content });
        naver.maps.Event.addListener(marker, "click", () => {
          infoWindowsRef.current.forEach((iw) => iw.close());
          infoWindow.open(mapRef.current, marker);
        });
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
    } catch(e) {
      console.error("Data fetch error", e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    initMap(mapCenter);
  }, []);

  useEffect(() => {
    if (mapLoaded) {
      renderMarkers();
    }
  }, [mapLoaded, stores, wifis, showStores, showWifi, renderMarkers]);

  useEffect(() => {
    fetchData(mapCenter);
  }, []);

  const handleRefresh = () => {
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
      const res = await fetch(`https://map.naver.com/p/api/search/allSearch?query=${encodeURIComponent(searchQuery)}&type=all`);
      const data = await res.json();
      if (data?.result?.place?.list?.[0]) {
        const place = data.result.place.list[0];
        const lat = parseFloat(place.y);
        const lng = parseFloat(place.x);
        if (!isNaN(lat) && !isNaN(lng)) {
          setMapCenter({ lat, lng });
          localStorage.setItem("mapCenter", JSON.stringify({ lat, lng }));
          if (mapRef.current) {
            mapRef.current.setCenter(new window.naver.maps.LatLng(lat, lng));
          }
          fetchData({ lat, lng });
        }
      }
    } catch (e) {
      console.error("Search error", e);
    }
  };

  return (
    <div className="flex flex-col h-full animate-fade-in">
      {/* Page Header */}
      <div className="px-6 py-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">상권 데이터 시각화</h1>
              <Badge color="blue">실시간</Badge>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">지도를 이동한 후 새로고침하면 해당 지역의 상권 데이터를 확인할 수 있습니다.</p>
          </div>
          <div className="flex items-center gap-3">
            {!loading && (
              <>
                <div className="text-center px-3">
                  <div className="text-lg font-bold text-primary">{stores.length}</div>
                  <div className="text-[10px] text-gray-500 dark:text-gray-400">상가업소</div>
                </div>
                <div className="w-px h-8 bg-gray-200 dark:bg-gray-600"></div>
                <div className="text-center px-3">
                  <div className="text-lg font-bold text-green-600">{wifis.length}</div>
                  <div className="text-[10px] text-gray-500 dark:text-gray-400">와이파이존</div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Map Container */}
      <div className="flex-1 relative">
        {/* Search Bar */}
        <div className="absolute top-4 left-4 right-4 z-[400] flex gap-2 animate-slide-up">
          <Card padding="p-2" className="flex-1 flex items-center gap-2">
            <Search size={16} className="text-gray-400 ml-2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder="지역 검색 (예: 전주객사, 익산역)"
              className="flex-1 bg-transparent outline-none text-sm text-gray-900 dark:text-white placeholder-gray-400"
            />
            <Button variant="primary" size="sm" onClick={handleSearch}>검색</Button>
          </Card>
          <Button variant="secondary" size="sm" onClick={handleRefresh} disabled={loading}>
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} /> 새로고침
          </Button>
        </div>

        {/* Controls Panel */}
        <div className="absolute top-20 left-4 z-[400] animate-slide-up" style={{ animationDelay: '100ms' }}>
          <Card className="w-56">
            <h3 className="text-xs font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
              <MapPin size={14} className="text-primary" /> 레이어
            </h3>
            <div className="space-y-2">
              <label className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors ${showStores ? "bg-primary-light dark:bg-primary/20" : "bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600"}`}>
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-primary"></div>
                  <span className="text-xs font-medium text-gray-700 dark:text-gray-300">상가업소</span>
                </div>
                <input type="checkbox" checked={showStores} onChange={(e) => setShowStores(e.target.checked)}
                  className="w-3.5 h-3.5 text-primary rounded focus:ring-primary" />
              </label>
              <label className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors ${showWifi ? "bg-green-50 dark:bg-green-900/20" : "bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600"}`}>
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
                  <span className="text-xs font-medium text-gray-700 dark:text-gray-300">와이파이존</span>
                </div>
                <input type="checkbox" checked={showWifi} onChange={(e) => setShowWifi(e.target.checked)}
                  className="w-3.5 h-3.5 text-green-500 rounded focus:ring-green-500" />
              </label>
            </div>
          </Card>
        </div>

        {/* Legend */}
        <div className="absolute bottom-4 left-4 z-[400] animate-slide-up" style={{ animationDelay: '200ms' }}>
          <Card padding="p-2.5" className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-primary"></div>
              <span className="text-[11px] text-gray-600 dark:text-gray-400">상가</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
              <span className="text-[11px] text-gray-600 dark:text-gray-400">와이파이</span>
            </div>
          </Card>
        </div>

        {/* Coordinates Display */}
        <div className="absolute bottom-4 right-4 z-[400] animate-slide-up" style={{ animationDelay: '300ms' }}>
          <Card padding="p-2.5">
            <span className="text-[10px] text-gray-400 dark:text-gray-500 font-mono">
              {mapCenter.lat.toFixed(4)}, {mapCenter.lng.toFixed(4)}
            </span>
          </Card>
        </div>

        {/* Map */}
        <div ref={mapContainerRef} className="w-full h-full" style={{ minHeight: '500px' }} />
      </div>
    </div>
  );
}
