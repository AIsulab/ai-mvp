/**
 * OfflineBar — 오프라인 상태 시 상단 고정 배너
 */
import { WifiOff, RefreshCw } from "lucide-react";
import { useOnlineStatus } from "../hooks/useOnlineStatus";

export default function OfflineBar() {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[100] bg-red-500 text-white py-2.5 px-4 flex items-center justify-center gap-3 shadow-lg animate-fade-in">
      <WifiOff size={15} className="shrink-0" />
      <span className="text-sm font-medium">
        인터넷 연결이 끊겼습니다. 네트워크 상태를 확인해주세요.
      </span>
      <button
        onClick={() => window.location.reload()}
        className="ml-2 flex items-center gap-1.5 text-white/90 hover:text-white text-xs underline underline-offset-2 transition-colors"
      >
        <RefreshCw size={11} />
        재시도
      </button>
    </div>
  );
}
