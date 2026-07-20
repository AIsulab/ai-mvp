import { useState, useEffect, useCallback } from "react";
import { Search, RefreshCw, Users, TrendingUp, Store, Wifi, Database, MapPin, BarChart2 } from "lucide-react";
import { Card, Badge, Button } from "../../../components/ui";
import StatCard from "./components/StatCard";
import StoreList from "./components/StoreList";
import WifiList from "./components/WifiList";
import AiTip from "./components/AiTip";

const REGIONS = [
  { label: "전주", cx: "127.148", cy: "35.818" },
  { label: "군산", cx: "126.716", cy: "35.968" },
  { label: "익산", cx: "126.957", cy: "35.935" },
  { label: "정읍", cx: "126.856", cy: "35.560" },
  { label: "남원", cx: "127.488", cy: "35.416" },
  { label: "김제", cx: "126.856", cy: "35.788" },
];

export default function MarketAnalysisPage() {
  const [region, setRegion] = useState(REGIONS[0]);
  const [searchQuery, setSearchQuery] = useState("");
  const [stores, setStores] = useState([]);
  const [wifis, setWifis] = useState([]);
  const [loading, setLoading] = useState(true);
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async (target) => {
    setLoading(true);
    setError(null);
    try {
      const [sgisRes, wifiRes, weatherRes] = await Promise.allSettled([
        fetch(`/api/sgis?radius=1000&cx=${target.cx}&cy=${target.cy}`),
        fetch("/api/wifi"),
        fetch("/api/weather"),
      ]);

      if (sgisRes.status === "fulfilled" && sgisRes.value.ok) {
        const sgisData = await sgisRes.value.json();
        if (sgisData?.body?.items) setStores(sgisData.body.items);
      }

      if (wifiRes.status === "fulfilled" && wifiRes.value.ok) {
        const wifiData = await wifiRes.value.json();
        if (wifiData?.data?.items) setWifis(wifiData.data.items);
      }

      if (weatherRes.status === "fulfilled" && weatherRes.value.ok) {
        const weatherData = await weatherRes.value.json();
        setWeather(weatherData);
      }
    } catch (e) {
      console.error("Data fetch error:", e);
      setError("데이터를 불러오는 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData(region);
  }, [region, fetchData]);

  const handleSearch = () => {
    const found = REGIONS.find(r => searchQuery.includes(r.label));
    if (found) {
      setRegion(found);
      setSearchQuery("");
    }
  };

  // 스마트 통계 계산 (실제 API 데이터 기반)
  const storeCount = stores.length;
  const wifiCount = wifis.length;
  const categoryMap = {};
  stores.forEach(s => {
    const cat = s.indsSclsNm || s.indsMclsNm || "기타";
    categoryMap[cat] = (categoryMap[cat] || 0) + 1;
  });
  const topCategory = Object.entries(categoryMap).sort((a, b) => b[1] - a[1])[0];

  return (
    <div className="px-4 md:px-6 py-4 md:py-6 animate-fade-in">
      {/* ── 헤더 ── */}
      <div className="mb-5">
        <div className="flex items-center gap-2 mb-1 flex-wrap">
          <h1 className="text-[17px] font-bold text-gray-900 dark:text-white tracking-tight">상권 분석</h1>
          <Badge color="blue"><BarChart2 size={10} /> 실시간 데이터</Badge>
        </div>
        <p className="text-[13px] text-gray-500 dark:text-gray-400">
          공공데이터 기반으로 주변 상권 현황을 분석합니다.
        </p>
      </div>

      {/* ── 검색 & 지역 선택 ── */}
      <Card className="mb-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 flex items-center gap-2 bg-gray-50 dark:bg-gray-800 rounded-xl px-3 py-2.5 border border-gray-200 dark:border-gray-700 focus-within:border-blue-400 transition-colors">
            <Search size={15} className="text-gray-400 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder="지역 검색 (예: 전주, 군산, 익산)"
              className="flex-1 bg-transparent outline-none text-[13px] text-gray-900 dark:text-white placeholder-gray-400"
            />
            <Button variant="primary" size="sm" onClick={handleSearch} disabled={!searchQuery.trim()}>
              검색
            </Button>
          </div>
          <div className="flex gap-1.5 flex-wrap">
            {REGIONS.map((r) => (
              <button
                key={r.label}
                onClick={() => setRegion(r)}
                className={`px-3 py-2 rounded-xl text-[12px] font-semibold transition-all ${
                  region.label === r.label
                    ? "bg-gray-900 text-white dark:bg-white dark:text-gray-900 shadow-sm"
                    : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* ── 핵심 통계 카드 ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
        <StatCard
          icon={Users}
          label="주변 상가"
          value={storeCount}
          sub="개소"
          color="blue"
          loading={loading}
        />
        <StatCard
          icon={Wifi}
          label="와이파이존"
          value={wifiCount}
          sub="개소"
          color="green"
          loading={loading}
        />
        <StatCard
          icon={Store}
          label="주요 업종"
          value={topCategory ? topCategory[0] : "--"}
          sub={topCategory ? `${topCategory[1]}개소` : ""}
          color="purple"
          loading={loading}
        />
        <StatCard
          icon={TrendingUp}
          label="현재 날씨"
          value={weather?.condition || "--"}
          sub={weather?.temperature || ""}
          color="orange"
          loading={loading}
        />
      </div>

      {/* ── 메인 콘텐츠: 2컬럼 ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        {/* 상가업소 리스트 */}
        <Card>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <Store size={13} className="text-blue-500" />
              </div>
              <h3 className="text-[14px] font-bold text-gray-900 dark:text-white">주변 상가업소</h3>
            </div>
            <span className="text-[11px] font-semibold text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-full">
              {storeCount}개
            </span>
          </div>
          <StoreList stores={stores} loading={loading} />
        </Card>

        {/* 와이파이존 리스트 */}
        <Card>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-green-500/10 flex items-center justify-center">
                <Wifi size={13} className="text-green-500" />
              </div>
              <h3 className="text-[14px] font-bold text-gray-900 dark:text-white">무료 와이파이존</h3>
            </div>
            <span className="text-[11px] font-semibold text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-full">
              {wifiCount}개
            </span>
          </div>
          <WifiList wifis={wifis} loading={loading} />
        </Card>
      </div>

      {/* ── 업종별 분석 카드 ── */}
      {Object.keys(categoryMap).length > 0 && (
        <Card className="mb-4">
          <div className="flex items-center gap-2 mb-3">
            <BarChart2 size={14} className="text-purple-500" />
            <h3 className="text-[14px] font-bold text-gray-900 dark:text-white">업종별 분포</h3>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
            {Object.entries(categoryMap)
              .sort((a, b) => b[1] - a[1])
              .slice(0, 8)
              .map(([cat, count], i) => (
                <div key={i} className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-3 text-center">
                  <div className="text-[13px] font-bold text-gray-900 dark:text-white mb-0.5">{cat}</div>
                  <div className="text-[11px] text-gray-500 dark:text-gray-400">{count}개소</div>
                  <div className="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full mt-2 overflow-hidden">
                    <div
                      className="h-full bg-blue-500 rounded-full transition-all"
                      style={{ width: `${(count / storeCount) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
          </div>
        </Card>
      )}

      {/* ── AI 전략 팁 ── */}
      <AiTip weather={weather} />

      {/* ── 데이터 출처 ── */}
      <div className="mt-4 flex items-center gap-2 text-[11px] text-gray-400 dark:text-gray-500">
        <Database size={12} />
        <span>공공데이터포털(SGIS) · 전주시 공공와이파이 · 기상청 단기예보</span>
        <button
          onClick={() => fetchData(region)}
          disabled={loading}
          className="ml-auto flex items-center gap-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
        >
          <RefreshCw size={11} className={loading ? "animate-spin" : ""} />
          새로고침
        </button>
      </div>

      {error && (
        <div className="mt-3 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-xs text-red-600 dark:text-red-400">
          {error}
        </div>
      )}
    </div>
  );
}
