import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Store, Wifi, Loader2, MapPin } from "lucide-react";

// Fix for default marker icons in Leaflet with Vite
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

// Custom icons
const storeIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const wifiIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Helper component to update map center
function MapUpdater({ center }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center);
  }, [center, map]);
  return null;
}

export default function MarketAnalysisPage() {
  const [showStores, setShowStores] = useState(true);
  const [showWifi, setShowWifi] = useState(true);
  const [stores, setStores] = useState([]);
  const [wifis, setWifis] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Default center: Jeonju (전주 객사 부근)
  const [center, setCenter] = useState([35.818, 127.148]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch SGIS Stores
        const sgisRes = await fetch(`/api/sgis?radius=1000`);
        const sgisData = await sgisRes.json();
        if (sgisData && sgisData.body && sgisData.body.items) {
          setStores(sgisData.body.items);
        }

        // Fetch Jeonju WiFi
        const wifiRes = await fetch(`/api/wifi`);
        const wifiData = await wifiRes.json();
        if (wifiData && wifiData.data && wifiData.data.items) {
          // Add some mock coordinates to wifi since original mock didn't have lat/lng
          // In a real scenario, the API would return lat/lng. For this MVP, we spread them near the center.
          const itemsWithCoords = wifiData.data.items.map((item, idx) => ({
            ...item,
            lat: 35.818 + (Math.random() - 0.5) * 0.01,
            lon: 127.148 + (Math.random() - 0.5) * 0.01
          }));
          setWifis(itemsWithCoords);
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
    <div className="flex flex-col h-[calc(100vh-80px)] relative">
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
      <div className="flex-1 w-full z-0">
        <MapContainer 
          center={center} 
          zoom={15} 
          scrollWheelZoom={true} 
          style={{ height: '100%', width: '100%', zIndex: 0 }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          />
          <MapUpdater center={center} />

          {/* SGIS Stores */}
          {showStores && stores.map((store, i) => {
            const lat = parseFloat(store.lat || store.y || center[0] + (Math.random()-0.5)*0.01);
            const lng = parseFloat(store.lon || store.x || center[1] + (Math.random()-0.5)*0.01);
            if(isNaN(lat) || isNaN(lng)) return null;

            return (
              <Marker key={`store-${i}`} position={[lat, lng]} icon={storeIcon}>
                <Popup>
                  <div className="p-1">
                    <strong className="block text-base mb-1">{store.bizesNm}</strong>
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">{store.indsSclsNm || store.indsMclsNm}</span>
                    <p className="text-xs text-gray-600 mt-2">{store.ldongNm || store.adongNm}</p>
                  </div>
                </Popup>
              </Marker>
            );
          })}

          {/* WiFi Zones */}
          {showWifi && wifis.map((wifi, i) => (
            <Marker key={`wifi-${i}`} position={[wifi.lat, wifi.lon]} icon={wifiIcon}>
              <Popup>
                <div className="p-1">
                  <strong className="block text-base mb-1 text-green-700">{wifi.instlPlace}</strong>
                  <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded border border-green-200">무료 와이파이</span>
                  <p className="text-xs text-gray-600 mt-2">{wifi.addr}</p>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
}
