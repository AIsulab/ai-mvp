// Badge colors: background only, no border
const colorMap = {
  blue:   "bg-primary-50 text-primary dark:bg-blue-900/30 dark:text-blue-400",
  green:  "bg-accent-green-light text-accent-green dark:bg-green-900/30 dark:text-green-400",
  purple: "bg-purple-50 text-purple dark:bg-purple-900/30 dark:text-purple-400",
  orange: "bg-accent-orange-light text-accent-orange dark:bg-orange-900/30 dark:text-orange-400",
  red:    "bg-coral-50 text-coral dark:bg-red-900/30 dark:text-red-400",
  teal:   "bg-[#F0FDFA] text-[#0D9488] dark:bg-teal-900/30 dark:text-teal-400",
  gray:   "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400",
  navy:   "bg-navy-50 text-navy dark:bg-navy-900/30 dark:text-navy-400",
};

export default function Badge({
  children,
  color = "blue",
  className = "",
  ...props
}) {
  return (
    <span
      className={`inline-flex items-center text-xs px-2.5 py-1 rounded-[8px] font-medium ${colorMap[color] || colorMap.gray} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
}
