import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Cloud, BarChart2, Star, MapPin, Gift, ArrowRight, Zap, Store, ChevronRight, Play, Sparkles, TrendingUp, Users, Clock, CheckCircle2 } from "lucide-react";

const demoSteps = [
  { weather: "비 오는 오후", emoji: "🌧️", business: "국밥집", result: "오늘처럼 궂은 날엔 진한 국밥 한 그릇이 최고죠. 뜨끈한 온기로 하루를 채워드립니다 🍲" },
  { weather: "폭염 여름", emoji: "🔥", business: "냉면집", result: "이 더위엔 시원한 냉면으로 열기를 식혀보세요. 특제 육수의 깊은 맛이 여름 더위를 날려드립니다 🍜" },
  { weather: "겨울 눈", emoji: "❄️", business: "카페", result: "눈 오는 날의 낭만을 따뜻한 커피 한 잔과 함께하세요. 오늘의 스페셜 라떼는 무료 리필입니다 ☕" },
];

const features = [
  { icon: Cloud, title: "날씨 마케팅", desc: "실시간 기상청 데이터로 자동 문구 생성", color: "#364cce" },
  { icon: BarChart2, title: "상권 분석", desc: "전북 유동인구·매출 데이터 AI 분석", color: "#FF749B" },
  { icon: Star, title: "리뷰 관리", desc: "고객 리뷰에 AI가 맞춤 답변 작성", color: "#FF9A26" },
  { icon: Zap, title: "SNS 생성", desc: "인스타/블로그 콘텐츠 즉시 완성", color: "#33A927" },
  { icon: MapPin, title: "지역 특화", desc: "전북 소비 트렌드 AI 분석", color: "#80366c" },
  { icon: Gift, title: "지원금 매칭", desc: "신청 가능한 지원사업 자동 추천", color: "#d05755" },
];

const steps = [
  { num: "01", title: "가게 정보 입력", desc: "업종, 메뉴, 지역만 알려주세요" },
  { num: "02", title: "AI가 분석", desc: "날씨·상권·리뷰 데이터를 실시간 분석합니다" },
  { num: "03", title: "마케팅 완성", desc: "버튼 하나로 맞춤 문구가 준비됩니다" },
];

