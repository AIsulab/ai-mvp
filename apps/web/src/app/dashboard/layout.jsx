import { useState, useEffect, useCallback, useRef } from "react";
import { Link, useLocation, Outlet } from "react-router-dom";
import {
  LayoutDashboard, Cloud, Zap, Star, MapPin, Gift,
  BookOpen, Bell, Menu, X, Sun, Moon, Store, LogOut,
  TrendingUp, ChevronDown
} from "lucide-react";
import { useTheme } from "../../contexts/ThemeContext";
import { useAuth } from "../../contexts/AuthContext";
import ChatWidget from "../../components/ChatWidget";
import DemoOnboarding from "../../components/DemoOnboarding";
import OfflineBar from "../../components/OfflineBar";

const navItems = [
  { type: "link", icon: LayoutDashboard, label: "대시보드", href: "/dashboard" },
  {
    type: "dropdown",
    label: "마케팅 자동화",
    id: "marketing",
    subItems: [
      { icon: Cloud, label: "날씨 마케팅", href: "/dashboard/weather-marketing", hot: true },
      { icon: Zap, label: "SNS 콘텐츠", href: "/dashboard/sns-content" },
      { icon: BookOpen, label: "프롬프트 보드", href: "/dashboard/prompt-board" }
    ]
  },
  {
    type: "dropdown",
    label: "데이터 분석",
    id: "analysis",
    subItems: [
      { icon: MapPin, label: "상권 분석", href: "/dashboard/market-analysis" },
      { icon: TrendingUp, label: "키워드 인사이트", href: "/dashboard/keyword-insight", new: true }
    ]
  },
  { type: "link", icon: Star, label: "리뷰 답변", href: "/dashboard/review-reply" },
  {
    type: "dropdown",
    label: "지원 & 소식",
    id: "support",
    subItems: [
      { icon: Gift, label: "지원금 매칭", href: "/dashboard/support-fund" },
      { icon: Bell, label: "공지사항", href: "/dashboard/notice" }
    ]
  }
];

