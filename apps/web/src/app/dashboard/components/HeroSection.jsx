import { MapPin, ArrowRight, TrendingUp, Clock, Lightbulb } from "lucide-react";

export default function HeroSection({ weather, weatherLoading, region }) {
  const marketingTips = [
    { icon: "🌧️", tip: "비 오는 날: 배달/실내 메뉴 강조" },
    { icon: "🔥", tip: "폭염: 시원한 메뉴/할인 강조" },
    { icon: "❄️", tip: "한파: 따뜻한 메뉴/핫드링크" },
    { icon: "☀️", tip: "맑음: 야외/활동 메뉴 강조" },
  ];

  return (
    <div className="hero-gradient text-white animate-fade-in">
      <div className="px-5 md:px-8 py-8 md:py-12">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex-1">
            <div className="inline-flex items-center gap-1.5 bg-white/15 text-white/90 px-3 py-1 rounded-[8px] text-xs font-medium mb-4 backdrop-blur-sm">
              <span className="w-1.5 h-1.5 bg-yellow-300 rounded-full animate-pulse-soft"></span>
              날씨 기반 AI 마케팅
            </div>
            <h1 className="text-2xl md:text-3xl lg:text-[32px] font-extrabold mb-3 leading-[1.3] tracking-tight">
              사장님, 오늘 날씨에 맞는<br />
              <span className="text-yellow-300">마케팅 문구</span> 준비하셨나요?
            </h1>
            <p className="text-white/70 text-sm md:text-base mb-6 max-w-lg leading-[1.6]">
              기상청 공공데이터와 AI를 결합해<br className="md:hidden" />
              클릭 한 번에 맞춤 마케팅을 자동 생성합니다.
            </p>
            <div className="flex flex-wrap gap-4 md:gap-6">
              {[
                { icon: Clock, value: "1~2시간", label: "절감 시간/일" },
                { icon: TrendingUp, value: "3배", label: "마케팅 효과" },
                { icon: Lightbulb, value: "무료", label: "AI 기능" },
              ].map((stat, i) => (
                <div key={i} className="flex items-center gap-2">
                  <stat.icon size={14} className="text-yellow-300" />
                  <div>
                    <div className="text-sm font-bold tracking-tight">{stat.value}</div>
                    <div className="text-[10px] text-white/50">{stat.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Weather Card + Marketing Tip */}
          <div className="w-full md:w-64">
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-[16px] p-5 text-center mb-3">
              {weatherLoading ? (
                <div className="py-6 flex justify-center">
                  <div className="w-8 h-8 border-3 border-white/20 border-t-white rounded-full animate-spin"></div>
                </div>
              ) : (
                <>
                  <div className="text-4xl md:text-5xl mb-2">{weather?.emoji || "🌤️"}</div>
                  <div className="text-2xl md:text-3xl font-bold mb-1 tracking-tight">{weather?.temperature || "--"}</div>
                  <div className="text-sm text-white/70 mb-3">{weather?.condition || "날씨 로딩 중..."}</div>
                  <div className="inline-flex items-center gap-1.5 bg-white/10 text-white/90 py-1.5 px-3 rounded-full text-xs font-medium">
                    <MapPin size={11} /> {region} / 전북
                  </div>
                </>
              )}
            </div>
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-[12px] p-3">
              <div className="flex items-center gap-2 mb-2">
                <Lightbulb size={12} className="text-yellow-300" />
                <span className="text-[10px] font-semibold text-white/80">오늘의 마케팅 팁</span>
              </div>
              <p className="text-[11px] text-white/60 leading-relaxed">
                {marketingTips[Math.floor(Math.random() * marketingTips.length)].tip}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