export default function LandingPage() {
  const [demoStep, setDemoStep] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [typedText, setTypedText] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

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
    }, 30);
    return () => clearInterval(typeInterval);
  }, [demoStep]);

  return (
    <div className="min-h-screen bg-white">
      {/* NavBar */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-[1080px] mx-auto px-4 md:px-5 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-navy flex items-center justify-center">
              <Store size={18} className="text-white" />
            </div>
            <span className="text-lg font-bold text-navy tracking-tight">W-AI</span>
          </div>
          <div className="flex items-center gap-6">
            <a href="#demo" className="text-sm text-gray-500 hover:text-navy transition-colors hidden md:block">데모</a>
            <a href="#features" className="text-sm text-gray-500 hover:text-navy transition-colors hidden md:block">기능</a>
            <Link to="/dashboard" className="bg-navy text-white font-semibold px-5 py-2 rounded-full text-sm hover:shadow-hero transition-all hover:-translate-y-0.5">
              시작하기
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="hero-gradient text-white relative overflow-hidden">
        <div className="max-w-[1080px] mx-auto px-4 md:px-5 py-16 md:py-24">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-1.5 bg-white/15 text-white/90 px-3 py-1.5 rounded-full text-xs font-medium mb-6 backdrop-blur-sm">
                <Sparkles size={12} />
                AI 기반 소상공인 경영 비서
              </div>
              <h1 className="text-3xl md:text-[42px] font-extrabold mb-5 leading-[1.2] tracking-tight">
                사장님의<br />
                <span className="text-yellow-300">성공 이유</span>,<br />
                W-AI
              </h1>
              <p className="text-white/70 text-base md:text-lg mb-8 leading-[1.6] max-w-md">
                날씨 · 상권 · 리뷰 데이터를 AI가 자동 분석해<br />
                마케팅 문구부터 경영 인사이트까지
              </p>
              <div className="flex items-center gap-4 flex-wrap">
                <Link to="/dashboard" className="bg-white text-navy font-semibold px-7 py-3 rounded-full text-sm hover:shadow-hero transition-all hover:-translate-y-0.5 flex items-center gap-2">
                  무료로 시작하기 <ArrowRight size={16} />
                </Link>
                <a href="#demo" className="bg-white/10 text-white font-medium px-7 py-3 rounded-full text-sm border border-white/20 hover:bg-white/20 transition-all flex items-center gap-2">
                  <Play size={14} /> 데모 보기
                </a>
              </div>
              <div className="flex items-center gap-6 mt-10">
                {[
                  { value: "470만", label: "국내 소상공인" },
                  { value: "10%", label: "AI 활용률" },
                  { value: "1~2시간", label: "절감 시간/일" },
                ].map((s, i) => (
                  <div key={i}>
                    <div className="text-xl font-bold">{s.value}</div>
                    <div className="text-xs text-white/50">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Live Demo Card */}
            <div className="bg-white rounded-[20px] p-6 shadow-hero text-gray-900 max-w-md mx-auto w-full">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                <span className="text-xs text-gray-500 font-medium">실시간 AI 마케팅 엔진</span>
              </div>

              <div className="flex items-center gap-2 mb-4">
                <span className="bg-gray-100 text-gray-700 px-3 py-1.5 rounded-full text-xs font-medium">
                  {demoSteps[demoStep].emoji} {demoSteps[demoStep].weather}
                </span>
                <span className="text-gray-300">+</span>
                <span className="bg-gray-100 text-gray-700 px-3 py-1.5 rounded-full text-xs font-medium">
                  {demoSteps[demoStep].business}
                </span>
              </div>

              <div className="bg-gray-50 rounded-[12px] p-4 min-h-[80px]">
                <p className="text-sm text-gray-700 leading-relaxed">
                  "{typedText}<span className={`inline-block w-0.5 h-4 bg-navy ml-0.5 ${isTyping ? 'animate-pulse' : 'opacity-0'}`}></span>"
                </p>
              </div>

              <div className="flex items-center justify-center gap-1.5 mt-4">
                {demoSteps.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setDemoStep(i)}
                    className={`w-2 h-2 rounded-full transition-all ${i === demoStep ? 'bg-navy w-6' : 'bg-gray-200'}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="max-w-[1080px] mx-auto px-4 md:px-5 py-16 md:py-20">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-[28px] font-bold text-gray-900 tracking-tight mb-3">3단계로 완성되는 마케팅</h2>
          <p className="text-gray-500 text-base">설정도, 프롬프트도 필요 없습니다</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map((step, i) => (
            <div key={i} className="text-center md:text-left">
              <div className="text-4xl font-extrabold text-navy/10 mb-3">{step.num}</div>
              <h3 className="text-lg font-bold text-gray-900 mb-2 tracking-tight">{step.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Interactive Demo Section */}
      <section id="demo" ref={sectionRef} className="bg-gray-50 border-y border-gray-100">
        <div className="max-w-[1080px] mx-auto px-4 md:px-5 py-16 md:py-20">
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-1.5 bg-primary/10 text-primary px-3 py-1 rounded-[8px] text-xs font-semibold mb-4">
              <Play size={10} /> 데모
            </span>
            <h2 className="text-2xl md:text-[28px] font-bold text-gray-900 tracking-tight mb-3">실제 작동 모습을 확인하세요</h2>
            <p className="text-gray-500 text-base">날씨가 변하면 마케팅 문구도 자동으로 바뀝니다</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            {/* Input Panel */}
            <div className="bg-white rounded-[16px] border border-gray-100 p-6 shadow-card">
              <h3 className="text-sm font-bold text-gray-900 mb-4 tracking-tight">가게 정보 입력</h3>
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">업종</label>
                  <div className="flex gap-2">
                    {["국밥집", "카페", "식당", "미용실"].map((type) => (
                      <button key={type} className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${type === demoSteps[demoStep].business ? 'border-navy bg-navy/5 text-navy' : 'border-gray-200 text-gray-500 hover:border-gray-300'}`}>
                        {type}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">오늘의 날씨</label>
                  <div className="flex gap-2 flex-wrap">
                    {demoSteps.map((step, i) => (
                      <button key={i} onClick={() => setDemoStep(i)} className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${i === demoStep ? 'border-navy bg-navy/5 text-navy' : 'border-gray-200 text-gray-500 hover:border-gray-300'}`}>
                        {step.emoji} {step.weather}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <button className="w-full mt-5 bg-navy text-white font-medium py-2.5 rounded-full text-sm hover:shadow-hero transition-all hover:-translate-y-0.5 flex items-center justify-center gap-2">
                <Zap size={14} /> 마케팅 문구 생성
              </button>
            </div>

            {/* Output Panel */}
            <div className="bg-white rounded-[16px] border border-gray-100 p-6 shadow-card">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-gray-900 tracking-tight">AI 생성 결과</h3>
                <span className="text-[10px] bg-accent-green-light text-accent-green px-2 py-1 rounded-[8px] font-medium">자동 생성</span>
              </div>
              <div className="bg-accent-green-light/20 border border-accent-green/20 rounded-[12px] p-4 min-h-[120px]">
                <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {typedText}<span className={`inline-block w-0.5 h-4 bg-navy ml-0.5 ${isTyping ? 'animate-pulse' : 'opacity-0'}`}></span>
                </p>
              </div>
              <div className="flex items-center gap-2 mt-4">
                <span className="text-xs text-gray-400">복사</span>
                <span className="text-xs text-gray-400">|</span>
                <span className="text-xs text-gray-400">수정</span>
                <span className="text-xs text-gray-400">|</span>
                <span className="text-xs text-gray-400">카카오 전송</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="max-w-[1080px] mx-auto px-4 md:px-5 py-16 md:py-20">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-[28px] font-bold text-gray-900 tracking-tight mb-3">소상공인을 위한 6가지 AI 기능</h2>
          <p className="text-gray-500 text-base max-w-lg mx-auto">설정 없이 바로 사용할 수 있습니다</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((f, i) => (
            <div key={i} className="bg-white rounded-[16px] border border-gray-100 p-6 hover:shadow-card-lift hover:-translate-y-0.5 transition-all duration-200 cursor-pointer group">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4" style={{ backgroundColor: f.color + '15' }}>
                <f.icon size={20} style={{ color: f.color }} />
              </div>
              <h3 className="text-base font-bold text-gray-900 mb-2 tracking-tight group-hover:text-primary transition-colors">{f.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Social Proof */}
      <section className="bg-gray-50 border-y border-gray-100">
        <div className="max-w-[1080px] mx-auto px-4 md:px-5 py-16 md:py-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            {[
              { icon: Users, value: "470만+", label: "국내 소상공인" },
              { icon: TrendingUp, value: "1시간", label: "마케팅 시간 절약" },
              { icon: Clock, value: "실시간", label: "날씨 데이터 연동" },
            ].map((stat, i) => (
              <div key={i}>
                <stat.icon size={24} className="text-primary mx-auto mb-3" />
                <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
                <div className="text-sm text-gray-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-[1080px] mx-auto px-4 md:px-5 py-16 md:py-20 text-center">
        <h2 className="text-2xl md:text-[28px] font-bold text-gray-900 tracking-tight mb-3">지금 바로 시작해보세요</h2>
        <p className="text-gray-500 text-base mb-8">전북 소상공인이라면 누구나 무료로 사용할 수 있습니다</p>
        <Link to="/dashboard" className="inline-flex items-center gap-2 bg-navy text-white font-semibold px-8 py-3.5 rounded-full text-sm hover:shadow-hero transition-all hover:-translate-y-0.5">
          W-AI 대시보드 시작하기 <ArrowRight size={16} />
        </Link>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 bg-gray-50/30">
        <div className="max-w-[1080px] mx-auto px-4 md:px-5 py-8">
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