import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Store, Mail, Lock, ArrowRight, ShieldAlert } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { Button, Card } from "../../components/ui";

const socialProviders = [
  {
    key: "kakao",
    label: "카카오로 간편 로그인",
    bg: "bg-[#fee500] hover:bg-[#f7dc00]",
    text: "text-[#3c1e1e]",
    border: "border-[#e4d200]",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <path d="M12 3C6.48 3 2 6.58 2 10.94c0 2.82 1.86 5.3 4.65 6.76l-1.2 4.42a.5.5 0 00.76.54l5.08-3.36c.33.02.66.03 1 .03 5.52 0 10-3.58 10-7.99S17.52 3 12 3z" fill="#3C1E1E"/>
      </svg>
    ),
  },
  {
    key: "naver",
    label: "네이버로 간편 로그인",
    bg: "bg-[#03c75a] hover:bg-[#02b053]",
    text: "text-white",
    border: "border-[#02a14c]",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1.6 14.4V7.6L6.8 12v4.4h3.6zm5.6 0V7.6l-3.6 4.4v4.4h3.6z" fill="white"/>
      </svg>
    ),
  },
  {
    key: "google",
    label: "구글로 간편 로그인",
    bg: "bg-[#4285f4] hover:bg-[#357ae8]",
    text: "text-white",
    border: "border-[#357ae8]",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
      </svg>
    ),
  },
];

export default function LoginPage() {
  const { signIn, signUp, signInWithOAuth, enterGuestMode, isSupabaseConfigured } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState(null);

  const from = location.state?.from?.pathname || "/dashboard";

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError("이메일과 비밀번호를 모두 입력해주세요.");
      return;
    }
    setError("");
    setLoading(true);

    try {
      if (isSignUp) {
        await signUp(email, password);
        alert("회원가입이 완료되었습니다! 로그인해주세요.");
        setIsSignUp(false);
      } else {
        await signIn(email, password);
        navigate(from, { replace: true });
      }
    } catch (err) {
      setError(err.message || "오류가 발생했습니다. 입력 정보를 확인해주세요.");
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = async (provider) => {
    setError("");
    setSocialLoading(provider);

    try {
      const result = await signInWithOAuth(provider);
      if (result?.demo) {
        // Supabase 미설정 시 데모 모드로 이동
        navigate(from, { replace: true });
      }
      // Supabase 설정 시 리다이렉트 발생 — 아무것도 하지 않음
    } catch (err) {
      setError(err.message || `${provider} 로그인 중 오류가 발생했습니다.`);
      setSocialLoading(null);
    }
  };

  const handleGuestLogin = () => {
    enterGuestMode();
    navigate(from, { replace: true });
  };

  return (
    <div className="min-h-screen bg-[#0B0F19] flex items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Background Gradients */}
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-blue-900/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-purple-900/20 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-[440px] z-10">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-500/25">
            <Store size={22} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">W-AI</h1>
          <p className="text-sm text-gray-400 mt-1">AI 기반 소상공인 경영 비서 서비스</p>
        </div>

        {/* Login Card */}
        <Card className="bg-[#111827]/80 backdrop-blur-xl border border-gray-800 p-6 md:p-8 rounded-2xl shadow-2xl">
          <div className="flex gap-4 mb-6 border-b border-gray-800 pb-2">
            <button
              onClick={() => { setIsSignUp(false); setError(""); }}
              className={`pb-2 text-sm font-semibold transition-colors relative ${!isSignUp ? "text-blue-500" : "text-gray-400 hover:text-gray-200"}`}
            >
              로그인
              {!isSignUp && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500 rounded-full" />}
            </button>
            <button
              onClick={() => { setIsSignUp(true); setError(""); }}
              className={`pb-2 text-sm font-semibold transition-colors relative ${isSignUp ? "text-blue-500" : "text-gray-400 hover:text-gray-200"}`}
            >
              회원가입
              {isSignUp && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500 rounded-full" />}
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4" autoComplete="off">
            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-1.5">이메일 주소</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="email"
                  autoComplete="off"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  className="w-full bg-[#1F2937] border border-gray-700/60 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 disabled:opacity-50 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-1.5">비밀번호</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="password"
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full bg-[#1F2937] border border-gray-700/60 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 disabled:opacity-50 transition-all"
                />
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-950/40 border border-red-900/60 rounded-xl flex items-start gap-2.5">
                <ShieldAlert size={16} className="text-red-500 shrink-0 mt-0.5" />
                <span className="text-xs text-red-400 leading-relaxed">{error}</span>
              </div>
            )}

            {!isSupabaseConfigured && (
              <div className="p-3 bg-slate-900/70 border border-slate-700 rounded-xl text-center">
                <p className="text-xs text-slate-200 leading-relaxed">
                  현재 데모 환경입니다. 소셜 로그인 또는 이메일로 회원가입 후 이용해보세요.
                </p>
              </div>
            )}

            <Button
              type="submit"
              variant="primary"
              disabled={loading}
              loading={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-2.5 font-medium transition-colors shadow-lg shadow-blue-600/10 flex items-center justify-center gap-1.5"
            >
              {isSignUp ? "회원가입 진행" : "로그인"}
              <ArrowRight size={15} />
            </Button>
          </form>

          {/* Divider */}
          <div className="flex items-center my-5">
            <div className="flex-1 h-px bg-gray-800" />
            <span className="text-[11px] text-gray-500 px-3 uppercase tracking-wider">OR</span>
            <div className="flex-1 h-px bg-gray-800" />
          </div>

          {/* Social Login Buttons */}
          <div className="grid gap-3">
            {socialProviders.map((p) => (
              <button
                key={p.key}
                type="button"
                onClick={() => handleSocialLogin(p.key)}
                disabled={socialLoading !== null}
                className={`w-full ${p.bg} ${p.text} rounded-xl py-2.5 text-sm font-medium transition-all border ${p.border} flex items-center justify-center gap-2 disabled:opacity-60`}
              >
                {socialLoading === p.key ? (
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                ) : (
                  p.icon
                )}
                <span className="font-semibold">{p.label}</span>
              </button>
            ))}
          </div>

          {/* Guest Login */}
          <div className="mt-3">
            <button
              type="button"
              onClick={handleGuestLogin}
              className="w-full bg-gray-800/50 hover:bg-gray-800 border border-gray-700/60 text-gray-300 rounded-xl py-2.5 text-xs font-medium transition-all"
            >
              게스트 모드로 체험하기
            </button>
          </div>

          <p className="text-[11px] text-gray-500 mt-3 text-center">
            {isSupabaseConfigured
              ? "소셜 계정으로 로그인하면 이용약관에 동의한 것으로 간주됩니다."
              : "데모 환경에서는 게스트 모드로 체험하실 수 있습니다."}
          </p>
        </Card>
      </div>
    </div>
  );
}
