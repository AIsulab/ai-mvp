import { Link } from 'react-router-dom';
import {
  Cloud,
  BarChart2,
  Star,
  MapPin,
  Gift,
  ArrowRight,
  Zap,
} from "lucide-react";

const features = [
  {
    icon: Cloud,
    badge: "기상청장상 공략",
    badgeColor: "bg-blue-50 text-blue-600",
    title: "날씨 마케팅 자동화",
    desc: "기상청 단기예보 API와 연동해 날씨 변화에 따라 업종별 최적 마케팅 문구를 실시간 자동 생성합니다.",
    items: [
      "기상청 단기예보 API 실시간 연동",
      "날씨 × 업종 매칭 엔진",
      "원클릭 문구 복사 & 배포",
    ],
  },
  {
    icon: BarChart2,
    badge: "전북 공공데이터",
    badgeColor: "bg-green-50 text-green-700",
    title: "AI 상권 분석",
    desc: "전북 유동인구·매출·폐업률 공공데이터를 결합해 내 가게의 상권 경쟁력과 유망 메뉴를 분석합니다.",
    items: [
      "전북 소상공인 현황 데이터 연동",
      "경쟁 강도 & 업종 포화도 분석",
      "최적 영업 시간대 추천",
    ],
  },
  {
    icon: Zap,
    badge: "SNS 자동화",
    badgeColor: "bg-purple-50 text-purple-600",
    title: "SNS 콘텐츠 생성",
    desc: "업종·메뉴·오늘 날씨를 입력하면 인스타그램 게시글, 해시태그, 스토리 아이디어를 즉시 완성합니다.",
    items: [
      "인스타그램 / 블로그 문구 생성",
      "업종별 해시태그 자동 추가",
      "날씨 감성 톤 자동 적용",
    ],
  },
  {
    icon: Star,
    badge: "리뷰 관리",
    badgeColor: "bg-orange-50 text-orange-600",
    title: "리뷰 답변 자동화",
    desc: "고객 리뷰를 붙여넣으면 AI가 상황에 맞는 감사·개선 답변을 즉시 작성하고 개선 포인트를 도출합니다.",
    items: [
      "긍정/부정 리뷰 자동 분류",
      "맞춤 답변 3가지 옵션 제공",
      "개선점 리포트 자동 생성",
    ],
  },
  {
    icon: MapPin,
    badge: "지역 특화",
    badgeColor: "bg-red-50 text-red-600",
    title: "지역 데이터 추천",
    desc: "전북 특화 소비 트렌드와 계절·이벤트 데이터를 결합해 지역 맞춤형 경영 인사이트를 제공합니다.",
    items: [
      "전북 지역 소비 트렌드 분석",
      "계절별 인기 메뉴 추천",
      "AI 경영 제안서 자동 작성",
    ],
  },
  {
    icon: Gift,
    badge: "정부 지원",
    badgeColor: "bg-teal-50 text-teal-600",
    title: "지원금 자동 매칭",
    desc: "업종·매출·창업연차를 입력하면 지금 바로 신청 가능한 전북 소상공인 지원사업을 자동으로 추천합니다.",
    items: [
      "전북 지원사업 DB 실시간 업데이트",
      "신청 자격 자동 매칭",
      "신청 기한 알림 서비스",
    ],
  },
];

