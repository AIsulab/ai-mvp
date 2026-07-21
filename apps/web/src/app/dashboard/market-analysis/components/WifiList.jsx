import { Wifi, MapPin } from "lucide-react";

export default function WifiList({ wifis, loading }) {
  if (loading) {
    return (
      <div className="space-y-2">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-14 bg-gray-100 dark:bg-gray-800 rounded-xl animate-pulse" />
        ))}
      </div>
    );
  }

  if (!Array.isArray(wifis) || wifis.length === 0) {
    return (
      <div className="text-center py-8">
        <Wifi size={24} className="text-gray-300 dark:text-gray-600 mx-auto mb-2" />
        <p className="text-xs text-gray-400">주변 와이파이존 데이터를 아직 불러오지 못했습니다.</p>
      </div>
    );
  }

  return (
    <div className="space-y-1.5 max-h-[240px] overflow-y-auto pr-1">
      {wifis.slice(0, 12).map((wifi, i) => (
        <div key={i} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
          <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center shrink-0">
            <Wifi size={13} className="text-green-500" />
          </div>
          <div className="flex-1 min-w-0">
            <span className="text-[13px] font-semibold text-gray-900 dark:text-white block truncate">{wifi.instlPlace}</span>
            <div className="flex items-center gap-1 mt-0.5">
              <MapPin size={10} className="text-gray-400 shrink-0" />
              <span className="text-[10px] text-gray-500 dark:text-gray-400 truncate">{wifi.addr}</span>
            </div>
          </div>
          {wifi.wifiSsid && (
            <span className="text-[9px] font-mono text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-1.5 py-0.5 rounded shrink-0">
              {wifi.wifiSsid}
            </span>
          )}
        </div>
      ))}
    </div>
  );
}
