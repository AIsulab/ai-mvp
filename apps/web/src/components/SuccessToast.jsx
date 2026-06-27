import { useState, useEffect, useCallback } from "react";
import { CheckCircle, X, Copy, Sparkles } from "lucide-react";

export function useSuccessToast() {
  const [toast, setToast] = useState(null);

  const showSuccess = useCallback((message, options = {}) => {
    setToast({ message, ...options, type: "success" });
    setTimeout(() => setToast(null), 3000);
  }, []);

  const showError = useCallback((message) => {
    setToast({ message, type: "error" });
    setTimeout(() => setToast(null), 4000);
  }, []);

  const showCopy = useCallback((message = "복사되었습니다!") => {
    setToast({ message, type: "copy" });
    setTimeout(() => setToast(null), 2000);
  }, []);

  return { toast, showSuccess, showError, showCopy };
}

export default function SuccessToast({ toast, onClose }) {
  if (!toast) return null;

  const styles = {
    success: "bg-green-600",
    error: "bg-red-500",
    copy: "bg-gray-800 dark:bg-gray-700",
  };

  const icons = {
    success: CheckCircle,
    error: X,
    copy: Copy,
  };

  const Icon = icons[toast.type] || CheckCircle;

  return (
    <div className="fixed top-4 right-4 z-[90] animate-slide-up">
      <div className={`${styles[toast.type]} text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-2.5 min-w-[200px] max-w-sm`}>
        <Icon size={16} className="shrink-0" />
        <span className="text-sm font-medium flex-1">{toast.message}</span>
        <button onClick={onClose} className="p-0.5 hover:bg-white/20 rounded transition-colors">
          <X size={14} />
        </button>
      </div>
    </div>
  );
}
