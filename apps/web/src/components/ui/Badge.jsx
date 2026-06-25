const colorMap = {
  blue: "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400",
  green: "bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400",
  purple: "bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400",
  orange: "bg-orange-50 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400",
  red: "bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400",
  teal: "bg-teal-50 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400",
  gray: "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400",
};

export default function Badge({
  children,
  color = "blue",
  className = "",
  ...props
}) {
  return (
    <span
      className={`inline-flex items-center text-xs px-2.5 py-1 rounded-full font-medium ${colorMap[color]} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
}
