import { useState, useEffect } from "react";
import { X, ChevronRight, Sparkles, Zap, Star, ArrowRight } from "lucide-react";

const steps = [
  {
    title: "Welcome to W-AI",
    desc: "날씨 기반 AI 마케팅 자동화 플랫폼",
    icon: Sparkles,
    color: "from-blue-500 to-indigo-600",
    highlight: "기상청 공공데이터 + AI 결합",
  },
  {
    title: "날씨 마케팅 엔진",
    desc: "실시간 날씨 데이터로 업종 맞춤 문구 자동 생성",
    icon: Zap,
    color: "from-yellow-500 to-orange-500",
    highlight: "프롬프트 없이 클릭 한 번으로",
  },
  {
    title: "SNS 콘텐츠 자동화",
    desc: "인스타그램, 카카오, 네이버 포스팅 원클릭 생성",
    icon: Star,
    color: "from-purple-500 to-pink-500",
    highlight: "해시태그 + 스토리 아이디어 포함",
  },
];

export default function DemoOnboarding({ onComplete }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const hasSeen = localStorage.getItem("w-ai-onboarding-seen");
    if (!hasSeen) {
      setTimeout(() => setIsVisible(true), 800);
    }
  }, []);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      localStorage.setItem("w-ai-onboarding-seen", "true");
      setIsVisible(false);
      onComplete?.();
    }
  };

  const handleSkip = () => {
    localStorage.setItem("w-ai-onboarding-seen", "true");
    setIsVisible(false);
    onComplete?.();
  };

  if (!isVisible) return null;

  const step = steps[currentStep];
  const Icon = step.icon;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-sm mx-4 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden animate-scale-in">
        <div className={`bg-gradient-to-r ${step.color} px-6 pt-8 pb-10 text-white text-center`}>
          <button onClick={handleSkip} className="absolute top-4 right-4 p-1 rounded-full hover:bg-white/20 transition-colors">
            <X size={16} />
          </button>
          <div className="w-14 h-14 mx-auto mb-4 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
            <Icon size={28} />
          </div>
          <h2 className="text-lg font-bold mb-1">{step.title}</h2>
          <p className="text-white/80 text-sm">{step.desc}</p>
        </div>

        <div className="px-6 py-5">
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 mb-5">
            <p className="text-sm font-medium text-gray-900 dark:text-white text-center">{step.highlight}</p>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex gap-1.5">
              {steps.map((_, i) => (
                <div key={i} className={`h-1.5 rounded-full transition-all duration-300 ${i === currentStep ? "w-6 bg-primary" : i < currentStep ? "w-1.5 bg-primary/50" : "w-1.5 bg-gray-300 dark:bg-gray-600"}`} />
              ))}
            </div>

            <button onClick={handleNext} className="flex items-center gap-1.5 bg-primary hover:bg-primary-dark text-white text-sm font-medium px-4 py-2 rounded-lg transition-all hover:shadow-md active:scale-95">
              {currentStep < steps.length - 1 ? (
                <>다음 <ChevronRight size={14} /></>
              ) : (
                <>시작하기 <ArrowRight size={14} /></>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
