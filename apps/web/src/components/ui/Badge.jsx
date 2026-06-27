// Badge colors: background only, no border
const colorMap = {
  blue:   "bg-[#EFF6FF] text-[#2563EB] dark:bg-blue-900/30 dark:text-blue-400",
  green:  "bg-[#F0FDF4] text-[#16A34A] dark:bg-green-900/30 dark:text-green-400",
  purple: "bg-[#F5F3FF] text-[#7C3AED] dark:bg-purple-900/30 dark:text-purple-400",
  orange: "bg-[#FFF7ED] text-[#EA580C] dark:bg-orange-900/30 dark:text-orange-400",
  red:    "bg-[#FEF2F2] text-[#DC2626] dark:bg-red-900/30 dark:text-red-400",
  teal:   "bg-[#F0FDFA] text-[#0D9488] dark:bg-teal-900/30 dark:text-teal-400",
  gray:   "bg-[#F3F4F6] text-[#4B5563] dark:bg-gray-700 dark:text-gray-400",
};

export default function Badge({
  children,
  color = "blue",
  className = "",
  ...props
}) {
  return (
    <span
      className={`inline-flex items-center text-xs px-2.5 py-1 rounded-full font-medium ${colorMap[color] || colorMap.gray} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
}
