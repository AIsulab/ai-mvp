import { MapPin } from "lucide-react";

export default function HeroSection({ weather, weatherLoading, region }) {
  return (
    <div className="bg-gradient-to-br from-[#0B1B3D] via-[#132D5E] to-[#0B1B3D] text-white py-6 md:py-8 animate-fade-in">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 md:gap-8">
        <div className="flex-1 text-center md:text-left">
          <div className="inline-flex items-center gap-1.5 bg-yellow-400/10 text-yellow-400 px-3 py-1 rounded-full text-xs font-medium mb-3 md:mb-4 border border-yellow-400/20">
            <span className="w-1.5 h-1.5 bg-yellow-400 rounded-full animate-pulse-soft"></span>
            날씨가 돈이 됩니다
          </div>
          <h1 className="text-2xl md:text-4xl font-bold mb-3 md:mb-4 leading-tight tracking-tight">
            사장님, 오늘 날씨에 맞는
            <br className="md:hidden" />
            <span className="text-yellow-400"> 마케팅 문구</span>
            <br className="hidden md:block" />
            <span className="text-yellow-400"> 준비하셨나요?</span>
          </h1>
          <p className="text-blue-200/80 text-xs md:text-sm mb-6 md:mb-8 leading-relaxed max-w-lg mx-auto md:mx-0">
            기상청 공공데이터 + 전북 유동인구 데이터 + AI를 결합해
            <br className="hidden md:block" />
            프롬프트 없이도 클릭 한 번에 맞춤 마케팅을 자동 생성합니다.
          </p>
          <div className="flex justify-center md:justify-start gap-6 md:gap-8">
            {[
              { value: "470만", label: "국내 소상공인" },
              { value: "10%", label: "AI 활용률" },
              { value: "1~2시간", label: "절감 시간/일" },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-xl md:text-2xl font-bold">{stat.value}</div>
                <div className="text-[10px] md:text-xs text-blue-300/70 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-5 md:p-6 w-full md:w-64 text-center shadow-2xl">
          {weatherLoading ? (
            <div className="py-8 flex justify-center">
              <div className="w-8 h-8 border-4 border-white/20 border-t-yellow-400 rounded-full animate-spin"></div>
            </div>
          ) : (
            <>
              <div className="text-4xl md:text-5xl mb-2 md:mb-3 animate-scale-in">{weather?.emoji}</div>
              <div className="text-2xl md:text-3xl font-bold mb-1">{weather?.temperature}</div>
              <div className="text-xs md:text-sm text-blue-200/80 mb-3 md:mb-4">{weather?.condition}</div>
              <div className="text-[10px] md:text-xs font-medium text-yellow-400 bg-yellow-400/10 py-1.5 px-3 rounded-full inline-flex items-center gap-1.5">
                <MapPin size={11} /> {region} / 전북
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
