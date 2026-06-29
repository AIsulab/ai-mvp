import { useState } from "react";
import { Zap, Store, MapPin, UtensilsCrossed, ChevronDown } from "lucide-react";
import { businessTypes, regions } from "../../../constants/businessTypes";

export default function StoreInfoForm({ storeInfo, setStoreInfo, onAnalyze, isAnalyzing }) {
  const [focused, setFocused] = useState(null);

  const inputClass = (field) => `
    w-full border rounded-lg px-4 py-3 text-[14px] text-gray-900 transition-all outline-none
    ${focused === field
      ? 'border-gray-900 ring-2 ring-gray-100 bg-white'
      : 'border-gray-200 bg-gray-50 hover:border-gray-300'
    }
  `;

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-5 md:p-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        <div className="w-9 h-9 rounded-lg bg-gray-900 flex items-center justify-center">
          <Store size={16} className="text-white" />
        </div>
        <div>
          <h2 className="text-[15px] font-semibold text-gray-900">내 가게 정보</h2>
          <p className="text-[12px] text-gray-400">한 번만 입력하면 AI가 자동으로 마케팅합니다</p>
        </div>
      </div>

      {/* Form */}
      <div className="space-y-4 mb-5">
        {/* Row 1: 업종 + 지역 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-[12px] text-gray-500 mb-1.5 flex items-center gap-1 font-medium">
              <UtensilsCrossed size={12} className="text-gray-400" /> 업종
            </label>
            <div className="relative">
              <select
                value={storeInfo.type}
                onChange={e => setStoreInfo({ ...storeInfo, type: e.target.value })}
                onFocus={() => setFocused('type')}
                onBlur={() => setFocused(null)}
                className={`${inputClass('type')} appearance-none cursor-pointer pr-10`}
              >
                {businessTypes.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
              <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
          </div>

          <div>
            <label className="text-[12px] text-gray-500 mb-1.5 flex items-center gap-1 font-medium">
              <MapPin size={12} className="text-gray-400" /> 지역
            </label>
            <div className="relative">
              <select
                value={storeInfo.region}
                onChange={e => setStoreInfo({ ...storeInfo, region: e.target.value })}
                onFocus={() => setFocused('region')}
                onBlur={() => setFocused(null)}
                className={`${inputClass('region')} appearance-none cursor-pointer pr-10`}
              >
                {regions.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
              <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Row 2: 가게 이름 */}
        <div>
          <label className="text-[12px] text-gray-500 mb-1.5 flex items-center gap-1 font-medium">
            <Store size={12} className="text-gray-400" /> 가게 이름
          </label>
          <input
            type="text"
            value={storeInfo.name}
            onChange={e => setStoreInfo({ ...storeInfo, name: e.target.value })}
            onFocus={() => setFocused('name')}
            onBlur={() => setFocused(null)}
            placeholder="예: 전주 한옥마을 파전집"
            className={`${inputClass('name')} placeholder-gray-300`}
          />
        </div>

        {/* Row 3: 메뉴/상품 */}
        <div>
          <label className="text-[12px] text-gray-500 mb-1.5 flex items-center gap-1 font-medium">
            🍽️ 주요 메뉴 / 상품
          </label>
          <input
            type="text"
            value={storeInfo.menu}
            onChange={e => setStoreInfo({ ...storeInfo, menu: e.target.value })}
            onFocus={() => setFocused('menu')}
            onBlur={() => setFocused(null)}
            placeholder="예: 파전, 막걸리, 냉면"
            className={`${inputClass('menu')} placeholder-gray-300`}
          />
        </div>
      </div>

      {/* Submit */}
      <button
        onClick={onAnalyze}
        disabled={isAnalyzing}
        className="w-full bg-gray-900 text-white font-medium py-3.5 rounded-lg text-[15px] hover:bg-gray-800 transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-sm hover:shadow-md active:scale-[0.99]"
      >
        {isAnalyzing ? (
          <>
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            분석 중...
          </>
        ) : (
          <>
            <Zap size={16} /> 날씨 분석 시작
          </>
        )}
      </button>
    </div>
  );
}
