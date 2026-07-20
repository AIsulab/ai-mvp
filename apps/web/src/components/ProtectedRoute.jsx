/**
 * ProtectedRoute — 인증 가드
 * - 인증됨 (로그인 or 게스트) → children 렌더
 * - 비인증 → /login?redirect=현재경로 로 이동
 * - 로딩 중 → 스피너
 */
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-gray-900 dark:bg-white flex items-center justify-center animate-pulse">
            <span className="text-white dark:text-gray-900 text-lg font-bold">W</span>
          </div>
          <div className="w-5 h-5 border-2 border-gray-300 border-t-gray-900 dark:border-t-white rounded-full animate-spin" />
          <p className="text-sm text-gray-500 dark:text-gray-400">데이터를 불러오는 중입니다...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace={false} />;
  }

  return children;
}
