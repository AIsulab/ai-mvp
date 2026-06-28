import { MapPin, ArrowRight } from "lucide-react";

export default function HeroSection({ weather, weatherLoading, region }) {
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
                { value: "470만", label: "국내 소상공인" },
                { value: "10%", label: "AI 활용률" },
                { value: "1~2시간", label: "절감 시간/일" },
              ].map((stat, i) => (
                <div key={i}>
                  <div className="text-xl md:text-2xl font-bold tracking-tight">{stat.value}</div>
                  <div className="text-xs text-white/60 mt-0.5">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Weather Card */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-[16px] p-5 md:p-6 w-full md:w-56 text-center">
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
        </div>
      </div>
    </div>
  );
}
