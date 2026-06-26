import { useState, useEffect } from "react";
import { Gift, ExternalLink, Search, Loader2 } from "lucide-react";
import { Button, Card, Input, PillSelector, Badge } from "../../../components/ui";
import { businessTypes } from "../../../constants/businessTypes";

const categoryBadge = { 융자: "blue", 보조금: "green", 바우처: "purple", "지역 지원": "orange", 재기지원: "red" };
const statusDot = { 신청중: "bg-green-500", 마감임박: "bg-orange-500", 상시: "bg-blue-500", 예정: "bg-gray-500" };

export default function SupportFundPage() {
  const [businessType, setBusinessType] = useState("");
  const [search, setSearch] = useState("");
  const [funds, setFunds] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadFunds() {
      try {
        const res = await fetch('/api/funds');
        const data = await res.json();
        if (data.success) {
          setFunds(data.data);
        }
      } catch (error) {
        console.error("지원금 정보 로드 실패", error);
      } finally {
        setIsLoading(false);
      }
    }
    loadFunds();
  }, []);

  const filtered = funds.filter((f) => {
    const matchType = !businessType || f.types.includes(businessType);
    const matchSearch = !search || f.name.includes(search) || f.desc.includes(search);
    return matchType && matchSearch;
  });

  return (
    <div className="max-w-3xl mx-auto animate-fade-in">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <h1 className="text-xl font-semibold text-gray-900 tracking-tight">지원금 자동 매칭</h1>
          <Badge color="teal">실시간 공공데이터 연동</Badge>
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
        <span className="text-xs text-gray-400">{isLoading ? "불러오는 중..." : `${filtered.length}건 검색됨`}</span>
      </div>

      {isLoading ? (
        <Card className="p-10 text-center flex flex-col items-center justify-center">
          <Loader2 size={28} className="text-primary animate-spin mb-3" />
          <p className="text-sm text-gray-500">공공기관에서 최신 지원금 정보를 가져오는 중입니다...</p>
        </Card>
      ) : (
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
      )}
    </div>
  );
}
