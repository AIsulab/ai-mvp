import { Link } from 'react-router-dom';
import { Cloud, BarChart2, Star, MapPin, Gift, ArrowRight, Zap, ChevronRight, Store, Users, TrendingUp, Shield } from "lucide-react";
import { Button, Badge } from "../components/ui";

const features = [
  {
    icon: Cloud,
    title: "날씨 마케팅 자동화",
    desc: "기상청 단기예보 API와 연동해 날씨 변화에 따라 업종별 최적 마케팅 문구를 실시간 자동 생성합니다.",
    color: "green",
    items: ["기상청 단기예보 API 실시간 연동", "날씨 × 업종 매칭 엔진", "원클릭 문구 복사 & 배포"],
  },
  {
    icon: BarChart2,
    title: "AI 상권 분석",
    desc: "전북 유동인구·매출·폐업률 공공데이터를 결합해 내 가게의 상권 경쟁력과 유망 메뉴를 분석합니다.",
    color: "pink",
    items: ["전북 소상공인 현황 데이터 연동", "경쟁 강도 & 업종 포화도 분석", "최적 영업 시간대 추천"],
  },
  {
    icon: Zap,
    title: "SNS 콘텐츠 생성",
    desc: "업종·메뉴·오늘 날씨를 입력하면 인스타그램 게시글, 해시태그, 스토리 아이디어를 즉시 완성합니다.",
    color: "pink",
    items: ["인스타그램 / 블로그 문구 생성", "업종별 해시태그 자동 추가", "날씨 감성 톤 자동 적용"],
  },
  {
    icon: Star,
    title: "리뷰 답변 자동화",
    desc: "고객 리뷰를 붙여넣으면 AI가 상황에 맞는 감사·개선 답변을 즉시 작성하고 개선 포인트를 도출합니다.",
    color: "orange",
    items: ["긍정/부정 리뷰 자동 분류", "맞춤 답변 3가지 옵션 제공", "개선점 리포트 자동 생성"],
  },
  {
    icon: MapPin,
    title: "지역 데이터 추천",
    desc: "전북 특화 소비 트렌드와 계절·이벤트 데이터를 결합해 지역 맞춤형 경영 인사이트를 제공합니다.",
    color: "green",
    items: ["전북 지역 소비 트렌드 분석", "계절별 인기 메뉴 추천", "AI 경영 제안서 자동 작성"],
  },
  {
    icon: Gift,
    title: "지원금 자동 매칭",
    desc: "업종·매출·창업연차를 입력하면 지금 바로 신청 가능한 전북 소상공인 지원사업을 자동으로 추천합니다.",
    color: "orange",
    items: ["전북 지원사업 DB 실시간 업데이트", "신청 자격 자동 매칭", "신청 기한 알림 서비스"],
  },
];

const colorMap = {
  green: { bg: '#D4F6D0', border: '#33A927', text: '#33A927' },
  pink: { bg: '#FFDFE8', border: '#FF749B', text: '#FF749B' },
  orange: { bg: '#FFEDB4', border: '#FF9A26', text: '#FF9A26' },
};

const stats = [
  { value: "5가지", label: "AI 핵심 기능" },
  { value: "실시간", label: "기상청 API 연동" },
  { value: "전북 특화", label: "공공데이터 활용" },
  { value: "1인 개발", label: "경량 MVP" },
];

