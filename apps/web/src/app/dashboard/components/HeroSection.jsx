import { MapPin } from "lucide-react";

export default function HeroSection({ weather, weatherLoading, region }) {
  return (
    <div className="bg-dark text-white py-12 px-6 animate-fade-in">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="flex-1">
          <div className="inline-flex items-center gap-1.5 bg-yellow-500/20 text-yellow-400 px-3 py-1 rounded-full text-xs font-medium mb-4 border border-yellow-500/30">
            <span className="w-1.5 h-1.5 bg-yellow-400 rounded-full animate-pulse"></span>
            날씨가 돈이 됩니다
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4 leading-tight tracking-tight">
            사장님, 오늘 날씨에 맞는<br />
            <span className="text-yellow-400">마케팅 문구 준비하셨나요?</span>
          </h1>
          <p className="text-blue-200 text-sm mb-8 leading-relaxed max-w-lg">
            기상청 공공데이터 + 전북 유동인구 데이터 + AI를 결합해<br />
            프롬프트 없이도 클릭 한 번에 맞춤 마케팅을 자동 생성합니다.
          </p>
          <div className="flex gap-8">
            <div>
              <div className="text-2xl font-bold">470만</div>
              <div className="text-xs text-blue-300 mt-1">국내 소상공인</div>
            </div>
            <div>
              <div className="text-2xl font-bold">10%</div>
              <div className="text-xs text-blue-300 mt-1">AI 활용률</div>
            </div>
            <div>
              <div className="text-2xl font-bold">1~2시간</div>
              <div className="text-xs text-blue-300 mt-1">절감 가능 시간/일</div>
            </div>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 w-full md:w-64 text-center shadow-2xl">
          {weatherLoading ? (
            <div className="py-8 flex justify-center">
              <div className="w-8 h-8 border-4 border-white/30 border-t-yellow-400 rounded-full animate-spin"></div>
            </div>
          ) : (
            <>
              <div className="text-5xl mb-3">{weather?.emoji}</div>
              <div className="text-3xl font-bold mb-1">{weather?.temperature}</div>
              <div className="text-sm text-blue-200 mb-4">{weather?.condition}</div>
              <div className="text-xs font-medium text-yellow-400 bg-yellow-400/10 py-1.5 px-3 rounded-full inline-flex items-center gap-1.5">
                <MapPin size={12} /> {region} / 전북
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