const stats = [
  { value: "5가지", label: "AI 핵심 기능" },
  { value: "실시간", label: "기상청 API 연동" },
  { value: "전북 특화", label: "공공데이터 활용" },
  { value: "1인 개발", label: "경량 MVP" },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* NavBar */}
      <nav className="border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 bg-white z-50">
        <div className="flex items-center gap-3">
          <span className="text-xl font-semibold text-gray-900 tracking-tight">
            W-AI
          </span>
          <span className="text-xs border border-gray-200 text-gray-700 px-2.5 py-0.5 rounded-full font-medium">
            와이
          </span>
        </div>
        <div className="flex items-center gap-4">
          <a
            href="#features"
            className="text-sm text-gray-500 hover:text-gray-900 transition-colors hidden md:block"
          >
            기능
          </a>
          <a
            href="#engine"
            className="text-sm text-gray-500 hover:text-gray-900 transition-colors hidden md:block"
          >
            날씨 엔진
          </a>
          <Link
            to="/dashboard"
            className="bg-[#2563EB] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors inline-flex items-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
          >
            대시보드 시작하기 <ArrowRight size={14} />
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-6 pt-24 pb-20 text-center">
        <div className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-600 rounded-full px-3 py-1.5 text-sm font-medium mb-6">
          <Cloud size={14} />
          기상청 공식 API · 전북 공공데이터 실시간 연동
        </div>
        <h1 className="text-4xl md:text-5xl font-semibold text-gray-900 tracking-tight mb-5 leading-tight">
          사장님의 성공 이유,
          <br />
          <span className="text-[#2563EB]">W-AI</span>
        </h1>
        <p className="text-gray-500 text-lg mb-3 max-w-xl mx-auto leading-relaxed">
          날씨 · 상권 · 리뷰 데이터를 AI가 자동 분석해
        </p>
        <p className="text-gray-700 text-lg font-medium mb-10 max-w-xl mx-auto">
          마케팅 문구부터 경영 인사이트까지 버튼 하나로 완성
        </p>
        <div className="flex items-center justify-center gap-3 flex-wrap">
          <Link
            to="/dashboard"
            className="bg-[#2563EB] text-white px-7 py-3.5 rounded-lg font-medium hover:bg-blue-700 transition-colors inline-flex items-center gap-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
          >
            무료로 시작하기 <ArrowRight size={16} />
          </Link>
          <a
            href="#features"
            className="border border-gray-200 text-gray-700 px-7 py-3.5 rounded-lg font-medium hover:border-gray-300 hover:bg-gray-50 transition-colors text-sm"
          >
            기능 살펴보기
          </a>
        </div>

        {/* Mini weather demo preview */}
        <div className="mt-14 border border-gray-200 rounded-xl p-5 max-w-lg mx-auto text-left bg-gray-50">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
            <span className="text-xs text-gray-500 font-medium">
              날씨 마케팅 엔진 · 실시간 작동 중
            </span>
          </div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs border border-gray-200 bg-white text-gray-700 px-2.5 py-1 rounded-full">
              🌧️ 비 오는 오후
            </span>
            <span className="text-xs text-gray-400">+</span>
            <span className="text-xs border border-gray-200 bg-white text-gray-700 px-2.5 py-1 rounded-full">
              🍜 국밥집
            </span>
          </div>
          <p className="text-sm text-gray-900 font-medium">
            "오늘처럼 궂은 날엔 진한 국밥 한 그릇이 최고죠. 뜨끈한 온기로 하루를
            채워드립니다 🍲"
          </p>
          <p className="text-xs text-gray-400 mt-2">
            W-AI가 기상청 데이터 기반으로 자동 생성
          </p>
        </div>
      </section>

      {/* Stats bar */}
      <div className="border-y border-gray-200 bg-gray-50">
        <div className="max-w-4xl mx-auto px-6 py-6 grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((s, i) => (
            <div key={i} className="text-center">
              <div className="text-xl font-semibold text-gray-900">
                {s.value}
              </div>
              <div className="text-xs text-gray-500 mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Features */}
      <section id="features" className="max-w-5xl mx-auto px-6 py-20">
        <div className="mb-10">
          <div className="inline-flex items-center gap-1.5 border border-gray-200 text-gray-700 rounded-full px-3 py-1 text-xs font-medium mb-4">
            핵심 기능
          </div>
          <h2 className="text-2xl font-semibold text-gray-900 tracking-tight">
            소상공인을 위한 AI 올인원 플랫폼
          </h2>
          <p className="text-gray-500 text-sm mt-2">
            프롬프트 작성 능력이 없어도, AI 설정을 몰라도 괜찮습니다.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((f, i) => (
            <div
              key={i}
              className="bg-white rounded-xl border border-gray-200 p-6 hover:border-gray-300 hover:bg-gray-50 transition-colors cursor-pointer"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-9 h-9 rounded-lg border border-gray-200 flex items-center justify-center">
                  <f.icon size={18} className="text-gray-700" />
                </div>
                <span
                  className={`text-xs px-2.5 py-1 rounded-full font-medium ${f.badgeColor}`}
                >
                  {f.badge}
                </span>
              </div>
              <h3 className="text-base font-semibold text-gray-900 mb-2">
                {f.title}
              </h3>
              <p className="text-sm text-gray-500 mb-4 leading-relaxed">
                {f.desc}
              </p>
              <div className="space-y-1.5">
                {f.items.map((item, j) => (
                  <div
                    key={j}
                    className="flex items-start gap-2 text-sm text-gray-600"
                  >
                    <span className="text-gray-400 mt-0.5 shrink-0">-</span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Weather-Driven Engine Highlight */}
      <section id="engine" className="bg-gray-50 border-y border-gray-200">
        <div className="max-w-5xl mx-auto px-6 py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-600 rounded-full px-3 py-1.5 text-sm font-medium mb-5">
                <Zap size={13} />
                Weather-Driven Engine
              </div>
              <h2 className="text-2xl font-semibold text-gray-900 tracking-tight mb-4">
                날씨가 바뀌면
                <br />
                마케팅도 자동으로 바뀝니다
              </h2>
              <p className="text-gray-500 text-sm leading-relaxed mb-6">
                기상청 단기예보 API와 GPT-4를 결합한 독자적인 Weather-Driven
                엔진. 맑음, 비, 눈, 폭염, 한파 등 날씨 조건을 실시간 감지해
                업종별로 최적화된 마케팅 문구를 자동 생성합니다.
              </p>
              <div className="space-y-3">
                {[
                  {
                    weather: "🌧️ 비",
                    example: '"오늘처럼 비 오는 날엔 따뜻한 순대국 한 그릇"',
                    type: "국밥집",
                  },
                  {
                    weather: "🌞 폭염",
                    example: '"이 더위엔 시원한 냉면으로 열기를 식혀요"',
                    type: "식당",
                  },
                  {
                    weather: "❄️ 눈",
                    example: '"눈 오는 날의 낭만을 따뜻한 커피 한 잔과 함께"',
                    type: "카페",
                  },
                ].map((ex, i) => (
                  <div
                    key={i}
                    className="bg-white border border-gray-200 rounded-lg p-4"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs border border-gray-200 text-gray-700 px-2 py-0.5 rounded-full">
                        {ex.weather}
                      </span>
                      <span className="text-gray-300">+</span>
                      <span className="text-xs border border-gray-200 text-gray-700 px-2 py-0.5 rounded-full">
                        {ex.type}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 font-medium">
                      {ex.example}
                    </p>
                  </div>
                ))}
              </div>
            </div>
            <div className="border border-gray-200 rounded-xl p-6 bg-white">
              <h3 className="text-sm font-semibold text-gray-900 mb-4">
                날씨 조건별 마케팅 방향
              </h3>
              <div className="space-y-3">
                {[
                  {
                    icon: "☀️",
                    label: "맑음 · 고온",
                    tags: ["청량함", "야외활동", "여름 특선"],
                  },
                  {
                    icon: "🌧️",
                    label: "비",
                    tags: ["따뜻함", "실내", "배달", "든든함"],
                  },
                  {
                    icon: "❄️",
                    label: "눈",
                    tags: ["낭만", "겨울 감성", "연말 특별"],
                  },
                  {
                    icon: "🌬️",
                    label: "한파",
                    tags: ["온기", "국물", "핫드링크"],
                  },
                  {
                    icon: "☁️",
                    label: "흐림",
                    tags: ["기분전환", "특별 할인", "에너지"],
                  },
                ].map((row, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <span className="text-lg w-7">{row.icon}</span>
                    <span className="text-sm text-gray-600 w-20 shrink-0">
                      {row.label}
                    </span>
                    <div className="flex gap-1.5 flex-wrap">
                      {row.tags.map((t, j) => (
                        <span
                          key={j}
                          className="text-xs border border-gray-200 text-gray-600 px-2 py-0.5 rounded-full"
                        >
                          {t}
                        </span>
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
      <section className="max-w-3xl mx-auto px-6 py-20 text-center">
        <h2 className="text-2xl font-semibold text-gray-900 tracking-tight mb-3">
          지금 바로 시작해보세요
        </h2>
        <p className="text-gray-500 text-sm mb-8">
          전북 소상공인이라면 무료로 사용할 수 있습니다.
        </p>
        <Link
          to="/dashboard"
          className="bg-[#2563EB] text-white px-8 py-4 rounded-lg font-medium hover:bg-blue-700 transition-colors inline-flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
        >
          W-AI 대시보드 시작하기 <ArrowRight size={16} />
        </Link>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 px-6 py-8">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-gray-900 text-sm">W-AI</span>
            <span className="text-xs text-gray-400">Weather × Win × AI</span>
          </div>
          <p className="text-xs text-gray-400">
            전북특별자치도 소상공인 AI 경영 비서 플랫폼
          </p>
          <div className="flex items-center gap-2">
            <span className="text-xs border border-gray-200 text-gray-500 px-2 py-0.5 rounded-full">
              기상청 공식 API
            </span>
            <span className="text-xs border border-gray-200 text-gray-500 px-2 py-0.5 rounded-full">
              전북 공공데이터
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