const partners = [
  "기상청 공식 API", "전북 공공데이터", "소상공인시장진흥공단", "전북특별자치도", "MiMo AI"
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* NavBar */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-main-content mx-auto px-4 md:px-5 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-navy flex items-center justify-center shadow-sm">
              <Store size={18} className="text-white" />
            </div>
            <span className="text-lg font-bold text-navy tracking-tight">W-AI</span>
          </div>
          <div className="flex items-center gap-6">
            <a href="#features" className="text-sm text-gray-500 hover:text-navy transition-colors hidden md:block">기능</a>
            <a href="#engine" className="text-sm text-gray-500 hover:text-navy transition-colors hidden md:block">날씨 엔진</a>
            <Link to="/dashboard">
              <Button variant="primary" size="md">
                시작하기 <ArrowRight size={14} />
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="hero-gradient text-white relative overflow-hidden">
        <div className="max-w-main-content mx-auto px-4 md:px-5 py-16 md:py-24">
          <div className="max-w-[890px] mx-auto text-center">
            <div className="inline-flex items-center gap-1.5 bg-white/15 text-white/90 px-4 py-1.5 rounded-full text-sm font-medium mb-6 backdrop-blur-sm">
              <Cloud size={14} />
              기상청 공식 API · 전북 공공데이터 실시간 연동
            </div>
            <h1 className="text-4xl md:text-[42px] font-extrabold mb-5 leading-[1.2] tracking-tight">
              사장님의 성공 이유,<br />
              <span className="text-white">W-AI</span>
            </h1>
            <p className="text-white/70 text-lg md:text-xl mb-4 leading-[1.6]">
              날씨 · 상권 · 리뷰 데이터를 AI가 자동 분석해
            </p>
            <p className="text-white font-semibold text-lg md:text-xl mb-10 leading-[1.6]">
              마케팅 문구부터 경영 인사이트까지 버튼 하나로 완성
            </p>
            <div className="flex items-center justify-center gap-4 flex-wrap">
              <Link to="/dashboard">
                <button className="bg-white text-navy font-semibold px-8 py-3.5 rounded-full text-sm hover:shadow-hero transition-all duration-200 hover:-translate-y-0.5">
                  무료로 시작하기 <ArrowRight size={16} className="inline ml-1" />
                </button>
              </Link>
              <a href="#features">
                <button className="bg-white/10 text-white font-medium px-8 py-3.5 rounded-full text-sm border border-white/20 hover:bg-white/20 transition-all duration-200">
                  기능 살펴보기
                </button>
              </a>
            </div>
          </div>

          {/* Stats Row */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-[890px] mx-auto">
            {stats.map((s, i) => (
              <div key={i} className="text-center">
                <div className="text-2xl md:text-3xl font-bold mb-1">{s.value}</div>
                <div className="text-sm text-white/60">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Partners Marquee */}
      <div className="border-y border-gray-100 bg-gray-50/50 overflow-hidden py-4">
        <div className="flex animate-marquee whitespace-nowrap">
          {[...partners, ...partners, ...partners].map((p, i) => (
            <div key={i} className="inline-flex items-center gap-2 mx-8 text-sm text-gray-400 font-medium">
              <div className="w-2 h-2 rounded-full bg-primary/30"></div>
              {p}
            </div>
          ))}
        </div>
      </div>

      {/* Features */}
      <section id="features" className="max-w-main-content mx-auto px-4 md:px-5 py-16 md:py-20">
        <div className="mb-12 text-center">
          <h2 className="text-2xl md:text-[28px] font-bold text-gray-900 tracking-tight mb-3">
            소상공인을 위한 AI 올인원 플랫폼
          </h2>
          <p className="text-gray-500 text-base md:text-lg max-w-[600px] mx-auto leading-[1.6]">
            프롬프트 작성 능력이 없어도, AI 설정을 몰라도 괜찮습니다.<br/>오직 사장님의 비즈니스에만 집중하세요.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((f, i) => {
            const colors = colorMap[f.color];
            return (
              <div
                key={i}
                className="rounded-[16px] border-[1.5px] p-6 hover:-translate-y-0.5 hover:shadow-card-lift transition-all duration-200 cursor-pointer group"
                style={{ backgroundColor: colors.bg + '20', borderColor: colors.border + '40' }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: colors.bg }}
                  >
                    <f.icon size={20} style={{ color: colors.text }} />
                  </div>
                  <span
                    className="text-xs font-semibold px-2.5 py-1 rounded-[8px]"
                    style={{ backgroundColor: colors.bg, color: colors.text }}
                  >
                    {f.color === 'green' ? '지역 특화' : f.color === 'pink' ? '일반 기능' : '고객 관리'}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2 tracking-tight">{f.title}</h3>
                <p className="text-sm text-gray-500 mb-4 leading-[1.6]">{f.desc}</p>
                <div className="space-y-2">
                  {f.items.map((item, j) => (
                    <div key={j} className="flex items-start gap-2 text-sm text-gray-600">
                      <span className="mt-0.5 shrink-0" style={{ color: colors.text }}>✓</span>
                      <span className="leading-[1.5]">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Weather-Driven Engine Highlight */}
      <section id="engine" className="bg-gray-50 border-y border-gray-100">
        <div className="max-w-main-content mx-auto px-4 md:px-5 py-16 md:py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
            <div>
              <span className="inline-flex items-center gap-1.5 bg-primary/10 text-primary px-3 py-1 rounded-[8px] text-xs font-semibold mb-4">
                Weather-Driven Engine
              </span>
              <h2 className="text-2xl md:text-[28px] font-bold text-gray-900 tracking-tight mb-4 leading-[1.35]">
                날씨가 바뀌면<br />마케팅도 자동으로 바뀝니다
              </h2>
              <p className="text-gray-500 text-sm md:text-base leading-[1.6] mb-6">
                기상청 단기예보 API와 MiMo AI를 결합한 독자적인 Weather-Driven 엔진. 맑음, 비, 눈, 폭염, 한파 등 날씨 조건을 실시간 감지해 업종별로 최적화된 마케팅 문구를 자동 생성합니다.
              </p>
              <div className="space-y-3">
                {[
                  { icon: "🌧️", weather: "비", example: '"오늘처럼 비 오는 날엔 따뜻한 순대국 한 그릇"', type: "국밥집" },
                  { icon: "🔥", weather: "폭염", example: '"이 더위엔 시원한 냉면으로 열기를 식혀요"', type: "식당" },
                  { icon: "❄️", weather: "눈", example: '"눈 오는 날의 낭만을 따뜻한 커피 한 잔과 함께"', type: "카페" },
                ].map((ex, i) => (
                  <div key={i} className="bg-white border border-gray-200 rounded-[12px] p-4 shadow-sm hover:shadow-md transition-all">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-semibold px-2.5 py-1 rounded-[8px] bg-gray-100 text-gray-700">{ex.icon} {ex.weather}</span>
                      <span className="text-gray-300 text-xs">+</span>
                      <span className="text-xs font-semibold px-2.5 py-1 rounded-[8px] bg-gray-100 text-gray-700">{ex.type}</span>
                    </div>
                    <p className="text-sm text-gray-700 tracking-tight leading-[1.5]">{ex.example}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white border border-gray-200 rounded-[16px] p-6 shadow-sm md:mt-8">
              <h3 className="text-base font-bold text-gray-900 mb-5 tracking-tight">날씨 조건별 마케팅 방향</h3>
              <div className="space-y-4">
                {[
                  { icon: "☀️", label: "맑음 · 고온", tags: ["청량함", "야외활동", "여름 특선"] },
                  { icon: "🌧️", label: "비", tags: ["따뜻함", "실내", "배달", "든든함"] },
                  { icon: "❄️", label: "눈", tags: ["낭만", "겨울 감성", "연말 특별"] },
                  { icon: "🌬️", label: "한파", tags: ["온기", "국물", "핫드링크"] },
                  { icon: "☁️", label: "흐림", tags: ["기분전환", "특별 할인", "에너지"] },
                ].map((row, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-7 flex justify-center text-lg shrink-0">{row.icon}</div>
                    <div className="w-20 text-xs font-medium text-gray-700 shrink-0">{row.label}</div>
                    <div className="flex gap-1.5 flex-wrap">
                      {row.tags.map((t, j) => (
                        <span key={j} className="text-[11px] border border-gray-200 text-gray-600 px-2.5 py-1 rounded-[8px] bg-white hover:bg-gray-50 transition-colors">{t}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-main-content mx-auto px-4 md:px-5 py-16 md:py-20 text-center">
        <h2 className="text-2xl md:text-[28px] font-bold text-gray-900 tracking-tight mb-3">지금 바로 시작해보세요</h2>
        <p className="text-gray-500 text-base mb-8">전북 소상공인이라면 누구나 무료로 사용할 수 있습니다.</p>
        <Link to="/dashboard">
          <button className="bg-navy text-white font-semibold px-8 py-3.5 rounded-full text-sm hover:shadow-hero transition-all duration-200 hover:-translate-y-0.5">
            W-AI 대시보드 시작하기 <ArrowRight size={16} className="inline ml-1" />
          </button>
        </Link>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 bg-gray-50/30">
        <div className="max-w-main-content mx-auto px-4 md:px-5 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-navy flex items-center justify-center">
                <Store size={14} className="text-white" />
              </div>
              <span className="font-bold text-navy text-sm">W-AI</span>
              <span className="text-xs text-gray-400">Weather × Win × AI</span>
            </div>
            <p className="text-xs text-gray-400">전북특별자치도 소상공인 AI 경영 비서 플랫폼</p>
            <div className="flex items-center gap-2">
              <span className="text-[11px] border border-gray-200 text-gray-500 px-2.5 py-1 rounded-[8px] bg-white">기상청 공식 API</span>
              <span className="text-[11px] border border-gray-200 text-gray-500 px-2.5 py-1 rounded-[8px] bg-white">전북 공공데이터</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}