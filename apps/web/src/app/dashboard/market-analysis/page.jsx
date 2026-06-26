import { useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Store, Wifi, MapPin, RotateCcw, Info } from "lucide-react";
import { Card, Badge, Spinner } from "../../../components/ui";
import { useTheme } from "../../../contexts/ThemeContext";

const createIcon = (color) => L.divIcon({
  className: 'custom-marker',
  html: `<div style="background:${color};width:28px;height:28px;border-radius:50%;border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.3);display:flex;align-items:center;justify-content:center;"><div style="width:8px;height:8px;background:white;border-radius:50%;"></div></div>`,
  iconSize: [28, 28],
  iconAnchor: [14, 14],
  popupAnchor: [0, -16]
});

const storeIcon = createIcon('#2563EB');
const wifiIcon = createIcon('#22C55E');

function MapResizer() {
  const map = useMap();
  useEffect(() => {
    const timer = setTimeout(() => map.invalidateSize(), 100);
    return () => clearTimeout(timer);
  }, [map]);
  return null;
}

function StorePopup({ store }) {
  return (
    <div className="p-1 min-w-[180px]">
      <strong className="block text-sm font-semibold text-gray-900 dark:text-white mb-1">{store.bizesNm}</strong>
      <Badge color="blue">{store.indsSclsNm || store.indsMclsNm}</Badge>
      <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">{store.ldongNm || store.adongNm}</p>
      {store.telno && <p className="text-xs text-gray-400 mt-1">📞 {store.telno}</p>}
    </div>
  );
}

function WifiPopup({ wifi }) {
  return (
    <div className="p-1 min-w-[180px]">
      <strong className="block text-sm font-semibold text-green-700 dark:text-green-400 mb-1">{wifi.instlPlace}</strong>
      <Badge color="green">무료 와이파이</Badge>
      <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">{wifi.addr}</p>
      {wifi.wifiSsid && <p className="text-xs text-gray-400 mt-1">📡 {wifi.wifiSsid}</p>}
    </div>
  );
}

export default function MarketAnalysisPage() {
  const [showStores, setShowStores] = useState(true);
  const [showWifi, setShowWifi] = useState(true);
  const [stores, setStores] = useState([]);
  const [wifis, setWifis] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStore, setSelectedStore] = useState(null);
  const mapRef = useRef(null);
  const { isDark } = useTheme();

  const center = [35.818, 127.148];

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const sgisRes = await fetch(`/api/sgis?radius=1000`);
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
    };
    fetchData();
  }, []);

  const tileUrl = isDark
    ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
    : "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png";

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
            <p className="text-sm text-gray-500 dark:text-gray-400">전주 지역 상가업소와 무료 와이파이존을 지도에서 확인합니다.</p>
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
        {/* Controls Panel */}
        <div className="absolute top-4 left-4 z-[400] animate-slide-up">
          <Card className="w-64">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
              <MapPin size={16} className="text-primary" /> 레이어 제어
            </h3>
            <div className="space-y-2">
              <label className={`flex items-center justify-between p-2.5 rounded-lg cursor-pointer transition-colors ${showStores ? "bg-primary-light dark:bg-primary/20" : "bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600"}`}>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-primary"></div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">상가업소</span>
                </div>
                <input type="checkbox" checked={showStores} onChange={(e) => setShowStores(e.target.checked)}
                  className="w-4 h-4 text-primary rounded focus:ring-primary" />
              </label>
              <label className={`flex items-center justify-between p-2.5 rounded-lg cursor-pointer transition-colors ${showWifi ? "bg-green-50 dark:bg-green-900/20" : "bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600"}`}>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">와이파이존</span>
                </div>
                <input type="checkbox" checked={showWifi} onChange={(e) => setShowWifi(e.target.checked)}
                  className="w-4 h-4 text-green-500 rounded focus:ring-green-500" />
              </label>
            </div>
            {loading && (
              <div className="mt-3 flex items-center justify-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                <Spinner size={14} /> 데이터 로딩 중...
              </div>
            )}
          </Card>
        </div>

        {/* Legend */}
        <div className="absolute bottom-4 left-4 z-[400] animate-slide-up" style={{ animationDelay: '100ms' }}>
          <Card padding="p-3" className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-primary"></div>
              <span className="text-xs text-gray-600 dark:text-gray-400">상가</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span className="text-xs text-gray-600 dark:text-gray-400">와이파이</span>
            </div>
          </Card>
        </div>

        {/* Info Tooltip */}
        <div className="absolute bottom-4 right-4 z-[400] animate-slide-up" style={{ animationDelay: '200ms' }}>
          <Card padding="p-3" className="flex items-center gap-2 max-w-xs">
            <Info size={14} className="text-gray-400 shrink-0" />
            <span className="text-xs text-gray-500 dark:text-gray-400">마커를 클릭하면 상세 정보를 확인할 수 있습니다.</span>
          </Card>
        </div>

        {/* Map */}
        <div className="w-full h-full" style={{ minHeight: '500px' }}>
          <MapContainer center={center} zoom={15} scrollWheelZoom={true} style={{ height: '100%', width: '100%' }} ref={mapRef}>
            <MapResizer />
            <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>' url={tileUrl} />

            {showStores && stores.map((store, i) => {
              const lat = parseFloat(store.lat || store.y);
              const lng = parseFloat(store.lon || store.x);
              if (isNaN(lat) || isNaN(lng)) return null;
              return (
                <Marker key={`store-${i}`} position={[lat, lng]} icon={storeIcon} eventHandlers={{ click: () => setSelectedStore(store) }}>
                  <Popup><StorePopup store={store} /></Popup>
                </Marker>
              );
            })}

            {showWifi && wifis.map((wifi, i) => (
              <Marker key={`wifi-${i}`} position={[wifi.lat, wifi.lon]} icon={wifiIcon}>
                <Popup><WifiPopup wifi={wifi} /></Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </div>
    </div>
  );
}
