import { Zap } from "lucide-react";
import { businessTypes, regions } from "../../../constants/businessTypes";

export default function StoreInfoForm({ storeInfo, setStoreInfo, onAnalyze, isAnalyzing }) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-[13px] font-semibold text-gray-900">내 가게 정보</h2>
        <span className="text-[10px] text-gray-400">한 번만 입력</span>
      </div>
      <div className="grid grid-cols-2 md:flex md:flex-row gap-2.5 items-end">
        <div className="w-full">
          <label className="text-[10px] text-gray-400 mb-1 block">업종</label>
          <select value={storeInfo.type} onChange={e => setStoreInfo({ ...storeInfo, type: e.target.value })}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-[12px] text-gray-900 bg-gray-50 focus:outline-none focus:ring-1 focus:ring-gray-300">
            {businessTypes.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div className="w-full">
          <label className="text-[10px] text-gray-400 mb-1 block">가게 이름</label>
          <input type="text" value={storeInfo.name} onChange={e => setStoreInfo({ ...storeInfo, name: e.target.value })}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-[12px] text-gray-900 bg-gray-50 focus:outline-none focus:ring-1 focus:ring-gray-300" />
        </div>
        <div className="col-span-2 md:flex-[1.5] w-full">
          <label className="text-[10px] text-gray-400 mb-1 block">메뉴/상품</label>
          <input type="text" value={storeInfo.menu} onChange={e => setStoreInfo({ ...storeInfo, menu: e.target.value })}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-[12px] text-gray-900 bg-gray-50 focus:outline-none focus:ring-1 focus:ring-gray-300" />
        </div>
        <div className="w-full">
          <label className="text-[10px] text-gray-400 mb-1 block">지역</label>
          <select value={storeInfo.region} onChange={e => setStoreInfo({ ...storeInfo, region: e.target.value })}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-[12px] text-gray-900 bg-gray-50 focus:outline-none focus:ring-1 focus:ring-gray-300">
            {regions.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>
        <div className="col-span-2 md:col-span-1 w-full">
          <button onClick={onAnalyze} disabled={isAnalyzing}
            className="w-full bg-gray-900 text-white font-medium py-2 rounded-lg text-[12px] hover:bg-gray-800 transition-colors disabled:opacity-50 flex items-center justify-center gap-1.5">
            {isAnalyzing ? "분석 중..." : <><Zap size={12} /> 분석 시작</>}
          </button>
        </div>
      </div>
    </div>
  );
}
