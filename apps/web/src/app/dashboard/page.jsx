import {
  Cloud,
  Zap,
  Star,
  MapPin,
  Gift,
  ArrowRight,
  TrendingUp,
  BarChart2,
} from "lucide-react";

const quickActions = [
  {
    icon: Cloud,
    title: "날씨 마케팅 생성",
    desc: "오늘 날씨 기반 문구 자동 생성",
    href: "/dashboard/weather-marketing",
    badge: "기상청 API 연동",
    badgeColor: "bg-blue-50 text-blue-600",
  },
  {
    icon: Zap,
    title: "SNS 콘텐츠 만들기",
    desc: "인스타그램 게시글 + 해시태그",
    href: "/dashboard/sns-content",
    badge: "AI 자동 생성",
    badgeColor: "bg-purple-50 text-purple-600",
  },
  {
    icon: Star,
    title: "리뷰 답변 작성",
    desc: "고객 리뷰에 맞춤 답변 자동화",
    href: "/dashboard/review-reply",
    badge: "감성 분석",
    badgeColor: "bg-orange-50 text-orange-600",
  },
  {
    icon: MapPin,
    title: "상권 분석 보기",
    desc: "전북 유동인구 · 경쟁 강도 분석",
    href: "/dashboard/market-analysis",
    badge: "전북 공공데이터",
    badgeColor: "bg-green-50 text-green-700",
  },
  {
    icon: Gift,
    title: "지원금 매칭",
    desc: "내 업종에 맞는 보조금 자동 추천",
    href: "/dashboard/support-fund",
    badge: "정부 지원사업",
    badgeColor: "bg-teal-50 text-teal-600",
  },
  {
    icon: BarChart2,
    title: "경영 인사이트",
    desc: "AI가 분석한 매출 트렌드 리포트",
    href: "/dashboard/market-analysis",
    badge: "AI 리포트",
    badgeColor: "bg-red-50 text-red-600",
  },
];

const recentActivity = [
  {
    type: "날씨 마케팅",
    content: '"비 오는 날엔 뜨끈한 국밥 한 그릇으로 위로받으세요 🍲"',
    time: "방금 전",
    weather: "🌧️ 비",
  },
  {
    type: "SNS 콘텐츠",
    content: '"오늘의 점심 특선! 신선한 재료로 만든 비빔밥 세트 🥗 #전주맛집"',
    time: "12분 전",
    weather: "☀️ 맑음",
  },
  {
    type: "리뷰 답변",
    content: '"소중한 리뷰 감사합니다! 더 나은 서비스로 보답하겠습니다 😊"',
    time: "31분 전",
    weather: null,
  },
];

export default function DashboardPage() {
  const today = new Date().toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long",
  });

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <p className="text-xs text-gray-400 mb-1">{today}</p>
        <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">
          안녕하세요, 사장님 👋
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          W-AI가 오늘도 마케팅과 경영을 도와드릴게요.
        </p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          {
            label: "AI 생성 문구",
            value: "12건",
            sub: "오늘 기준",
            dot: "bg-blue-500",
          },
          {
            label: "날씨 연동 상태",
            value: "실시간",
            sub: "기상청 API",
            dot: "bg-green-500",
          },
          {
            label: "이번 달 콘텐츠",
            value: "84건",
            sub: "전월 대비 +23%",
            dot: "bg-purple-500",
          },
          {
            label: "지원금 매칭",
            value: "3건",
            sub: "신청 가능",
            dot: "bg-orange-500",
          },
        ].map((stat, i) => (
          <div
            key={i}
            className="bg-white border border-gray-200 rounded-xl p-5 hover:border-gray-300 transition-colors"
          >
            <div className="flex items-center gap-1.5 mb-3">
              <div className={`w-1.5 h-1.5 rounded-full ${stat.dot}`}></div>
              <span className="text-xs text-gray-500">{stat.label}</span>
            </div>
            <div className="text-xl font-semibold text-gray-900">
              {stat.value}
            </div>
            <div className="text-xs text-gray-400 mt-1">{stat.sub}</div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-gray-900">빠른 실행</h2>
          <span className="text-xs text-gray-400">
            원하는 기능을 바로 시작하세요
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {quickActions.map((action, i) => (
            <a
              key={i}
              href={action.href}
              className="bg-white border border-gray-200 rounded-xl p-5 hover:border-gray-300 hover:bg-gray-50 transition-colors group flex flex-col gap-3"
            >
              <div className="flex items-center justify-between">
                <div className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center">
                  <action.icon size={16} className="text-gray-600" />
                </div>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${action.badgeColor}`}
                >
                  {action.badge}
                </span>
              </div>
              <div>
                <div className="text-sm font-semibold text-gray-900 mb-1">
                  {action.title}
                </div>
                <div className="text-xs text-gray-500">{action.desc}</div>
              </div>
              <div className="flex items-center gap-1 text-[#2563EB] text-xs font-medium">
                시작하기{" "}
                <ArrowRight
                  size={11}
                  className="group-hover:translate-x-0.5 transition-transform"
                />
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white border border-gray-200 rounded-xl">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-gray-900">
            최근 생성 내역
          </h2>
          <span className="text-xs text-gray-400">오늘 기준</span>
        </div>
        <div className="divide-y divide-gray-100">
          {recentActivity.map((item, i) => (
            <div
              key={i}
              className="px-6 py-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-start gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs border border-gray-200 text-gray-600 px-2 py-0.5 rounded-full">
                      {item.type}
                    </span>
                    {item.weather && (
                      <span className="text-xs border border-gray-200 text-gray-600 px-2 py-0.5 rounded-full">
                        {item.weather}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-700 truncate">
                    {item.content}
                  </p>
                </div>
                <span className="text-xs text-gray-400 shrink-0">
                  {item.time}
                </span>
              </div>
            </div>
          ))}
        </div>
        <div className="px-6 py-4 border-t border-gray-200">
          <a
            href="/dashboard/weather-marketing"
            className="text-xs text-[#2563EB] font-medium inline-flex items-center gap-1 hover:underline"
          >
            새 콘텐츠 생성하기 <ArrowRight size={11} />
          </a>
        </div>
      </div>
    </div>
  );
}
