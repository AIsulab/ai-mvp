import { useState } from "react";
import { Link, useLocation, Outlet } from "react-router-dom";
import {
  LayoutDashboard,
  Cloud,
  Zap,
  Star,
  MapPin,
  Gift,
  ChevronRight,
  Menu,
  X,
} from "lucide-react";
import ChatWidget from "../../components/ChatWidget";

const navItems = [
  { icon: LayoutDashboard, label: "대시보드", href: "/dashboard" },
  {
    icon: Cloud,
    label: "날씨 마케팅",
    href: "/dashboard/weather-marketing",
    hot: true,
  },
  { icon: Zap, label: "SNS 콘텐츠", href: "/dashboard/sns-content" },
  { icon: Star, label: "리뷰 답변", href: "/dashboard/review-reply" },
  { icon: MapPin, label: "상권 분석", href: "/dashboard/market-analysis" },
  { icon: Gift, label: "지원금 매칭", href: "/dashboard/support-fund" },
];

export default function DashboardLayout() {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isActive = (href) => {
    if (href === "/dashboard") return location.pathname === "/dashboard";
    return location.pathname.startsWith(href);
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] flex">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-20 z-20 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed md:sticky top-0 left-0 h-screen w-56 bg-white border-r border-gray-200 flex flex-col z-30 transition-transform duration-200 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        {/* Logo */}
        <div className="px-5 py-5 border-b border-gray-200 flex items-center justify-between">
          <Link
            to="/"
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <span className="text-base font-semibold text-gray-900 tracking-tight">
              W-AI
            </span>
            <span className="text-[10px] border border-gray-200 text-gray-600 px-1.5 py-0.5 rounded-full">
              와이
            </span>
          </Link>
          <button className="md:hidden" onClick={() => setSidebarOpen(false)}>
            <X size={16} className="text-gray-400" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          <p className="text-[10px] font-medium text-gray-400 uppercase tracking-wider px-2 mb-3">
            메뉴
          </p>
          {navItems.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                to={item.href}
                className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-colors group ${
                  active
                    ? "bg-[#EFF6FF] text-[#2563EB] font-medium"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <span className="flex items-center gap-2.5">
                  <item.icon
                    size={15}
                    className={
                      active
                        ? "text-[#2563EB]"
                        : "text-gray-400 group-hover:text-gray-600"
                    }
                  />
                  {item.label}
                </span>
                <span className="flex items-center gap-1">
                  {item.hot && (
                    <span className="text-[9px] bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded-full font-medium">
                      HOT
                    </span>
                  )}
                  {active && (
                    <ChevronRight size={12} className="text-[#2563EB]" />
                  )}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="px-3 py-4 border-t border-gray-200">
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg">
            <div className="w-6 h-6 rounded-full bg-blue-50 flex items-center justify-center">
              <span className="text-xs font-semibold text-blue-600">사</span>
            </div>
            <span className="text-xs text-gray-600 font-medium">
              사장님 계정
            </span>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        {/* Main Header */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-10 shrink-0">
          <div className="flex items-center justify-between px-6 py-4">
            <h1 className="text-xl font-bold text-gray-900">
              {navItems.find((i) => isActive(i.href))?.label || "W-AI"}
            </h1>
            <div className="flex items-center gap-4">
              <button
                className="md:hidden p-1 rounded-lg hover:bg-gray-50 transition-colors"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu size={18} className="text-gray-600" />
              </button>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto">
          <Outlet />
        </main>
        
        {/* Global Chat Widget */}
        <ChatWidget />
      </div>
    </div>
  );
}
