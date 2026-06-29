import { Database } from "lucide-react";

const sources = [
  { name: "기상청 단기예보 API", desc: "전북 주요도시 예보 1시간 단위" },
  { name: "전북 빅데이터 허브", desc: "상권 유동인구 · 업종별 매출" },
  { name: "소상공인 상권정보", desc: "업종별 밀집도 트렌드" },
  { name: "전북 지원사업", desc: "업종/매출/창업연차 매칭" },
];

export default function DataSourceFooter() {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-5">
      <div className="flex items-center gap-1.5 mb-3">
        <Database size={15} className="text-gray-500" />
        <h3 className="text-[15px] font-semibold text-gray-900">공공데이터 연동</h3>
      </div>
      <div className="grid grid-cols-2 gap-2.5">
        {sources.map((src, i) => (
          <div key={i} className="bg-gray-50 rounded-lg p-3">
            <span className="text-[13px] font-medium text-gray-800">{src.name}</span>
            <p className="text-[12px] text-gray-500 mt-0.5">{src.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
