import { MapPin, Phone, ExternalLink } from "lucide-react";

const categoryColors = {
  "커피점": "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  "한식": "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  "분식": "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
  "전통찻집": "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  "제과점": "bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400",
  "일식": "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  "중식": "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  "양식": "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400",
};

function getCategoryColor(category) {
  for (const [key, val] of Object.entries(categoryColors)) {
    if (category?.includes(key)) return val;
  }
  return "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400";
}

export default function StoreList({ stores, loading }) {
  if (loading) {
    return (
      <div className="space-y-2">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-16 bg-gray-100 dark:bg-gray-800 rounded-xl animate-pulse" />
        ))}
      </div>
    );
  }

  if (!Array.isArray(stores) || stores.length === 0) {
    return (
      <div className="text-center py-8">
        <MapPin size={24} className="text-gray-300 dark:text-gray-600 mx-auto mb-2" />
        <p className="text-xs text-gray-400">주변 상가 데이터를 아직 불러오지 못했습니다.</p>
      </div>
    );
  }

  return (
    <div className="space-y-1.5 max-h-[320px] overflow-y-auto pr-1">
      {stores.map((store, i) => (
        <div key={i} className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group">
          <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center shrink-0 mt-0.5">
            <MapPin size={13} className="text-blue-500" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 mb-0.5">
              <span className="text-[13px] font-semibold text-gray-900 dark:text-white truncate">{store.bizesNm}</span>
              <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full shrink-0 ${getCategoryColor(store.indsSclsNm)}`}>
                {store.indsSclsNm || store.indsMclsNm || "상가"}
              </span>
            </div>
            <p className="text-[11px] text-gray-500 dark:text-gray-400 truncate">{store.ldongNm || store.adongNm || ""}</p>
            {store.telno && (
              <div className="flex items-center gap-1 mt-1">
                <Phone size={10} className="text-gray-400" />
                <span className="text-[10px] text-gray-400">{store.telno}</span>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
