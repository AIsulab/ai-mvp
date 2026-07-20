import { useState, useEffect } from "react";
import { ExternalLink, Sparkles, Newspaper, ArrowUpRight, Calendar, ShieldCheck, RefreshCw } from "lucide-react";

const FALLBACK_POSTS = [
  {
    id: 32,
    title: "재택으로 가능한 부업 추천 | 직장인·주부 2026년 최신판",
    excerpt: "직장인의 퇴근 후 파이프라인 형성 및 주부의 가사 병행 활동을 위해 특별히 안전하고 실효성이 높은 대표적인 재택 부업 5가지를 현실적인 급여 수준과 함께 추천해 드립니다.",
    date: "2026-07-16",
    link: "https://sutudio.dothome.co.kr/2026-side-hustles/",
    category: "재택 부업"
  },
  {
    id: 31,
    title: "2026년 달라지는 정부 지원 정책 10가지 완벽 정리",
    excerpt: "2026년부터 새롭게 시행되거나 혜택 조건이 대폭 인상되어 국민의 생활을 바꾸어 놓을 핵심 정부 지원 정책 10가지를 엄선하여 핵심만 총정리해 드립니다.",
    date: "2026-07-16",
    link: "https://sutudio.dothome.co.kr/2026-government-policy-10/",
    category: "정부 정책"
  },
  {
    id: 30,
    title: "2026년 기초생활수급자 조건 및 신청방법 총정리",
    excerpt: "2026년 새롭게 조정된 중위소득 기준에 따른 기초생활수급자 자격 조건과 생계·의료·주거·교육급여별 혜택 및 신청 방법을 알기 쉽게 정리해 드립니다.",
    date: "2026-07-15",
    link: "https://sutudio.dothome.co.kr/2026-livelihood-support/",
    category: "생활 복지"
  }
];

function stripHtml(html) {
  if (!html) return "";
  const doc = new DOMParser().parseFromString(html, 'text/html');
  let text = doc.body.textContent || "";
  text = text.replace(/더 읽기|이 글은|\.\.\./g, '').trim();
  if (text.length > 90) text = text.slice(0, 90) + "...";
  return text;
}

function formatDate(isoStr) {
  if (!isoStr) return "";
  try {
    const d = new Date(isoStr);
    return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
  } catch {
    return isoStr.split('T')[0] || isoStr;
  }
}

