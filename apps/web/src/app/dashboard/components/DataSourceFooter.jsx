import { Database } from "lucide-react";
import { Card, Badge } from "../../../components/ui";

const sources = [
  { name: "기상청 단기예보 API", desc: "전주/익산/군산 등 전북 주요도시 예보 1시간 단위", color: "bg-green-500" },
  { name: "전북 빅데이터 허브", desc: "전북 지역 상권 유동인구 데이터 · 업종별 매출 통계", color: "bg-green-500" },
  { name: "소상공인 상권정보", desc: "소상공인시장진흥공단 API · 업종별 밀집도 트렌드", color: "bg-green-500" },
  { name: "전북 소상공인 지원사업", desc: "전북특별자치도 · 업종/매출/창업연차 기반 매칭", color: "bg-primary" },
];

export default function DataSourceFooter() {
  return (
    <Card className="mb-8 md:mb-10">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
          <Database className="text-gray-400" size={15} /> 전북 공공데이터 연동 현황
        </h3>
        <Badge color="blue">연동 완료</Badge>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {sources.map((src, i) => (
          <div key={i} className="border border-gray-100 bg-gray-50 p-4 rounded-xl hover:border-gray-200 transition-colors">
            <div className="flex items-center gap-1.5 mb-1.5">
              <span className={`w-2 h-2 rounded-full ${src.color}`}></span>
              <span className="text-xs font-semibold text-gray-900">{src.name}</span>
            </div>
            <p className="text-[10px] text-gray-500 leading-tight">{src.desc}</p>
          </div>
        ))}
      </div>
    </Card>
  );
}
