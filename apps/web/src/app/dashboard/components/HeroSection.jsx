import { MapPin, TrendingUp, Clock } from "lucide-react";

export default function HeroSection({ weather, weatherLoading, region }) {
  return (
    <div className="bg-gray-900 text-white animate-fade-in">
      <div className="px-5 md:px-6 py-6 md:py-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
          <div className="flex-1">
            <div className="text-[11px] font-medium text-gray-400 tracking-wider mb-2">WEATHER AI</div>
            <h1 className="text-[22px] md:text-[26px] font-bold mb-2 tracking-tight">
              오늘 날씨에 맞는 마케팅 문구
            </h1>
            <p className="text-gray-400 text-[14px] mb-4 max-w-md">
              기상청 데이터와 AI가 자동으로 생성합니다
            </p>
            <div className="flex items-center gap-5">
              {[
                { icon: Clock, value: "1~2시간", label: "절감" },
                { icon: TrendingUp, value: "3배", label: "효과" },
              ].map((stat, i) => (
                <div key={i} className="flex items-center gap-1.5">
                  <stat.icon size={13} className="text-gray-500" />
                  <span className="text-[13px] font-semibold">{stat.value}</span>
                  <span className="text-[11px] text-gray-500">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Weather */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-5 w-full md:w-52">
            {weatherLoading ? (
              <div className="py-5 flex justify-center">
                <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
              </div>
            ) : (
              <>
                <div className="text-4xl mb-2">{weather?.emoji || "🌤️"}</div>
                <div className="text-2xl font-bold mb-1">{weather?.temperature || "--"}</div>
                <div className="text-[13px] text-gray-400 mb-3">{weather?.condition || "로딩 중..."}</div>
                <div className="inline-flex items-center gap-1 bg-white/10 text-white/80 py-1.5 px-2.5 rounded-full text-[11px] font-medium">
                  <MapPin size={10} /> {region}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
