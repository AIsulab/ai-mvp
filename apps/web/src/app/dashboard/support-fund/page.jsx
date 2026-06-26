import { useState } from "react";
import { Gift, ExternalLink, Search } from "lucide-react";
import { Button, Card, Input, PillSelector, Badge } from "../../../components/ui";
import { businessTypes } from "../../../constants/businessTypes";

const allFunds = [
  { id: 1, name: "2026년 소상공인 경영안정 바우처", org: "소상공인시장진흥공단", amount: "연 최대 25만원", rate: "무상 지원", deadline: "2026.11.30", desc: "전기·가스·수도요금, 4대 보험료 등 고정비 부담 완화를 위한 바우처 지급", category: "바우처", types: ["카페","식당/한식","치킨/배달","베이커리","편의점","미용실","옷가게","기타"], tags: ["매출 1.04억 미만", "전국"], status: "신청중", url: "https://www.sbiz24.kr" },
  { id: 2, name: "소상공인 대환대출 및 일반경영안정자금", org: "중소벤처기업부", amount: "최대 7,000만원", rate: "변동 금리", deadline: "예산 소진 시", desc: "고금리 대출 이자 부담 완화 및 사업 운영 자금 융자 지원", category: "융자", types: ["카페","식당/한식","치킨/배달","베이커리","편의점","미용실","옷가게","기타"], tags: ["저신용자 가능", "상시 신청"], status: "상시", url: "https://www.sbiz24.kr/front/loan/loanIntro.do" },
  { id: 3, name: "스마트상점 기술보급사업 (디지털 전환)", org: "소상공인시장진흥공단", amount: "최대 500만원", rate: "국비 70% 지원", deadline: "2026.08.30", desc: "AI, 키오스크, 서빙로봇 등 스마트기술 도입 비용 지원", category: "보조금", types: ["카페","식당/한식","치킨/배달","베이커리"], tags: ["디지털 전환", "선착순"], status: "마감임박", url: "https://www.sbiz.or.kr/smst/main.do" },
  { id: 4, name: "2026 강한 소상공인 성장지원", org: "소상공인시장진흥공단", amount: "최대 1억원", rate: "무상 지원", deadline: "2026.09.15", desc: "유망 소상공인의 스케일업 및 혁신 제품 발굴 지원", category: "보조금", types: ["카페","식당/한식","베이커리","옷가게","기타"], tags: ["사업화 자금", "경쟁형"], status: "예정", url: "https://www.bizinfo.go.kr" },
  { id: 5, name: "전북특별자치도 소상공인 특례보증", org: "전북신용보증재단", amount: "최대 3,000만원", rate: "연 2.0% 이자지원", deadline: "2026.10.31", desc: "전북 소재 소상공인의 경영 안정을 위한 저금리 특례보증 및 이자 지원", category: "지역 지원", types: ["카페","식당/한식","치킨/배달","베이커리","편의점","미용실","옷가게","기타"], tags: ["전북 소재", "이자 보전"], status: "신청중", url: "https://www.jbshinbo.co.kr" },
  { id: 6, name: "희망리턴패키지 (재기 지원)", org: "소상공인시장진흥공단", amount: "최대 600만원", rate: "무상 지원", deadline: "상시 운영", desc: "경영위기 소상공인 대상 점포 철거비 지원 및 재창업 사업화 자금 지원", category: "재기지원", types: ["카페","식당/한식","치킨/배달","베이커리","편의점","미용실","옷가게","기타"], tags: ["폐업 예정자", "재창업"], status: "상시", url: "https://hope.sbiz.or.kr" },
];

const categoryBadge = { 융자: "blue", 보조금: "green", 바우처: "purple", "지역 지원": "orange", 재기지원: "red" };
const statusDot = { 신청중: "bg-green-500", 마감임박: "bg-orange-500", 상시: "bg-blue-500", 예정: "bg-gray-500" };

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
          <Badge color="teal">실제 공공기관 데이터</Badge>
        </div>
        <p className="text-sm text-gray-500">업종을 선택하면 지금 신청 가능한 정부 및 공공기관 지원사업을 보여드립니다.</p>
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
                  <Badge color={categoryBadge[fund.category] || "gray"}>{fund.category}</Badge>
                  <span className="flex items-center gap-1 text-xs text-gray-500">
                    <div className={`w-1.5 h-1.5 rounded-full ${statusDot[fund.status] || "bg-gray-500"}`}></div>
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
              <a 
                href={fund.url || "#"} 
                target="_blank" 
                rel="noopener noreferrer"
                onClick={(e) => {
                  if (!fund.url) {
                    e.preventDefault();
                    alert('현재 해당 기관의 접수 페이지를 준비 중입니다. 잠시 후 다시 시도해주세요.');
                  }
                }}
                className="inline-block"
              >
                <Button variant="primary" size="sm" className="pointer-events-none">
                  <ExternalLink size={10} /> 신청하기
                </Button>
              </a>
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
