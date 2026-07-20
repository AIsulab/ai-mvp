import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight, Store, Cloud, BarChart2, Star, Zap,
  Play, Sparkles, Cpu, ShieldCheck, Database, FileText
} from "lucide-react";
import WelfareBlogBanner from '../components/WelfareBlogBanner';

const demoSteps = [
  { weather: "비 오는 오후 🌧️", business: "식당/국밥집", result: "오늘처럼 궂은 날엔 뜨끈한 국밥 한 그릇이 최고죠. 푹 끓여낸 진한 육수로 빗소리와 함께 든든하고 따뜻한 위로를 전합니다. 오늘 방문하시는 모든 분께 맛있는 미니 전을 서비스로 드립니다!" },
  { weather: "폭염 경보 🔥", business: "카페/디저트", result: "머리가 띵할 정도로 시원한 살얼음 수박주스 개시! 푹푹 찌는 무더위에 지친 몸과 마음에 시원한 청량감을 선물해 드릴게요. 에어컨 빵빵하게 켜두고 기다리겠습니다 🍉" },
  { weather: "함박눈 내리는 날 ❄️", business: "베이커리", result: "눈 내리는 하얀 겨울날의 낭만을 갓 구워낸 따뜻한 단팥빵과 함께하세요. 달콤한 단팥과 바삭한 식감이 오늘 하루를 더욱 특별하고 포근하게 채워드립니다 ☕" },
];

