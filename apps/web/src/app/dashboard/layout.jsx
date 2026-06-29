import { useState, useEffect, useCallback, useRef } from "react";
import { Link, useLocation, Outlet } from "react-router-dom";
import { LayoutDashboard, Cloud, Zap, Star, MapPin, Gift, BookOpen, Menu, X, Sun, Moon, Store } from "lucide-react";
import { useTheme } from "../../contexts/ThemeContext";
import ChatWidget from "../../components/ChatWidget";
import DemoOnboarding from "../../components/DemoOnboarding";

const navItems = [
  { icon: LayoutDashboard, label: "대시보드", href: "/dashboard" },
  { icon: Cloud, label: "날씨 마케팅", href: "/dashboard/weather-marketing", hot: true },
  { icon: Zap, label: "SNS 콘텐츠", href: "/dashboard/sns-content" },
  { icon: Star, label: "리뷰 답변", href: "/dashboard/review-reply" },
  { icon: BookOpen, label: "프롬프트 보드", href: "/dashboard/prompt-board", new: true },
  { icon: MapPin, label: "상권 분석", href: "/dashboard/market-analysis" },
  { icon: Gift, label: "지원금 매칭", href: "/dashboard/support-fund" },
];

export default function DashboardLayout() {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isDark, toggleTheme } = useTheme();

  const isActive = (href) => {
    if (href === "/dashboard") return location.pathname === "/dashboard";
    return location.pathname.startsWith(href);
  };

  useEffect(() => { setMobileMenuOpen(false); }, [location.pathname]);

  return (
    <div className="min-h-screen bg-white">
      <DemoOnboarding />

      {/* Top Nav */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-sm border-b border-gray-100">
        <div className="max-w-[890px] mx-auto px-5">
          <div className="h-14 flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <div className="w-8 h-8 rounded-lg bg-gray-900 flex items-center justify-center">
                <Store size={15} className="text-white" />
              </div>
              <span className="text-[16px] font-bold text-gray-900">W-AI</span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-1">
              {navItems.map((item) => {
                const active = isActive(item.href);
                return (
                  <Link key={item.href} to={item.href}
                    className={`px-3 py-2 rounded-lg text-[14px] font-medium transition-all flex items-center gap-1.5 ${
                      active
                        ? "bg-gray-900 text-white"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }`}>
                    <item.icon size={15} />
                    {item.label}
                    {item.hot && !active && <span className="text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded">HOT</span>}
                    {item.new && !active && <span className="text-[10px] bg-blue-100 text-blue-600 px-1.5 py-0.5 rounded">NEW</span>}
                  </Link>
                );
              })}
            </div>

            {/* Right */}
            <div className="flex items-center gap-2">
              <button onClick={toggleTheme} className="w-8 h-8 rounded-lg hover:bg-gray-50 flex items-center justify-center transition-colors">
                {isDark ? <Sun size={14} className="text-gray-500" /> : <Moon size={14} className="text-gray-500" />}
              </button>
              <button className="md:hidden p-1.5" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                {mobileMenuOpen ? <X size={18} className="text-gray-600" /> : <Menu size={18} className="text-gray-600" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-100 bg-white">
            <div className="max-w-[890px] mx-auto px-5 py-2">
              {navItems.map((item) => {
                const active = isActive(item.href);
                return (
                  <Link key={item.href} to={item.href}
                    className={`flex items-center gap-2.5 px-3 py-3 rounded-lg text-[15px] font-medium transition-all ${
                      active
                        ? "bg-gray-900 text-white"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }`}>
                    <item.icon size={16} />
                    {item.label}
                    {item.hot && !active && <span className="ml-auto text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded-full">HOT</span>}
                    {item.new && !active && <span className="ml-auto text-[10px] bg-blue-100 text-blue-600 px-1.5 py-0.5 rounded-full">NEW</span>}
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </nav>

      {/* Content */}
      <div className="max-w-[890px] mx-auto">
        <main className="min-h-[calc(100vh-56px)]">
          <Outlet />
        </main>
      </div>

      <ChatWidget />
    </div>
  );
}
