import { Zap } from "lucide-react";
import { Input, Select, Button } from "../../../components/ui";
import { businessTypes, regions } from "../../../constants/businessTypes";

export default function StoreInfoForm({ storeInfo, setStoreInfo, onAnalyze, isAnalyzing }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-5 md:p-6 mb-5 md:mb-6 animate-slide-up">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-sm font-semibold text-gray-900">내 가게 정보</h2>
          <p className="text-xs text-gray-400 mt-0.5">한 번만 입력하세요</p>
        </div>
      </div>
      <div className="grid grid-cols-2 md:flex md:flex-row gap-3 md:gap-4 items-end">
        <div className="w-full">
          <Select label="업종" value={storeInfo.type} onChange={e => setStoreInfo({ ...storeInfo, type: e.target.value })} options={businessTypes} placeholder="" />
        </div>
        <div className="w-full">
          <Input label="가게 이름" value={storeInfo.name} onChange={e => setStoreInfo({ ...storeInfo, name: e.target.value })} />
        </div>
        <div className="col-span-2 md:flex-[1.5] w-full">
          <Input label="주요 메뉴/상품" value={storeInfo.menu} onChange={e => setStoreInfo({ ...storeInfo, menu: e.target.value })} />
        </div>
        <div className="w-full">
          <Select label="지역" value={storeInfo.region} onChange={e => setStoreInfo({ ...storeInfo, region: e.target.value })} options={regions} placeholder="" />
        </div>
        <div className="col-span-2 md:col-span-1 w-full">
          <Button variant="primary" onClick={onAnalyze} disabled={isAnalyzing} className="w-full md:w-auto">
            {isAnalyzing ? "분석 중..." : <><Zap size={14} /> 날씨 분석 시작</>}
          </Button>
        </div>
      </div>
    </div>
  );
}
