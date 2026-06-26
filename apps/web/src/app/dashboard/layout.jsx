import { useState } from "react";
import { Link, useLocation, Outlet } from "react-router-dom";
import { LayoutDashboard, Cloud, Zap, Star, MapPin, Gift, ChevronRight, Menu, X, Sun, Moon } from "lucide-react";
import { useTheme } from "../../contexts/ThemeContext";
import ChatWidget from "../../components/ChatWidget";

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

  const isActive = (href) => {
    if (href === "/dashboard") return location.pathname === "/dashboard";
    return location.pathname.startsWith(href);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-20 z-20 md:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed md:sticky top-0 left-0 h-screen w-56 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col z-30 transition-transform duration-200 ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}>
        <div className="px-5 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <span className="text-base font-bold text-gray-900 dark:text-white tracking-tight">W-AI</span>
            <span className="text-[10px] border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400 px-1.5 py-0.5 rounded-full">와이</span>
          </Link>
          <button className="md:hidden" onClick={() => setSidebarOpen(false)}>
            <X size={16} className="text-gray-400" />
          </button>
        </div>

        <nav className="flex-1 px-3 py-3 space-y-0.5 overflow-y-auto">
          {navItems.map((item) => {
            const active = isActive(item.href);
            return (
              <Link key={item.href} to={item.href}
                className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-colors group ${active ? "bg-primary-light dark:bg-primary/20 text-primary font-medium" : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white"}`}>
                <span className="flex items-center gap-2.5">
                  <item.icon size={15} className={active ? "text-primary" : "text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300"} />
                  {item.label}
                </span>
                <span className="flex items-center gap-1">
                  {item.hot && <span className="text-[9px] bg-primary-light dark:bg-primary/20 text-primary px-1.5 py-0.5 rounded-full font-medium">HOT</span>}
                  {active && <ChevronRight size={12} className="text-primary" />}
                </span>
              </Link>
            );
          })}
        </nav>

        <div className="px-3 py-3 border-t border-gray-200 dark:border-gray-700 space-y-2">
          <button onClick={toggleTheme} className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            {isDark ? <Sun size={15} className="text-yellow-500" /> : <Moon size={15} />}
            <span>{isDark ? "라이트 모드" : "다크 모드"}</span>
          </button>
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg">
            <div className="w-6 h-6 rounded-full bg-primary-light dark:bg-primary/20 flex items-center justify-center">
              <span className="text-xs font-semibold text-primary">사</span>
            </div>
            <span className="text-xs text-gray-600 dark:text-gray-400 font-medium">사장님 계정</span>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile menu button - floating */}
        <button className="md:hidden fixed top-3 right-3 z-50 p-2 bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700" onClick={() => setSidebarOpen(true)}>
          <Menu size={18} className="text-gray-600 dark:text-gray-400" />
        </button>

        <main className="flex-1 overflow-x-hidden overflow-y-auto">
          <Outlet />
        </main>
        
        <ChatWidget />
      </div>
    </div>
  );
}
