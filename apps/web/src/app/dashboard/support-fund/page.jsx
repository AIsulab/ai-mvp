import { useState } from "react";
import { Gift, ExternalLink, Search } from "lucide-react";
import { Button, Card, Input, PillSelector, Badge } from "../../../components/ui";
import { businessTypes } from "../../../constants/businessTypes";

const allFunds = [
  { id: 1, name: "전북 소상공인 경영안정자금", org: "전북특별자치도", amount: "최대 3,000만원", rate: "연 2.5%", deadline: "2025.12.31", desc: "전북 소재 소상공인 대상 경영안정 및 시설개선 자금 지원", category: "융자", types: ["카페","식당/한식","치킨/배달","베이커리","편의점","미용실","옷가게","기타"], tags: ["창업 1년 이상", "전북 소재"], status: "신청중" },
  { id: 2, name: "소상공인 디지털 전환 지원사업", org: "소상공인진흥공단", amount: "최대 200만원", rate: "무상 지원", deadline: "2025.09.30", desc: "AI, 키오스크, POS 등 디지털 전환을 위한 장비·솔루션 도입 비용 지원", category: "보조금", types: ["카페","식당/한식","치킨/배달","베이커리","편의점","기타"], tags: ["매출 4.8억 이하", "5인 미만"], status: "신청중" },
  { id: 3, name: "전북형 청년 창업 패키지", org: "전북창조경제혁신센터", amount: "최대 1,000만원", rate: "무상 지원", deadline: "2025.08.15", desc: "전북 거주 만 39세 이하 청년 예비창업자 또는 창업 3년 이내 사업자 대상 창업 초기 비용 지원", category: "보조금", types: ["카페","식당/한식","베이커리","옷가게","기타"], tags: ["만 39세 이하", "창업 3년 이내"], status: "마감임박" },
  { id: 4, name: "소상공인 마케팅 바우처 사업", org: "소상공인진흥공단", amount: "최대 100만원", rate: "무상 지원", deadline: "2025.11.30", desc: "SNS 광고, 블로그 마케팅, 배달앱 광고비 등 온라인 마케팅 비용 일부 지원", category: "바우처", types: ["카페","식당/한식","치킨/배달","베이커리","미용실","옷가게","기타"], tags: ["전국 소상공인", "사업자등록 필수"], status: "신청중" },
  { id: 5, name: "전주 골목상권 활성화 지원", org: "전주시청", amount: "가맹비 지원", rate: "최대 50만원", deadline: "2025.10.31", desc: "전주시 골목상권 내 소상공인 배달앱 가맹비 및 수수료 일부 지원", category: "지역 지원", types: ["카페","식당/한식","치킨/배달","베이커리","편의점"], tags: ["전주시 소재", "배달앱 운영"], status: "신청중" },
  { id: 6, name: "새출발기금 (폐업 소상공인 재기 지원)", org: "캠코(한국자산관리공사)", amount: "채무 조정", rate: "최대 90% 감면", deadline: "상시 운영", desc: "코로나 이후 어려움을 겪은 소상공인의 금융 채무를 조정하고 재기를 지원하는 특별 프로그램", category: "재기지원", types: ["카페","식당/한식","치킨/배달","베이커리","편의점","미용실","옷가게","기타"], tags: ["부채 보유 사업자", "상시 신청"], status: "상시" },
];

const categoryBadge = { 융자: "blue", 보조금: "green", 바우처: "purple", "지역 지원": "orange", 재기지원: "red" };
const statusDot = { 신청중: "bg-green-500", 마감임박: "bg-orange-500", 상시: "bg-blue-500" };

export default function SupportFundPage() {
  const [businessType, setBusinessType] = useState("");
  const [search, setSearch] = useState("");

  const filtered = allFunds.filter((f) => {
    const matchType = !businessType || f.types.includes(businessType);
    const matchSearch = !search || f.name.includes(search) || f.desc.includes(search);
    return matchType && matchSearch;
  });

  return (
    <div className="max-w-3xl mx-auto animate-fade-in">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <h1 className="text-xl font-semibold text-gray-900 tracking-tight">지원금 자동 매칭</h1>
          <Badge color="teal">전북 특화</Badge>
        </div>
        <p className="text-sm text-gray-500">업종을 선택하면 지금 신청 가능한 정부 지원사업을 자동으로 매칭해드립니다.</p>
      </div>

      <Card className="mb-5">
        <PillSelector label="내 업종 선택" options={["전체", ...businessTypes]} value={businessType || "전체"} onChange={(v) => setBusinessType(v === "전체" ? "" : v)} />
        <div className="relative mt-4">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="지원사업명 또는 키워드 검색..."
            className="w-full border border-gray-200 rounded-lg pl-9 pr-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent hover:border-gray-300 transition-colors" />
        </div>
      </Card>

      <div className="mb-3 flex items-center justify-between">
        <span className="text-sm font-semibold text-gray-900">매칭된 지원사업</span>
        <span className="text-xs text-gray-400">{filtered.length}건 검색됨</span>
      </div>

      <div className="space-y-3">
        {filtered.map((fund) => (
          <Card key={fund.id} className="hover:border-gray-300 transition-colors">
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <Badge color={categoryBadge[fund.category]}>{fund.category}</Badge>
                  <span className="flex items-center gap-1 text-xs text-gray-500">
                    <div className={`w-1.5 h-1.5 rounded-full ${statusDot[fund.status]}`}></div>
                    {fund.status}
                  </span>
                </div>
                <h3 className="text-sm font-semibold text-gray-900">{fund.name}</h3>
                <p className="text-xs text-gray-500 mt-0.5">{fund.org}</p>
              </div>
              <div className="text-right shrink-0">
                <div className="text-sm font-semibold text-gray-900">{fund.amount}</div>
                <div className="text-xs text-gray-400">{fund.rate}</div>
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-3 leading-relaxed">{fund.desc}</p>
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div className="flex flex-wrap gap-1.5">
                {fund.tags.map((tag, i) => (<Badge key={i} color="gray">{tag}</Badge>))}
                <Badge color="gray">마감 {fund.deadline}</Badge>
              </div>
              <Button variant="primary" size="sm"><ExternalLink size={10} /> 신청하기</Button>
            </div>
          </Card>
        ))}
        {filtered.length === 0 && (
          <Card className="p-10 text-center">
            <Gift size={28} className="text-gray-300 mx-auto mb-3" />
            <p className="text-sm text-gray-500">조건에 맞는 지원사업이 없습니다.</p>
            <p className="text-xs text-gray-400 mt-1">업종 필터를 변경해보세요.</p>
          </Card>
        )}
      </div>
    </div>
  );
}
