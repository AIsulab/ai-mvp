import { Zap } from "lucide-react";
import { Input, Select, Button } from "../../../components/ui";
import { businessTypes, regions } from "../../../constants/businessTypes";

export default function StoreInfoForm({ storeInfo, setStoreInfo, onAnalyze, isAnalyzing }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6 animate-slide-up">
      <div className="flex items-center gap-2 mb-4">
        <h2 className="text-sm font-semibold text-gray-900">내 가게 정보</h2>
        <span className="text-xs text-gray-500">(한 번만 입력하세요)</span>
      </div>
      <div className="flex flex-col md:flex-row gap-4 items-end">
        <div className="flex-1 w-full">
          <Select
            label="업종"
            value={storeInfo.type}
            onChange={e => setStoreInfo({ ...storeInfo, type: e.target.value })}
            options={businessTypes}
            placeholder=""
          />
        </div>
        <div className="flex-1 w-full">
          <Input
            label="가게 이름"
            value={storeInfo.name}
            onChange={e => setStoreInfo({ ...storeInfo, name: e.target.value })}
          />
        </div>
        <div className="flex-[1.5] w-full">
          <Input
            label="주요 메뉴/상품"
            value={storeInfo.menu}
            onChange={e => setStoreInfo({ ...storeInfo, menu: e.target.value })}
          />
        </div>
        <div className="flex-1 w-full">
          <Select
            label="지역"
            value={storeInfo.region}
            onChange={e => setStoreInfo({ ...storeInfo, region: e.target.value })}
            options={regions}
            placeholder=""
          />
        </div>
        <Button
          variant="accent"
          onClick={onAnalyze}
          disabled={isAnalyzing}
          className="w-full md:w-auto whitespace-nowrap"
        >
          {isAnalyzing ? "분석 중..." : <><Zap size={14} /> 날씨 분석 시작</>}
        </Button>
      </div>
    </div>
  );
}
