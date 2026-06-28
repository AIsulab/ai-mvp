import { useState, useEffect, useCallback, useRef } from "react";
import { Link, useLocation, Outlet } from "react-router-dom";
import { LayoutDashboard, Cloud, Zap, Star, MapPin, Gift, Menu, X, Sun, Moon, Store, ChevronRight } from "lucide-react";
import { useTheme } from "../../contexts/ThemeContext";
import ChatWidget from "../../components/ChatWidget";
import DemoOnboarding from "../../components/DemoOnboarding";

const navItems = [
  { icon: LayoutDashboard, label: "대시보드", href: "/dashboard" },
  { icon: Cloud, label: "날씨 마케팅", href: "/dashboard/weather-marketing", hot: true },
  { icon: Zap, label: "SNS 콘텐츠", href: "/dashboard/sns-content" },
  { icon: Star, label: "리뷰 답변", href: "/dashboard/review-reply" },
  { icon: MapPin, label: "상권 분석", href: "/dashboard/market-analysis" },
  { icon: Gift, label: "지원금 매칭", href: "/dashboard/support-fund" },
];

export default function DashboardLayout() {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { isDark, toggleTheme } = useTheme();
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);

  const isActive = (href) => {
    if (href === "/dashboard") return location.pathname === "/dashboard";
    return location.pathname.startsWith(href);
  };

  useEffect(() => { setSidebarOpen(false); }, [location.pathname]);

  const handleTouchStart = useCallback((e) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  }, []);

  const handleTouchEnd = useCallback((e) => {
    if (!sidebarOpen) return;
    const deltaX = e.changedTouches[0].clientX - touchStartX.current;
    const deltaY = Math.abs(e.changedTouches[0].clientY - touchStartY.current);
    if (deltaX < -80 && deltaY < 50) setSidebarOpen(false);
  }, [sidebarOpen]);

  return (
    <div className="min-h-screen flex bg-white" onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
      <DemoOnboarding />

      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-20 md:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed md:sticky top-0 left-0 h-screen w-60 bg-white border-r border-gray-100 flex flex-col z-30 transition-all duration-300 ease-out ${sidebarOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full md:translate-x-0"}`}>
        {/* Logo */}
        <div className="px-5 py-5 border-b border-gray-100">
          <Link to="/" className="flex items-center gap-2.5 hover:opacity-80 transition-opacity">
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center shadow-sm">
              <Store size={18} className="text-white" />
            </div>
            <div>
              <span className="text-base font-bold text-gray-900 tracking-tight">W-AI</span>
              <span className="text-[10px] bg-primary-50 text-primary ml-1.5 px-1.5 py-0.5 rounded-full font-medium">Beta</span>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const active = isActive(item.href);
            return (
              <Link key={item.href} to={item.href}
                className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-sm transition-all duration-150 ${
                  active
                    ? "bg-primary-50 text-primary font-semibold"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}>
                <span className="flex items-center gap-2.5">
                  <item.icon size={18} className={active ? "text-primary" : "text-gray-400"} />
                  {item.label}
                </span>
                <span className="flex items-center gap-1.5">
                  {item.hot && <span className="text-[9px] bg-primary-50 text-primary px-1.5 py-0.5 rounded-full font-semibold">HOT</span>}
                  {active && <ChevronRight size={14} className="text-primary" />}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* User Info */}
        <div className="px-3 py-3 border-t border-gray-100">
          <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-gray-50">
            <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
              <span className="text-xs font-bold text-primary">사</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-gray-900 truncate">사장님 계정</p>
              <p className="text-[10px] text-gray-400">Free Plan</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header */}
        <div className="md:hidden sticky top-0 z-10 bg-white/95 backdrop-blur-md border-b border-gray-100">
          <div className="flex items-center justify-between px-4 py-3">
            <button className="p-1.5 -ml-1 rounded-lg hover:bg-gray-100 transition-colors" onClick={() => setSidebarOpen(true)}>
              <Menu size={20} className="text-gray-600" />
            </button>
            <span className="text-sm font-semibold text-gray-900">
              {navItems.find((item) => isActive(item.href))?.label || "W-AI"}
            </span>
            <div className="w-8" />
          </div>
        </div>

        <main className="flex-1 h-full overflow-x-hidden overflow-y-auto">
          <Outlet />
        </main>

        {/* Theme Toggle */}
        <div className="fixed bottom-20 right-4 md:bottom-24 md:right-6 z-40">
          <button onClick={toggleTheme} className="w-11 h-11 md:w-12 md:h-12 bg-white hover:bg-gray-50 text-gray-600 rounded-full shadow-elevated border border-gray-200 flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95" aria-label="테마 전환">
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>

        <ChatWidget />
      </div>
    </div>
  );
}
