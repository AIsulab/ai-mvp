import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Store, Cloud, BarChart2, Star, Zap, MapPin, Gift, Play, ChevronRight } from "lucide-react";

const demoSteps = [
  { weather: "비 오는 오후", emoji: "🌧️", business: "국밥집", result: "오늘처럼 궂은 날엔 진한 국밥 한 그릇이 최고죠. 뜨끈한 온기로 하루를 채워드립니다." },
  { weather: "폭염 여름", emoji: "🔥", business: "냉면집", result: "이 더위엔 시원한 냉면으로 열기를 식혀보세요. 특제 육수의 깊은 맛이 여름 더위를 날려드립니다." },
  { weather: "겨울 눈", emoji: "❄️", business: "카페", result: "눈 오는 날의 낭만을 따뜻한 커피 한 잔과 함께하세요. 오늘의 스페셜 라떼는 무료 리필입니다." },
];

const features = [
  { num: "01", icon: Cloud, title: "날씨 마케팅", desc: "기상청 실시간 데이터로 자동 문구 생성" },
  { num: "02", icon: BarChart2, title: "상권 분석", desc: "전북 유동인구·매출 AI 분석" },
  { num: "03", icon: Star, title: "리뷰 관리", desc: "고객 리뷰 맞춤 답변 자동화" },
  { num: "04", icon: Zap, title: "SNS 생성", desc: "인스타/블로그 콘텐츠 즉시 완성" },
  { num: "05", icon: MapPin, title: "지역 특화", desc: "전북 소비 트렌드 AI 분석" },
  { num: "06", icon: Gift, title: "지원금 매칭", desc: "신청 가능한 지원사업 추천" },
];

