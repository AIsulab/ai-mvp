import { Zap, Store, MapPin, UtensilsCrossed } from "lucide-react";
import { businessTypes, regions } from "../../../constants/businessTypes";

export default function StoreInfoForm({ storeInfo, setStoreInfo, onAnalyze, isAnalyzing }) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-5 md:p-6">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-lg bg-gray-900 flex items-center justify-center">
          <Store size={15} className="text-white" />
        </div>
        <div>
          <h2 className="text-[14px] font-semibold text-gray-900">내 가게 정보</h2>
          <p className="text-[11px] text-gray-400">한 번만 입력하면 AI가 자동으로 마케팅합니다</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
        {/* 업종 */}
        <div>
          <label className="text-[12px] text-gray-500 mb-1.5 flex items-center gap-1 font-medium">
            <UtensilsCrossed size={11} className="text-gray-400" /> 업종
          </label>
          <select value={storeInfo.type} onChange={e => setStoreInfo({ ...storeInfo, type: e.target.value })}
            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-[13px] text-gray-900 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200 transition-all">
            {businessTypes.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>

        {/* 가게 이름 */}
        <div>
          <label className="text-[12px] text-gray-500 mb-1.5 flex items-center gap-1 font-medium">
            <Store size={11} className="text-gray-400" /> 가게 이름
          </label>
          <input type="text" value={storeInfo.name} onChange={e => setStoreInfo({ ...storeInfo, name: e.target.value })}
            placeholder="예: 전주 한옥마을 파전집"
            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-[13px] text-gray-900 bg-gray-50 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-200 transition-all" />
        </div>

        {/* 메뉴/상품 */}
        <div>
          <label className="text-[12px] text-gray-500 mb-1.5 flex items-center gap-1 font-medium">
            🍽️ 주요 메뉴 / 상품
          </label>
          <input type="text" value={storeInfo.menu} onChange={e => setStoreInfo({ ...storeInfo, menu: e.target.value })}
            placeholder="예: 파전, 막걸리, 냉면"
            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-[13px] text-gray-900 bg-gray-50 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-200 transition-all" />
        </div>

        {/* 지역 */}
        <div>
          <label className="text-[12px] text-gray-500 mb-1.5 flex items-center gap-1 font-medium">
            <MapPin size={11} className="text-gray-400" /> 지역
          </label>
          <select value={storeInfo.region} onChange={e => setStoreInfo({ ...storeInfo, region: e.target.value })}
            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-[13px] text-gray-900 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200 transition-all">
            {regions.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>
      </div>

      <button onClick={onAnalyze} disabled={isAnalyzing}
        className="w-full bg-gray-900 text-white font-medium py-3 rounded-lg text-[14px] hover:bg-gray-800 transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-sm hover:shadow-md">
        {isAnalyzing ? (
          <>
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            분석 중...
          </>
        ) : (
          <>
            <Zap size={15} /> 날씨 분석 시작
          </>
        )}
      </button>
    </div>
  );
}