export default function DashboardLayout() {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isDark, toggleTheme } = useTheme();
  const { user, isGuest, signOut } = useAuth();
  
  // 데스크톱 드롭다운 상태
  const [activeDropdown, setActiveDropdown] = useState(null);
  const timeoutRef = useRef(null);

  // 모바일 아코디언 상태
  const [mobileDropdowns, setMobileDropdowns] = useState({
    marketing: false,
    analysis: false,
    support: false
  });

  const isActive = useCallback((href) => {
    if (href === "/dashboard") return location.pathname === "/dashboard";
    return location.pathname.startsWith(href);
  }, [location.pathname]);

  const isGroupActive = useCallback((item) => {
    if (item.type === "link") return isActive(item.href);
    return item.subItems?.some(sub => isActive(sub.href));
  }, [isActive]);

  // 페이지 이동 시 메뉴 자동 닫기
  useEffect(() => {
    setMobileMenuOpen(false);
    setActiveDropdown(null);
  }, [location.pathname]);

  // 마우스 호버 지연 클로저 구현
  const handleMouseEnter = (id) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setActiveDropdown(id);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 150);
  };

  // 모바일 아코디언 토글
  const toggleMobileDropdown = (id) => {
    setMobileDropdowns(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <OfflineBar />
      <DemoOnboarding />

      {/* ── 상단 네비게이션 바 ── */}
      <nav className="sticky top-0 z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-b border-gray-100 dark:border-gray-800">
        <div className="max-w-[1100px] mx-auto px-5">
          <div className="h-14 flex items-center justify-between">
            {/* 로고 */}
            <Link to="/" className="flex items-center gap-2 hover:opacity-85 transition-opacity shrink-0">
              <div className="w-8 h-8 rounded-lg bg-gray-900 dark:bg-white flex items-center justify-center">
                <Store size={15} className="text-white dark:text-gray-900" />
              </div>
              <span className="text-[16px] font-bold tracking-tight">W-AI</span>
            </Link>

            {/* 데스크톱 메뉴 (한 줄 최적화) */}
            <div className="hidden md:flex items-center gap-1.5">
              {navItems.map((item, idx) => {
                if (item.type === "link") {
                  const active = isActive(item.href);
                  return (
                    <Link
                      key={idx}
                      to={item.href}
                      className={`px-3.5 py-2 rounded-xl text-[13px] md:text-[14px] font-bold transition-all flex items-center gap-1.5 ${
                        active
                          ? "bg-gray-900 text-white dark:bg-white dark:text-gray-900 shadow-sm"
                          : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white"
                      }`}
                    >
                      <item.icon size={14} />
                      {item.label}
                    </Link>
                  );
                }

                // 드롭다운 대메뉴 항목
                const hasActiveSub = isGroupActive(item);
                const isOpened = activeDropdown === item.id;
                
                return (
                  <div
                    key={idx}
                    className="relative"
                    onMouseEnter={() => handleMouseEnter(item.id)}
                    onMouseLeave={handleMouseLeave}
                  >
                    <button
                      className={`px-3.5 py-2 rounded-xl text-[13px] md:text-[14px] font-bold transition-all flex items-center gap-1.5 ${
                        hasActiveSub
                          ? "bg-gray-900/10 text-gray-900 dark:bg-white/10 dark:text-white"
                          : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white"
                      }`}
                    >
                      {item.label}
                      <ChevronDown
                        size={12}
                        className={`transition-transform duration-200 ${isOpened ? "rotate-180" : ""}`}
                      />
                    </button>

                    {/* 드롭다운 서브 레이어 (글래스모피즘) */}
                    {isOpened && (
                      <div className="absolute top-full left-0 mt-1 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border border-gray-100 dark:border-gray-800 rounded-2xl p-1.5 shadow-2xl min-w-[190px] z-[200] animate-fade-in">
                        {item.subItems.map((sub, sIdx) => {
                          const subActive = isActive(sub.href);
                          return (
                            <Link
                              key={sIdx}
                              to={sub.href}
                              className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-[12px] md:text-[13px] font-semibold transition-all ${
                                subActive
                                  ? "bg-gray-900 text-white dark:bg-white dark:text-gray-900 shadow-sm"
                                  : "text-gray-600 dark:text-gray-450 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white"
                              }`}
                            >
                              <sub.icon size={13} className={subActive ? "text-white dark:text-gray-900" : "text-gray-400"} />
                              {sub.label}
                              {sub.hot && !subActive && (
                                <span className="ml-auto text-[8px] font-bold bg-rose-100 dark:bg-rose-950/40 text-rose-500 px-1.5 py-0.5 rounded">HOT</span>
                              )}
                              {sub.new && !subActive && (
                                <span className="ml-auto text-[8px] font-bold bg-blue-100 dark:bg-blue-950/40 text-blue-500 px-1.5 py-0.5 rounded">NEW</span>
                              )}
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* 우측 유저 컨트롤 영역 */}
            <div className="flex items-center gap-1.5">
              <div className="hidden sm:flex items-center gap-1.5 mr-1 text-[11px] font-bold text-gray-500 bg-gray-50 dark:bg-gray-800/60 px-3 py-1 rounded-full border border-gray-100 dark:border-gray-800">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>{isGuest ? "데모 게스트" : user?.email}</span>
              </div>

              <button onClick={toggleTheme} className="w-8 h-8 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-850 flex items-center justify-center transition-colors">
                {isDark ? <Sun size={14} className="text-gray-400 hover:text-white" /> : <Moon size={14} className="text-gray-500" />}
              </button>
              
              <button 
                onClick={signOut}
                title="로그아웃"
                className="w-8 h-8 rounded-xl hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-950/20 flex items-center justify-center transition-colors"
              >
                <LogOut size={14} className="text-gray-450 hover:text-red-500" />
              </button>

              <button className="md:hidden p-1.5 rounded-xl hover:bg-gray-55 dark:hover:bg-gray-850" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                {mobileMenuOpen ? <X size={18} className="text-gray-500" /> : <Menu size={18} className="text-gray-500" />}
              </button>
            </div>
          </div>
        </div>

        {/* 모바일 햄버거 아코디언 메뉴 */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 max-h-[calc(100vh-56px)] overflow-y-auto shadow-2xl animate-fade-in">
            <div className="max-w-[890px] mx-auto px-5 py-3 space-y-1">
              {navItems.map((item, idx) => {
                if (item.type === "link") {
                  const active = isActive(item.href);
                  return (
                    <Link
                      key={idx}
                      to={item.href}
                      className={`flex items-center gap-2.5 px-3.5 py-3 rounded-xl text-[14px] font-bold transition-all ${
                        active
                          ? "bg-gray-900 text-white dark:bg-white dark:text-gray-900 shadow-sm"
                          : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"
                      }`}
                    >
                      <item.icon size={15} />
                      {item.label}
                    </Link>
                  );
                }

                // 모바일 아코디언 드롭다운 그룹
                const isGroupOpened = mobileDropdowns[item.id];
                const hasActiveSub = isGroupActive(item);

                return (
                  <div key={idx} className="space-y-0.5">
                    <button
                      onClick={() => toggleMobileDropdown(item.id)}
                      className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-[14px] font-bold transition-all ${
                        hasActiveSub
                          ? "bg-gray-100/50 dark:bg-gray-800/40 text-gray-900 dark:text-white"
                          : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"
                      }`}
                    >
                      <span className="flex items-center gap-2.5">
                        <ChevronDown size={14} className={`text-gray-400 transition-transform ${isGroupOpened ? "rotate-180" : ""}`} />
                        {item.label}
                      </span>
                    </button>

                    {/* 아코디언 하위 메뉴 리스트 */}
                    {isGroupOpened && (
                      <div className="pl-6 space-y-0.5 border-l border-gray-100 dark:border-gray-800 ml-5 py-1">
                        {item.subItems.map((sub, sIdx) => {
                          const subActive = isActive(sub.href);
                          return (
                            <Link
                              key={sIdx}
                              to={sub.href}
                              className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-[13px] font-semibold transition-all ${
                                subActive
                                  ? "bg-gray-900 text-white dark:bg-white dark:text-gray-900"
                                  : "text-gray-600 dark:text-gray-450 hover:bg-gray-50 dark:hover:bg-gray-800"
                              }`}
                            >
                              <sub.icon size={13} className={subActive ? "text-white dark:text-gray-900" : "text-gray-400"} />
                              {sub.label}
                              {sub.hot && !subActive && (
                                <span className="text-[8px] bg-rose-100 dark:bg-rose-950/40 text-rose-500 px-1.5 py-0.5 rounded">HOT</span>
                              )}
                              {sub.new && !subActive && (
                                <span className="text-[8px] bg-blue-100 dark:bg-blue-950/40 text-blue-500 px-1.5 py-0.5 rounded">NEW</span>
                              )}
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </nav>

      {/* ── 메인 콘텐츠 라우팅 영역 ── */}
      <div className="max-w-[1100px] mx-auto">
        <main className="min-h-[calc(100vh-56px)]">
          <Outlet />
        </main>
      </div>

      <ChatWidget />
    </div>
  );
}