export default function LandingPage() {
  const [demoStep, setDemoStep] = useState(0);
  const [typedText, setTypedText] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setDemoStep((prev) => (prev + 1) % demoSteps.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setIsTyping(true);
    setTypedText("");
    const text = demoSteps[demoStep].result;
    let i = 0;
    const typeInterval = setInterval(() => {
      if (i < text.length) {
        setTypedText(text.slice(0, i + 1));
        i++;
      } else {
        setIsTyping(false);
        clearInterval(typeInterval);
      }
    }, 25);
    return () => clearInterval(typeInterval);
  }, [demoStep]);

  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-sm border-b border-gray-100">
        <div className="max-w-[1100px] mx-auto px-5 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gray-900 flex items-center justify-center">
              <Store size={15} className="text-white" />
            </div>
            <span className="text-[15px] font-bold text-gray-900">W-AI</span>
          </div>
          <div className="flex items-center gap-5">
            <a href="#demo" className="text-[13px] text-gray-500 hover:text-gray-900 transition-colors hidden md:block">데모</a>
            <a href="#features" className="text-[13px] text-gray-500 hover:text-gray-900 transition-colors hidden md:block">기능</a>
            <Link to="/dashboard" className="bg-gray-900 text-white font-medium px-4 py-1.5 rounded-full text-[13px] hover:bg-gray-800 transition-colors">
              시작하기
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-[1100px] mx-auto px-5 pt-20 pb-16 md:pt-28 md:pb-20">
        <div className="max-w-[520px]">
          <div className="text-[11px] font-medium text-gray-400 tracking-wider mb-4">AI 기반 소상공인 경영 비서</div>
          <h1 className="text-[36px] md:text-[48px] font-extrabold text-gray-900 leading-[1.1] tracking-tight mb-5">
            사장님의<br />성공 이유, W-AI
          </h1>
          <p className="text-gray-500 text-[14px] leading-relaxed mb-8 max-w-[380px]">
            날씨 · 상권 · 리뷰 데이터를 AI가 자동 분석해 마케팅 문구부터 경영 인사이트까지.
          </p>
          <div className="flex items-center gap-3">
            <Link to="/dashboard" className="bg-gray-900 text-white font-medium px-6 py-2.5 rounded-full text-[13px] hover:bg-gray-800 transition-colors flex items-center gap-2">
              무료로 시작하기 <ArrowRight size={14} />
            </Link>
            <a href="#demo" className="text-gray-500 font-medium px-5 py-2.5 rounded-full text-[13px] border border-gray-200 hover:border-gray-300 transition-colors flex items-center gap-2">
              <Play size={12} /> 데모 보기
            </a>
          </div>
        </div>
      </section>

      {/* Demo */}
      <section id="demo" className="border-y border-gray-100 bg-gray-50/50">
        <div className="max-w-[1100px] mx-auto px-5 py-14 md:py-16">
          <div className="text-[11px] font-medium text-gray-400 tracking-wider mb-3">DEMO</div>
          <h2 className="text-[22px] md:text-[26px] font-bold text-gray-900 tracking-tight mb-8">실제 작동 모습</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Input */}
            <div className="bg-white rounded-2xl border border-gray-200 p-5">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <span className="text-[12px] text-gray-500">실시간 AI 엔진</span>
              </div>
              <div className="space-y-3 mb-5">
                <div>
                  <label className="text-[11px] text-gray-400 mb-1.5 block">날씨 조건</label>
                  <div className="flex gap-1.5">
                    {demoSteps.map((step, i) => (
                      <button key={i} onClick={() => setDemoStep(i)} className={`px-3 py-1.5 rounded-full text-[12px] font-medium transition-all ${i === demoStep ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                        {step.emoji} {step.weather}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-[11px] text-gray-400 mb-1.5 block">업종</label>
                  <div className="flex gap-1.5">
                    {["국밥집", "카페", "식당"].map((type) => (
                      <span key={type} className={`px-3 py-1.5 rounded-full text-[12px] font-medium ${type === demoSteps[demoStep].business ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-500'}`}>
                        {type}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <button className="w-full bg-gray-900 text-white font-medium py-2.5 rounded-full text-[13px] hover:bg-gray-800 transition-colors">
                문구 생성
              </button>
            </div>

            {/* Output */}
            <div className="bg-white rounded-2xl border border-gray-200 p-5">
              <div className="flex items-center justify-between mb-4">
                <span className="text-[12px] font-medium text-gray-900">AI 생성 결과</span>
                <span className="text-[10px] bg-green-50 text-green-600 px-2 py-0.5 rounded-full font-medium">자동</span>
              </div>
              <div className="bg-gray-50 rounded-xl p-4 min-h-[120px]">
                <p className="text-[13px] text-gray-700 leading-relaxed">
                  "{typedText}<span className={`inline-block w-[1.5px] h-4 bg-gray-900 ml-0.5 align-middle ${isTyping ? 'animate-pulse' : 'opacity-0'}`}></span>"
                </p>
              </div>
              <div className="flex items-center gap-3 mt-3">
                <button className="text-[11px] text-gray-400 hover:text-gray-600 transition-colors">복사</button>
                <button className="text-[11px] text-gray-400 hover:text-gray-600 transition-colors">카카오 전송</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="max-w-[1100px] mx-auto px-5 py-14 md:py-16">
        <div className="text-[11px] font-medium text-gray-400 tracking-wider mb-3">FEATURES</div>
        <h2 className="text-[22px] md:text-[26px] font-bold text-gray-900 tracking-tight mb-8">6가지 AI 기능</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-5">
          {features.map((f, i) => (
            <div key={i} className="flex items-start gap-4 group cursor-pointer">
              <span className="text-[11px] font-medium text-gray-300 mt-0.5 shrink-0">{f.num}</span>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <f.icon size={14} className="text-gray-400" />
                  <h3 className="text-[15px] font-semibold text-gray-900 group-hover:text-gray-600 transition-colors">{f.title}</h3>
                  <ChevronRight size={12} className="text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <p className="text-[13px] text-gray-500">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-gray-100">
        <div className="max-w-[1100px] mx-auto px-5 py-14 md:py-16 text-center">
          <h2 className="text-[22px] md:text-[26px] font-bold text-gray-900 tracking-tight mb-3">지금 시작하세요</h2>
          <p className="text-gray-500 text-[14px] mb-8">전북 소상공인이라면 누구나 무료</p>
          <Link to="/dashboard" className="inline-flex items-center gap-2 bg-gray-900 text-white font-medium px-7 py-2.5 rounded-full text-[13px] hover:bg-gray-800 transition-colors">
            대시보드 시작하기 <ArrowRight size={14} />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100">
        <div className="max-w-[1100px] mx-auto px-5 py-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-gray-900 flex items-center justify-center">
              <Store size={11} className="text-white" />
            </div>
            <span className="text-[13px] font-semibold text-gray-900">W-AI</span>
          </div>
          <p className="text-[11px] text-gray-400">Weather × Win × AI</p>
        </div>
      </footer>
    </div>
  );
}
