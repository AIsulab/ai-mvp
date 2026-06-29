import { useState, useEffect, useCallback, useRef } from "react";
import { Link, useLocation, Outlet } from "react-router-dom";
import { LayoutDashboard, Cloud, Zap, Star, MapPin, Gift, Menu, Sun, Moon, Store } from "lucide-react";
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

  const isActive = (href) => {
    if (href === "/dashboard") return location.pathname === "/dashboard";
    return location.pathname.startsWith(href);
  };

  useEffect(() => { setSidebarOpen(false); }, [location.pathname]);

  const handleTouchStart = useCallback((e) => {
    touchStartX.current = e.touches[0].clientX;
  }, []);

  const handleTouchEnd = useCallback((e) => {
    if (!sidebarOpen) return;
    const deltaX = e.changedTouches[0].clientX - touchStartX.current;
    if (deltaX < -80) setSidebarOpen(false);
  }, [sidebarOpen]);

  return (
    <div className="min-h-screen flex bg-white" onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
      <DemoOnboarding />

      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/20 z-20 md:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed md:sticky top-0 left-0 h-screen w-[220px] bg-white border-r border-gray-100 flex flex-col z-30 transition-all duration-200 ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}>
        {/* Logo */}
        <div className="px-4 h-14 flex items-center border-b border-gray-100">
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="w-7 h-7 rounded-lg bg-gray-900 flex items-center justify-center">
              <Store size={13} className="text-white" />
            </div>
            <span className="text-[14px] font-bold text-gray-900">W-AI</span>
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-3 space-y-0.5 overflow-y-auto">
          {navItems.map((item) => {
            const active = isActive(item.href);
            return (
              <Link key={item.href} to={item.href}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] transition-all ${
                  active
                    ? "bg-gray-900 text-white font-medium"
                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                }`}>
                <item.icon size={15} className={active ? "text-white" : "text-gray-400"} />
                {item.label}
                {item.hot && !active && <span className="ml-auto text-[9px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded-full">HOT</span>}
              </Link>
            );
          })}
        </nav>

        {/* User */}
        <div className="px-3 py-3 border-t border-gray-100">
          <div className="flex items-center gap-2 px-2 py-2 rounded-lg bg-gray-50">
            <div className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center">
              <span className="text-[10px] font-bold text-gray-600">사</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[11px] font-medium text-gray-900 truncate">사장님</p>
              <p className="text-[9px] text-gray-400">Free Plan</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header */}
        <div className="md:hidden sticky top-0 z-10 bg-white border-b border-gray-100">
          <div className="flex items-center justify-between px-4 h-12">
            <button className="p-1 -ml-1" onClick={() => setSidebarOpen(true)}>
              <Menu size={18} className="text-gray-600" />
            </button>
            <span className="text-[13px] font-medium text-gray-900">
              {navItems.find((item) => isActive(item.href))?.label || "W-AI"}
            </span>
            <div className="w-7" />
          </div>
        </div>

        <main className="flex-1 overflow-x-hidden overflow-y-auto">
          <Outlet />
        </main>

        {/* Theme Toggle */}
        <div className="fixed bottom-16 right-4 md:bottom-6 md:right-6 z-40">
          <button onClick={toggleTheme} className="w-10 h-10 bg-white border border-gray-200 rounded-full shadow-card flex items-center justify-center hover:shadow-card-hover transition-all" aria-label="테마 전환">
            {isDark ? <Sun size={15} /> : <Moon size={15} />}
          </button>
        </div>

        <ChatWidget />
      </div>
    </div>
  );
}
