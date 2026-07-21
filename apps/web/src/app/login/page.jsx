import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Store, Mail, Lock, ArrowRight, Sparkles, ShieldAlert, User } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { Button, Card, Input } from "../../components/ui";

export default function LoginPage() {
  const { signIn, signUp, enterGuestMode, isSupabaseConfigured } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // 로그인 성공 후 리다이렉트할 경로 (기본값: /dashboard)
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
                  placeholder="예: your@email.com"
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
              <div className="p-3 bg-amber-950/20 border border-amber-900/40 rounded-xl text-center">
                <p className="text-xs text-amber-400/90 leading-relaxed">
                  현재 데모 환경입니다. 카카오/네이버/구글 간편 로그인 또는 이메일로 회원가입 후 이용해보세요.
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
            <button
              type="button"
              onClick={handleGuestLogin}
              className="w-full bg-[#fee500] hover:bg-[#f7dc00] text-[#3c1e1e] rounded-xl py-2.5 text-sm font-medium transition-all border border-[#e4d200] flex items-center justify-center gap-2"
            >
              <span className="font-semibold">카카오로 간편 로그인</span>
            </button>
            <button
              type="button"
              onClick={handleGuestLogin}
              className="w-full bg-[#03c75a] hover:bg-[#02b053] text-white rounded-xl py-2.5 text-sm font-medium transition-all border border-[#02a14c] flex items-center justify-center gap-2"
            >
              <span className="font-semibold">네이버로 간편 로그인</span>
            </button>
            <button
              type="button"
              onClick={handleGuestLogin}
              className="w-full bg-[#4285f4] hover:bg-[#357ae8] text-white rounded-xl py-2.5 text-sm font-medium transition-all border border-[#357ae8] flex items-center justify-center gap-2"
            >
              <span className="font-semibold">구글로 간편 로그인</span>
            </button>
          </div>
          <p className="text-[11px] text-gray-500 mt-3 text-center">이메일로 회원가입하거나 간편 로그인 버튼을 이용해 주세요.</p>
        </Card>
      </div>
    </div>
  );
}
