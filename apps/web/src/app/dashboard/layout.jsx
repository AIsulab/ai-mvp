import { useState, useEffect, useCallback, useRef } from "react";
import { Link, useLocation, Outlet } from "react-router-dom";
import { LayoutDashboard, Cloud, Zap, Star, MapPin, Gift, ChevronRight, Menu, X, Sun, Moon, Store } from "lucide-react";
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

  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  const handleTouchStart = useCallback((e) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  }, []);

  const handleTouchEnd = useCallback((e) => {
    if (!sidebarOpen) return;
    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;
    const deltaX = touchEndX - touchStartX.current;
    const deltaY = Math.abs(touchEndY - touchStartY.current);
    if (deltaX < -80 && deltaY < 50) {
      setSidebarOpen(false);
    }
  }, [sidebarOpen]);

  return (
    <div className="min-h-screen flex" onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
      <DemoOnboarding />

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-20 md:hidden animate-fade-in"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed md:sticky top-0 left-0 h-screen w-[200px] bg-[#111827] flex flex-col z-30 transition-all duration-300 ease-out ${sidebarOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full md:translate-x-0"}`}>
        <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center shrink-0">
              <Store size={14} className="text-white" />
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-base font-bold text-white tracking-tight">W-AI</span>
              <span className="text-[10px] bg-primary/20 text-primary px-1.5 py-0.5 rounded-full font-medium">Beta</span>
            </div>
          </Link>
          <button className="md:hidden p-1.5 rounded-lg hover:bg-white/10 transition-colors" onClick={() => setSidebarOpen(false)}>
            <X size={16} className="text-white/60" />
          </button>
        </div>

        <nav className="flex-1 px-3 py-3 space-y-0.5 overflow-y-auto">
          {navItems.map((item) => {
            const active = isActive(item.href);
            return (
              <Link key={item.href} to={item.href}
                className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-all duration-150 group ${active ? "bg-white/10 text-white font-semibold" : "text-white/60 hover:bg-white/5 hover:text-white active:scale-[0.98]"}`}>
                <span className="flex items-center gap-2.5">
                  <item.icon size={16} className={active ? "text-white" : "text-white/40 group-hover:text-white/70"} />
                  {item.label}
                </span>
                <span className="flex items-center gap-1.5">
                  {item.hot && <span className="text-[9px] bg-primary/30 text-primary px-1.5 py-0.5 rounded-full font-semibold">HOT</span>}
                  {active && <div className="w-1.5 h-1.5 rounded-full bg-primary" />}
                </span>
              </Link>
            );
          })}
        </nav>

        <div className="px-3 py-3 border-t border-white/10">
          <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg bg-white/5">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
              <span className="text-xs font-bold text-white">사</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-white truncate">사장님 계정</p>
              <p className="text-[10px] text-white/40">Free Plan</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#F9FAFB] dark:bg-gray-900">
        {/* Mobile header bar */}
        <div className="md:hidden sticky top-0 z-10 bg-white/90 dark:bg-gray-800/90 backdrop-blur-md border-b border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between px-4 py-2.5">
            <button className="p-2 -ml-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors active:scale-95" onClick={() => setSidebarOpen(true)}>
              <Menu size={20} className="text-gray-600 dark:text-gray-400" />
            </button>
            <span className="text-sm font-semibold text-gray-900 dark:text-white">
              {navItems.find((item) => isActive(item.href))?.label || "W-AI"}
            </span>
            <div className="w-9" />
          </div>
        </div>

        <main className="flex-1 h-full overflow-x-hidden overflow-y-auto">
          <div className="max-w-[1100px] mx-auto px-8 py-7">
            <Outlet />
          </div>
        </main>

        {/* Theme toggle */}
        <div className="fixed bottom-24 right-4 md:right-6 z-40">
          <button onClick={toggleTheme} className="w-12 h-12 md:w-14 md:h-14 bg-primary hover:bg-primary-dark text-white rounded-full shadow-xl flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95" aria-label="테마 전환">
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>

        <ChatWidget />
      </div>
    </div>
  );
}