export default function LandingPage() {
  const [demoStep, setDemoStep] = useState(0);
  const [typedText, setTypedText] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  // 데모 탭 루프 (4초 간격)
  useEffect(() => {
    const interval = setInterval(() => {
      setDemoStep((prev) => (prev + 1) % demoSteps.length);
    }, 5500);
    return () => clearInterval(interval);
  }, []);

  // 타이핑 효과 구현
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
    }, 20);
    return () => clearInterval(typeInterval);
  }, [demoStep]);

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#0B0F19',
      color: '#F3F4F6',
      fontFamily: "'Pretendard Variable', 'Inter', sans-serif",
      overflowX: 'hidden',
      position: 'relative'
    }}>
      {/* ── 배경 오로라 이펙트 ── */}
      <div style={{ position: 'absolute', top: '-10%', left: '30%', width: 500, height: 500, background: 'radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', top: '20%', right: '10%', width: 450, height: 450, background: 'radial-gradient(circle, rgba(139,92,246,0.12) 0%, transparent 70%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '15%', left: '10%', width: 600, height: 600, background: 'radial-gradient(circle, rgba(6,182,212,0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />

      {/* ── 최상단 복지 블로그 띠 배너 ── */}
      <div style={{
        background: 'linear-gradient(90deg, #4f46e5, #7c3aed, #06b6d4)',
        padding: '8px 16px',
        textAlign: 'center',
        fontSize: 12,
        fontWeight: 700,
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justify: 'center',
        gap: 10,
        boxShadow: '0 2px 10px rgba(79, 70, 229, 0.3)'
      }}>
        <span style={{ background: 'rgba(255,255,255,0.2)', padding: '2px 8px', borderRadius: 100, fontSize: 10, fontWeight: 800 }}>복지정보 블로그</span>
        <span>⚡ 최신 복지·지원 정책 정보를 매일 업데이트하는 W-AI 복지 블로그</span>
        <a href="https://sutudio.dothome.co.kr/" target="_blank" rel="noopener noreferrer" style={{ color: '#fef08a', textDecoration: 'underline', fontWeight: 800, marginLeft: 4 }}>
          바로가기 →
        </a>
      </div>

      {/* ── 네비게이션 바 ── */}
      <nav style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        background: 'rgba(11, 15, 25, 0.85)',
        backdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.06)'
      }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 20px', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* 로고 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)' }}>
              <Store size={16} color="white" />
            </div>
            <span style={{ fontSize: 18, fontWeight: 800, color: 'white', letterSpacing: '-0.02em' }}>W-AI</span>
            <span style={{ fontSize: 10, fontWeight: 700, color: '#818cf8', background: 'rgba(99, 102, 241, 0.15)', padding: '2px 8px', borderRadius: 100 }}>Beta</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            <a href="#about" style={{ fontSize: 13, color: 'rgba(255,255,255,0.65)', textDecoration: 'none', transition: 'color .2s' }}
              onMouseOver={e => e.target.style.color='white'} onMouseOut={e => e.target.style.color='rgba(255,255,255,0.65)'}>소개</a>
            <a href="#features" style={{ fontSize: 13, color: 'rgba(255,255,255,0.65)', textDecoration: 'none', transition: 'color .2s' }}
              onMouseOver={e => e.target.style.color='white'} onMouseOut={e => e.target.style.color='rgba(255,255,255,0.65)'}>핵심 기능</a>
            <a href="#public-data" style={{ fontSize: 13, color: 'rgba(255,255,255,0.65)', textDecoration: 'none', transition: 'color .2s' }}
              onMouseOver={e => e.target.style.color='white'} onMouseOut={e => e.target.style.color='rgba(255,255,255,0.65)'}>공공데이터 연동</a>
            <a href="#welfare-blog" style={{ fontSize: 13, color: '#a5b4fc', fontWeight: 700, textDecoration: 'none', transition: 'color .2s' }}
              onMouseOver={e => e.target.style.color='white'} onMouseOut={e => e.target.style.color='#a5b4fc'}>복지 정책 칼럼</a>
            <Link to="/dashboard" style={{
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              color: 'white',
              fontWeight: 700,
              padding: '8px 20px',
              borderRadius: 100,
              fontSize: 13,
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              boxShadow: '0 4px 20px rgba(99, 102, 241, 0.25)',
              transition: 'transform .2s, opacity .2s'
            }}
              onMouseOver={e => { e.currentTarget.style.transform='translateY(-1px)'; e.currentTarget.style.opacity='0.95'; }}
              onMouseOut={e => { e.currentTarget.style.transform=''; e.currentTarget.style.opacity='1'; }}>
              대시보드 시작 <ArrowRight size={13} />
            </Link>
          </div>
        </div>
      </nav>

      {/* ── 히어로 및 3초 직관성 실시간 데모 영역 ── */}
      <section id="about" style={{ padding: '80px 20px 64px', position: 'relative' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: 40, alignItems: 'center' }} className="demo-grid">
          
          {/* 왼쪽: 헤드라인 카피 */}
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(99, 102, 241, 0.12)', border: '1px solid rgba(99, 102, 241, 0.25)', borderRadius: 100, padding: '5px 14px', marginBottom: 24 }}>
              <Sparkles size={12} color="#a5b4fc" className="animate-pulse" />
              <span style={{ fontSize: 12, fontWeight: 700, color: '#a5b4fc', letterSpacing: '0.04em' }}>소상공인 전용 AI 경영 비서</span>
            </div>

            <h1 style={{ fontSize: 'clamp(32px, 5vw, 52px)', fontWeight: 900, color: 'white', lineHeight: 1.25, letterSpacing: '-0.03em', marginBottom: 20 }}>
              날씨 · 상권 · 리뷰를<br />
              AI가 자동 분석하는<br />
              <span style={{ background: 'linear-gradient(135deg, #818cf8, #a78bfa, #22d3ee)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                소상공인 경영 비서 W-AI
              </span>
            </h1>

            <p style={{ fontSize: 16, color: 'rgba(255, 255, 255, 0.65)', lineHeight: 1.7, marginBottom: 36, maxWidth: 540 }}>
              기상청 단기예보 데이터와 전북 빅데이터 허브를 AI가 융합 분석합니다. 복잡한 경영 분석부터 오늘의 날씨에 딱 맞춘 마케팅 메시지까지, 단 3초 만에 원클릭으로 해결하세요.
            </p>

            <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
              <Link to="/dashboard"
                style={{
                  background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                  color: 'white',
                  fontWeight: 800,
                  padding: '15px 36px',
                  borderRadius: 100,
                  fontSize: 15,
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  boxShadow: '0 8px 30px rgba(99, 102, 241, 0.35)',
                  transition: 'all .25s'
                }}
                onMouseOver={e => { e.currentTarget.style.transform='translateY(-2px)'; e.currentTarget.style.boxShadow='0 12px 35px rgba(99,102,241,0.45)'; }}
                onMouseOut={e => { e.currentTarget.style.transform=''; e.currentTarget.style.boxShadow='0 8px 30px rgba(99,102,241,0.35)'; }}>
                무료 체험하기 <ArrowRight size={16} />
              </Link>
            </div>
          </div>

          {/* 오른쪽: 3초 직관성 실시간 시뮬레이션 패널 (글래스모피즘 휴대폰 프레임 형태) */}
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div style={{
              width: '100%',
              maxWidth: 420,
              background: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: 28,
              padding: 24,
              boxShadow: '0 20px 50px rgba(0, 0, 0, 0.3), inset 0 1px 1px rgba(255,255,255,0.1)',
              backdropFilter: 'blur(20px)',
              position: 'relative'
            }}>
              {/* 상단 핀홀 카메라 데코 */}
              <div style={{ width: 60, height: 16, background: '#111827', borderRadius: 100, margin: '0 auto 20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#1e293b' }} />
              </div>

              {/* 디바이스 내부 화면 */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 18 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981', boxShadow: '0 0 8px #10b981' }} />
                <span style={{ fontSize: 11, color: '#a1a1aa', fontWeight: 600, letterSpacing: '0.05em' }}>실시간 W-AI 생성 시뮬레이션</span>
              </div>

              {/* 시뮬레이션 인풋 컨트롤 정보 */}
              <div style={{ background: 'rgba(0, 0, 0, 0.25)', borderRadius: 16, padding: 16, border: '1px solid rgba(255,255,255,0.04)', marginBottom: 16 }}>
                <div style={{ marginBottom: 12 }}>
                  <div style={{ fontSize: 10, color: '#71717a', fontWeight: 700, marginBottom: 6, textTransform: 'uppercase' }}>🌤️ 실시간 날씨 데이터</div>
                  <div style={{ display: 'flex', gap: 6 }}>
                    {demoSteps.map((step, idx) => (
                      <span key={idx} style={{
                        padding: '4px 10px',
                        borderRadius: 100,
                        fontSize: 11,
                        fontWeight: 600,
                        background: idx === demoStep ? 'rgba(99, 102, 241, 0.2)' : 'rgba(255,255,255,0.03)',
                        color: idx === demoStep ? '#a5b4fc' : '#52525b',
                        border: idx === demoStep ? '1px solid rgba(99, 102, 241, 0.4)' : '1px solid transparent',
                        transition: 'all .3s'
                      }}>
                        {step.weather.split(' ')[0]}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: 10, color: '#71717a', fontWeight: 700, marginBottom: 6, textTransform: 'uppercase' }}>🏪 추천 업종</div>
                  <span style={{
                    padding: '4px 10px',
                    borderRadius: 100,
                    fontSize: 11,
                    fontWeight: 700,
                    background: '#1f2937',
                    color: 'white',
                    border: '1px solid rgba(255,255,255,0.08)'
                  }}>
                    {demoSteps[demoStep].business}
                  </span>
                </div>
              </div>

              {/* 생성결과 말풍선 */}
              <div style={{
                background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.06), rgba(139, 92, 246, 0.06))',
                borderRadius: 16,
                padding: 16,
                border: '1px solid rgba(99, 102, 241, 0.15)',
                minHeight: 140,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}>
                <div>
                  <div style={{ fontSize: 10, fontWeight: 800, color: '#818cf8', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Sparkles size={11} /> AI 실시간 분석 문구
                  </div>
                  <p style={{ fontSize: 12, color: '#e4e4e7', lineHeight: 1.6, margin: 0 }}>
                    "{typedText}
                    <span style={{
                      display: 'inline-block',
                      width: 1.5,
                      height: 13,
                      background: '#818cf8',
                      marginLeft: 2,
                      verticalAlign: 'middle',
                      opacity: isTyping ? 1 : 0,
                      animation: isTyping ? 'pulse 1s infinite' : 'none'
                    }} />"
                  </p>
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 10 }}>
                  <span style={{ fontSize: 9, color: '#52525b', fontWeight: 600 }}>W-AI Engine v2.0</span>
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* ── 핵심 기능 3개 카드 섹션 (우선순위 2 요구사항) ── */}
      <section id="features" style={{ padding: '80px 20px', background: '#0F1322', borderTop: '1px solid rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          
          <div style={{ textAlign: 'center', marginBottom: 50 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#6366f1', letterSpacing: '0.12em', marginBottom: 10, textTransform: 'uppercase' }}>CORE FEATURES</div>
            <h2 style={{ fontSize: 'clamp(24px, 4vw, 34px)', fontWeight: 800, color: 'white', letterSpacing: '-0.02em', marginBottom: 12 }}>
              소상공인 사장님을 위한 핵심 3대 AI 서비스
            </h2>
            <p style={{ fontSize: 14, color: 'rgba(255, 255, 255, 0.45)', maxWidth: 600, margin: '0 auto' }}>
              어려운 상권 분석부터 복잡한 날씨 마케팅, 고객 리뷰 응대까지 인공지능이 즉시 해결해드립니다.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }} className="features-grid">
            
            {/* 카드 1: WEATHER AI */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid rgba(255, 255, 255, 0.05)',
              borderRadius: 20,
              padding: 30,
              transition: 'all .3s ease',
              cursor: 'pointer'
            }}
              onMouseOver={e => { e.currentTarget.style.background='rgba(255,255,255,0.04)'; e.currentTarget.style.borderColor='rgba(99,102,241,0.25)'; e.currentTarget.style.transform='translateY(-4px)'; }}
              onMouseOut={e => { e.currentTarget.style.background='rgba(255,255,255,0.02)'; e.currentTarget.style.borderColor='rgba(255,255,255,0.05)'; e.currentTarget.style.transform=''; }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(99, 102, 241, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
                <Cloud size={20} color="#818cf8" />
              </div>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: 'white', marginBottom: 10 }}>WEATHER AI</h3>
              <p style={{ fontSize: 13, color: 'rgba(255, 255, 255, 0.55)', lineHeight: 1.6, marginBottom: 20 }}>
                기상청 실시간 기후 빅데이터와 연계하여 오늘의 비, 한파, 폭염 등 날씨 변화에 맞춘 최적의 마케팅 홍보 문구와 타겟 전략을 즉시 생성해 냅니다.
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 700, color: '#818cf8' }}>
                오늘의 날씨 마케팅 문구 생성 <ArrowRight size={13} />
              </div>
            </div>

            {/* 카드 2: 상권 분석 */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid rgba(255, 255, 255, 0.05)',
              borderRadius: 20,
              padding: 30,
              transition: 'all .3s ease',
              cursor: 'pointer'
            }}
              onMouseOver={e => { e.currentTarget.style.background='rgba(255,255,255,0.04)'; e.currentTarget.style.borderColor='rgba(139,92,246,0.25)'; e.currentTarget.style.transform='translateY(-4px)'; }}
              onMouseOut={e => { e.currentTarget.style.background='rgba(255,255,255,0.02)'; e.currentTarget.style.borderColor='rgba(255,255,255,0.05)'; e.currentTarget.style.transform=''; }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(139, 92, 246, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
                <BarChart2 size={20} color="#a78bfa" />
              </div>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: 'white', marginBottom: 10 }}>지능형 상권 분석</h3>
              <p style={{ fontSize: 13, color: 'rgba(255, 255, 255, 0.55)', lineHeight: 1.6, marginBottom: 20 }}>
                우리 동네 인구의 성별 · 연령대별 실시간 유동인구 지표와 업종 카테고리별 매출 추이 데이터를 시각화된 지도 및 통계 자료로 손쉽게 확인하세요.
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 700, color: '#a78bfa' }}>
                우리 동네 실시간 유동인구 조회 <ArrowRight size={13} />
              </div>
            </div>

            {/* 카드 3: 리뷰 자동 답변 */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid rgba(255, 255, 255, 0.05)',
              borderRadius: 20,
              padding: 30,
              transition: 'all .3s ease',
              cursor: 'pointer'
            }}
              onMouseOver={e => { e.currentTarget.style.background='rgba(255,255,255,0.04)'; e.currentTarget.style.borderColor='rgba(34,211,238,0.25)'; e.currentTarget.style.transform='translateY(-4px)'; }}
              onMouseOut={e => { e.currentTarget.style.background='rgba(255,255,255,0.02)'; e.currentTarget.style.borderColor='rgba(255,255,255,0.05)'; e.currentTarget.style.transform=''; }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(6, 182, 212, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
                <Star size={20} color="#22d3ee" />
              </div>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: 'white', marginBottom: 10 }}>리뷰 자동답변</h3>
              <p style={{ fontSize: 13, color: 'rgba(255, 255, 255, 0.55)', lineHeight: 1.6, marginBottom: 20 }}>
                배달의민족, 네이버플레이스, 구글지도에 달린 감사 리뷰나 위기 리뷰를 인공지능이 3초 만에 감성 분석해 정중하고 매끄러운 톤의 자동 대댓글을 작성합니다.
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 700, color: '#22d3ee' }}>
                리뷰 감성 분석 및 맞춤 답변 생성 <ArrowRight size={13} />
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ── 공공데이터 활용 섹션 (우선순위 2 요구사항) ── */}
      <section id="public-data" style={{ padding: '80px 20px', background: '#0B0F19' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', textAlign: 'center' }}>
          
          <div style={{
            background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.03), rgba(6, 182, 212, 0.03))',
            border: '1px solid rgba(255, 255, 255, 0.05)',
            borderRadius: 24,
            padding: '40px 30px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
          }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(6, 182, 212, 0.08)', borderRadius: 100, padding: '6px 14px', marginBottom: 20 }}>
              <Database size={12} color="#22d3ee" />
              <span style={{ fontSize: 11, fontWeight: 800, color: '#22d3ee', letterSpacing: '0.05em' }}>PUBLIC DATA LINK</span>
            </div>

            <h3 style={{ fontSize: 24, fontWeight: 800, color: 'white', marginBottom: 14 }}>
              검증된 공공데이터 기반의 맞춤형 추천 엔진
            </h3>
            
            <p style={{ fontSize: 14, color: 'rgba(255, 255, 255, 0.6)', lineHeight: 1.7, maxWidth: 660, margin: '0 auto 30px' }}>
              W-AI는 임의의 데이터를 생성하지 않습니다. **기상청 초단기 및 단기 단기예보 Open API**와 **전북 빅데이터 허브(소상공인 지원금 및 상권 데이터)**를 신뢰도 높게 수집하여 분석을 신뢰성 있게 도출해냅니다.
            </p>

            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.03)', padding: '10px 18px', borderRadius: 12, border: '1px solid rgba(255,255,255,0.05)' }}>
                <Cloud size={14} color="#818cf8" />
                <span style={{ fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.85)' }}>기상청 단기예보 API 실시간 연계</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.03)', padding: '10px 18px', borderRadius: 12, border: '1px solid rgba(255,255,255,0.05)' }}>
                <Database size={14} color="#22d3ee" />
                <span style={{ fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.85)' }}>전북 빅데이터 허브 연동 완료</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.03)', padding: '10px 18px', borderRadius: 12, border: '1px solid rgba(255,255,255,0.05)' }}>
                <FileText size={14} color="#a78bfa" />
                <span style={{ fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.85)' }}>정부 24 소상공인 최신 지원금 연동</span>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ── 복지 정책 칼럼 & 복지 블로그 섹션 ── */}
      <section id="welfare-blog" style={{ padding: '80px 20px', background: '#090C16', borderTop: '1px solid rgba(255,255,255,0.03)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <WelfareBlogBanner variant="dark" />
        </div>
      </section>

      {/* ── 최종 CTA 섹션 (우선순위 2 요구사항) ── */}
      <section style={{ background: 'linear-gradient(135deg, #0B0F19 0%, #151433 100%)', padding: '80px 20px', borderTop: '1px solid rgba(255,255,255,0.03)' }}>
        <div style={{ maxWidth: 600, margin: '0 auto', textAlign: 'center' }}>
          
          <div style={{ width: 52, height: 52, borderRadius: 16, background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', boxShadow: '0 4px 20px rgba(99, 102, 241, 0.4)' }}>
            <Store size={22} color="white" />
          </div>

          <h2 style={{ fontSize: 'clamp(24px, 4vw, 36px)', fontWeight: 800, color: 'white', letterSpacing: '-0.02em', marginBottom: 14 }}>
            사장님 브랜드를 가치있게, W-AI
          </h2>

          <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.6)', marginBottom: 36, lineHeight: 1.7 }}>
            전북 소상공인 사장님이라면 지금 누구나 조건 없이 가입 후 무료로 사용 가능합니다. 인공지능 비서와 함께 매출 상승을 경험해보세요.
          </p>

          <Link to="/dashboard"
            style={{
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              color: 'white',
              fontWeight: 800,
              padding: '16px 40px',
              borderRadius: 100,
              fontSize: 15,
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              boxShadow: '0 4px 25px rgba(99, 102, 241, 0.35)',
              transition: 'transform .2s'
            }}
            onMouseOver={e => e.currentTarget.style.transform='translateY(-2px)'}
            onMouseOut={e => e.currentTarget.style.transform=''}>
            대시보드 무료 체험 <ArrowRight size={16} />
          </Link>

        </div>
      </section>

      {/* ── 푸터 ── */}
      <footer style={{ background: '#090C15', borderTop: '1px solid rgba(255,255,255,0.05)', padding: '30px 20px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 24, height: 24, borderRadius: 6, background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Store size={12} color="white" />
            </div>
            <span style={{ fontSize: 13, fontWeight: 800, color: 'white' }}>W-AI</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            <a href="https://sutudio.dothome.co.kr/" target="_blank" rel="noopener noreferrer" style={{ fontSize: 11, color: '#a5b4fc', textDecoration: 'none' }}>
              복지정보 블로그 ↗
            </a>
            <span style={{ fontSize: 11, color: 'rgba(255, 255, 255, 0.3)' }}>Weather × Win × AI</span>
            <span style={{ fontSize: 11, color: 'rgba(255, 255, 255, 0.3)' }}>© W-AI</span>
          </div>
        </div>
      </footer>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        @media (max-width: 768px) {
          .demo-grid { grid-template-columns: 1fr !important; gap: 30px !important; }
          .features-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