export default function WelfareBlogBanner({ variant = "dark" }) {
  const [posts, setPosts] = useState(FALLBACK_POSTS);
  const [isLoading, setIsLoading] = useState(true);
  const [isLive, setIsLive] = useState(false);

  useEffect(() => {
    let isMounted = true;
    async function fetchWpPosts() {
      try {
        const res = await fetch("https://sutudio.dothome.co.kr/wp-json/wp/v2/posts?per_page=3");
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0 && isMounted) {
            const formatted = data.map((p) => ({
              id: p.id,
              title: p.title?.rendered ? p.title.rendered.replace(/&#8211;/g, '-').replace(/&#038;/g, '&') : "복지 정책 소식",
              excerpt: stripHtml(p.excerpt?.rendered || p.content?.rendered),
              date: formatDate(p.date),
              link: p.link || "https://sutudio.dothome.co.kr/",
              category: "최신 복지정책"
            }));
            setPosts(formatted);
            setIsLive(true);
          }
        }
      } catch {
        // network failure or CORS fallback
        if (isMounted) setIsLive(false);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }
    fetchWpPosts();
    return () => { isMounted = false; };
  }, []);

  const isDark = variant === "dark";

  return (
    <div className={`w-full rounded-2xl transition-all ${
      isDark
        ? "bg-gradient-to-br from-gray-900/90 via-slate-900/80 to-indigo-950/40 border border-indigo-500/20 text-white shadow-2xl"
        : "bg-gradient-to-br from-indigo-50/70 via-white to-purple-50/50 border border-indigo-100 text-gray-900 shadow-lg"
    } p-6 md:p-8 backdrop-blur-xl relative overflow-hidden`}>
      
      {/* Background Accent Elements */}
      <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 rounded-full bg-purple-500/10 blur-3xl pointer-events-none" />

      {/* Header Info */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-6 border-b border-indigo-500/15">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/15 text-indigo-400 border border-indigo-500/30 mb-2.5">
            <Sparkles size={13} className="text-indigo-400 animate-pulse" />
            <span>W-AI × 복지정보 블로그</span>
            {isLive && (
              <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 bg-emerald-500/15 px-2 py-0.5 rounded-full font-semibold border border-emerald-500/30">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                실시간 연동중
              </span>
            )}
          </div>
          <h3 className={`text-xl md:text-2xl font-extrabold tracking-tight ${isDark ? "text-white" : "text-gray-900"}`}>
            매일 업데이트되는 최신 복지 정책 & 혜택 칼럼
          </h3>
          <p className={`text-xs md:text-sm mt-1.5 max-w-2xl ${isDark ? "text-gray-400" : "text-gray-600"}`}>
            W-AI와 함께 운영하는 복지 블로그에서 2026년 신규 지원금, 청년·소상공인 지원 정책, 생활 복지 정보를 매일 업데이트합니다.
          </p>
        </div>

        <div className="shrink-0 flex items-center gap-3">
          <a
            href="https://sutudio.dothome.co.kr/"
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs md:text-sm transition-all duration-200 ${
              isDark
                ? "bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40"
                : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-md"
            }`}
          >
            <span>복지모아 블로그 방문</span>
            <ExternalLink size={14} />
          </a>
        </div>
      </div>

      {/* Blog Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {isLoading ? (
          [1, 2, 3].map((n) => (
            <div key={n} className={`p-5 rounded-xl animate-pulse ${isDark ? "bg-white/5" : "bg-gray-100"}`}>
              <div className="h-4 w-20 bg-indigo-400/20 rounded mb-3" />
              <div className="h-5 w-full bg-indigo-400/20 rounded mb-2" />
              <div className="h-5 w-3/4 bg-indigo-400/20 rounded mb-4" />
              <div className="h-3 w-full bg-indigo-400/10 rounded mb-1" />
              <div className="h-3 w-2/3 bg-indigo-400/10 rounded" />
            </div>
          ))
        ) : (
          posts.map((post) => (
            <a
              key={post.id}
              href={post.link}
              target="_blank"
              rel="noopener noreferrer"
              className={`group flex flex-col justify-between p-5 rounded-xl border transition-all duration-300 transform hover:-translate-y-1 ${
                isDark
                  ? "bg-white/[0.03] hover:bg-white/[0.07] border-white/10 hover:border-indigo-500/40 shadow-lg"
                  : "bg-white hover:bg-indigo-50/40 border-gray-100 hover:border-indigo-200 shadow-sm hover:shadow-md"
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2.5">
                  <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                    isDark ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30" : "bg-indigo-100 text-indigo-700"
                  }`}>
                    {post.category}
                  </span>
                  <span className={`text-[11px] flex items-center gap-1 font-medium ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                    <Calendar size={11} /> {post.date}
                  </span>
                </div>

                <h4 className={`text-sm md:text-base font-bold line-clamp-2 leading-snug mb-2 group-hover:text-indigo-400 transition-colors ${
                  isDark ? "text-white" : "text-gray-900"
                }`}>
                  {post.title}
                </h4>

                <p className={`text-xs line-clamp-3 leading-relaxed mb-4 ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                  {post.excerpt}
                </p>
              </div>

              <div className={`pt-3 border-t text-xs font-semibold flex items-center justify-between ${
                isDark ? "border-white/5 text-indigo-400 group-hover:text-indigo-300" : "border-gray-100 text-indigo-600 group-hover:text-indigo-700"
              }`}>
                <span>자세히 읽기</span>
                <ArrowUpRight size={14} className="transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </div>
            </a>
          ))
        )}
      </div>

      {/* Footer Disclaimer */}
      <div className={`mt-6 pt-4 border-t flex items-center justify-between flex-wrap gap-2 text-[11px] ${
        isDark ? "border-white/5 text-gray-500" : "border-gray-100 text-gray-400"
      }`}>
        <div className="flex items-center gap-1.5">
          <ShieldCheck size={13} className="text-indigo-400" />
          <span>본 정보는 W-AI와 함께 운영하는 <strong>복지정보 블로그</strong>에서 제공됩니다.</span>
        </div>
        <span className="font-mono">https://sutudio.dothome.co.kr</span>
      </div>
    </div>
  );
}
