import { useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Store, Wifi, Loader2, MapPin } from "lucide-react";

// Custom marker icons using divIcon (avoids image loading issues)
const createIcon = (color) => L.divIcon({
  className: 'custom-marker',
  html: `<div style="background:${color};width:26px;height:26px;border-radius:50%;border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.3);"></div>`,
  iconSize: [26, 26],
  iconAnchor: [13, 13],
  popupAnchor: [0, -15]
});

const storeIcon = createIcon('#2563EB');
const wifiIcon = createIcon('#22C55E');

// Component to handle map resize
function MapResizer() {
  const map = useMap();
  useEffect(() => {
    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 100);
    return () => clearTimeout(timer);
  }, [map]);
  return null;
}

export default function MarketAnalysisPage() {
  const [showStores, setShowStores] = useState(true);
  const [showWifi, setShowWifi] = useState(true);
  const [stores, setStores] = useState([]);
  const [wifis, setWifis] = useState([]);
  const [loading, setLoading] = useState(true);
  const mapRef = useRef(null);
  
  const center = [35.818, 127.148];

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const sgisRes = await fetch(`/api/sgis?radius=1000`);
        const sgisData = await sgisRes.json();
        if (sgisData?.body?.items) {
          setStores(sgisData.body.items);
        }

        const wifiRes = await fetch(`/api/wifi`);
        const wifiData = await wifiRes.json();
        if (wifiData?.data?.items) {
          setWifis(wifiData.data.items);
        }
      } catch(e) {
        console.error("Data fetch error", e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="flex flex-col" style={{ height: 'calc(100vh - 80px)' }}>
      {/* Controls Overlay */}
      <div className="absolute top-4 left-4 z-[400] bg-white rounded-xl shadow-lg p-4 w-72 border border-gray-100">
        <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <MapPin size={20} className="text-blue-600" />
          상권 데이터 시각화
        </h2>
        
        <div className="space-y-3">
          <label className="flex items-center justify-between p-3 bg-blue-50 rounded-lg cursor-pointer hover:bg-blue-100 transition-colors">
            <div className="flex items-center gap-2 text-blue-900 font-medium">
              <Store size={18} />
              주변 상가업소 (SGIS)
            </div>
            <input 
              type="checkbox" 
              checked={showStores} 
              onChange={(e) => setShowStores(e.target.checked)}
              className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
            />
          </label>

          <label className="flex items-center justify-between p-3 bg-green-50 rounded-lg cursor-pointer hover:bg-green-100 transition-colors">
            <div className="flex items-center gap-2 text-green-900 font-medium">
              <Wifi size={18} />
              무료 와이파이존 (전주)
            </div>
            <input 
              type="checkbox" 
              checked={showWifi} 
              onChange={(e) => setShowWifi(e.target.checked)}
              className="w-5 h-5 text-green-600 rounded focus:ring-green-500"
            />
          </label>
        </div>

        {loading && (
          <div className="mt-4 flex items-center justify-center gap-2 text-sm text-gray-500">
            <Loader2 size={16} className="animate-spin" />
            공공데이터를 불러오는 중...
          </div>
        )}
      </div>

      {/* Stats Overlay */}
      {!loading && (
        <div className="absolute bottom-6 left-4 z-[400] flex gap-3">
          <div className="bg-white px-4 py-3 rounded-xl shadow-md border border-gray-100 flex flex-col items-center">
            <span className="text-xs text-gray-500 font-medium mb-1">검색된 상가</span>
            <span className="text-xl font-bold text-blue-600">{stores.length}</span>
          </div>
          <div className="bg-white px-4 py-3 rounded-xl shadow-md border border-gray-100 flex flex-col items-center">
            <span className="text-xs text-gray-500 font-medium mb-1">와이파이존</span>
            <span className="text-xl font-bold text-green-600">{wifis.length}</span>
          </div>
        </div>
      )}

      {/* Map */}
      <div className="flex-1 relative" style={{ minHeight: '500px' }}>
        <MapContainer 
          center={center} 
          zoom={15} 
          scrollWheelZoom={true} 
          style={{ height: '100%', width: '100%' }}
          ref={mapRef}
        >
          <MapResizer />
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          />

          {/* SGIS Stores */}
          {showStores && stores.map((store, i) => {
            const lat = parseFloat(store.lat || store.y);
            const lng = parseFloat(store.lon || store.x);
            if(isNaN(lat) || isNaN(lng)) return null;

            return (
              <Marker key={`store-${i}`} position={[lat, lng]} icon={storeIcon}>
                <Popup>
                  <div style={{ padding: '4px' }}>
                    <strong style={{ display: 'block', fontSize: '14px', marginBottom: '4px' }}>{store.bizesNm}</strong>
                    <span style={{ fontSize: '11px', color: '#6B7280', background: '#F3F4F6', padding: '2px 6px', borderRadius: '4px' }}>
                      {store.indsSclsNm || store.indsMclsNm}
                    </span>
                    <p style={{ fontSize: '11px', color: '#6B7280', marginTop: '6px' }}>{store.ldongNm || store.adongNm}</p>
                  </div>
                </Popup>
              </Marker>
            );
          })}

          {/* WiFi Zones */}
          {showWifi && wifis.map((wifi, i) => (
            <Marker key={`wifi-${i}`} position={[wifi.lat, wifi.lon]} icon={wifiIcon}>
              <Popup>
                <div style={{ padding: '4px' }}>
                  <strong style={{ display: 'block', fontSize: '14px', marginBottom: '4px', color: '#15803D' }}>{wifi.instlPlace}</strong>
                  <span style={{ fontSize: '11px', color: '#16A34A', background: '#F0FDF4', padding: '2px 6px', borderRadius: '4px', border: '1px solid #BBF7D0' }}>
                    무료 와이파이
                  </span>
                  <p style={{ fontSize: '11px', color: '#6B7280', marginTop: '6px' }}>{wifi.addr}</p>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
}
