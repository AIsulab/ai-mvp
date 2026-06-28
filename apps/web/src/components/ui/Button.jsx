import { Loader2 } from "lucide-react";

const variants = {
  primary: "bg-primary text-white hover:bg-primary-600 focus-visible:ring-primary",
  secondary: "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700 focus-visible:ring-gray-300",
  ghost: "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white focus-visible:ring-gray-300",
  danger: "bg-red-500 text-white hover:bg-red-600 focus-visible:ring-red-500",
  accent: "bg-accent-orange text-white hover:bg-accent-orange/90 focus-visible:ring-accent-orange",
  navy: "bg-navy text-white hover:bg-navy-600 focus-visible:ring-navy",
};

const sizes = {
  sm: "px-3 py-1.5 text-xs",
  md: "px-4 py-2 text-sm",
  lg: "px-6 py-3 text-sm",
  xl: "px-8 py-4 text-base",
};

export default function Button({
  children,
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  className = "",
  ...props
}) {
  return (
    <button
      disabled={disabled || loading}
      className={`
        inline-flex items-center justify-center gap-2 rounded-full font-semibold
        transition-all duration-150 shadow-none hover:-translate-y-0.5
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variants[variant]}
        ${sizes[size]}
        ${className}
      `}
      {...props}
    >
      {loading && <Loader2 size={15} className="animate-spin" />}
      {children}
    </button>
  );
}
