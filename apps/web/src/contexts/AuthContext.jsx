/**
 * AuthContext — Supabase Auth 세션 관리
 *
 * 두 가지 모드:
 * 1. Supabase 설정 완료 → 이메일/비밀번호 로그인
 * 2. Supabase 미설정   → 게스트 전용 (localStorage "w_ai_guest" 플래그)
 */
import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { supabase, isSupabaseConfigured } from "../lib/supabase";

const GUEST_KEY = "w_ai_guest";
const USER_KEY = "w_ai_user";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [isGuest, setIsGuest] = useState(false);

  // ─── Supabase 세션 초기화 ───────────────────────────────────────────────────
  useEffect(() => {
    if (!isSupabaseConfigured) {
      // Supabase 미설정 — 로컬스토리지에서 유저 및 게스트 상태 복원
      const savedUserJson = localStorage.getItem(USER_KEY);
      if (savedUserJson) {
        try {
          setUser(JSON.parse(savedUserJson));
        } catch {
          localStorage.removeItem(USER_KEY);
        }
      } else {
        const guest = localStorage.getItem(GUEST_KEY) === "true";
        setIsGuest(guest);
      }
      setLoading(false);
      return;
    }

    // 현재 세션 확인
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // 세션 변화 구독
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setIsGuest(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // ─── 이메일/비밀번호 로그인 ───────────────────────────────────────────────
  const signIn = useCallback(async (email, password) => {
    if (!isSupabaseConfigured) {
      // Supabase 미연동 시: 지정 관리자 계정 가상 매칭
      if (email === "fosum@kakao.com" && password === "!Js77077057") {
        const mockUser = { email: "fosum@kakao.com", id: "admin-fosum" };
        localStorage.setItem(USER_KEY, JSON.stringify(mockUser));
        localStorage.removeItem(GUEST_KEY);
        setUser(mockUser);
        setIsGuest(false);
        return;
      } else {
        throw new Error("관리자 이메일 또는 비밀번호가 일치하지 않습니다. (데모 환경)");
      }
    }
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
  }, []);

  // ─── 이메일/비밀번호 회원가입 ────────────────────────────────────────────
  const signUp = useCallback(async (email, password) => {
    if (!isSupabaseConfigured) {
      throw new Error("회원가입은 Supabase DB가 연동되어 있어야 활성화됩니다.");
    }
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;
  }, []);

  // ─── 로그아웃 ──────────────────────────────────────────────────────────────
  const signOut = useCallback(async () => {
    if (isSupabaseConfigured) {
      await supabase.auth.signOut();
    }
    // 로컬 세션 클리어
    localStorage.removeItem(GUEST_KEY);
    localStorage.removeItem(USER_KEY);
    setIsGuest(false);
    setUser(null);
  }, []);

  // ─── 게스트 모드 시작 ─────────────────────────────────────────────────────
  const enterGuestMode = useCallback(() => {
    localStorage.setItem(GUEST_KEY, "true");
    setIsGuest(true);
  }, []);

  // 인증됨 = 로그인된 사용자 OR 게스트 모드
  const isAuthenticated = Boolean(user) || isGuest;

  return (
    <AuthContext.Provider value={{
      user, loading, isGuest, isAuthenticated,
      signIn, signUp, signOut, enterGuestMode,
      isSupabaseConfigured,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
