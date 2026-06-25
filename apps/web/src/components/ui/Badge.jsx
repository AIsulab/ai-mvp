const colorMap = {
  blue: "bg-blue-50 text-blue-600",
  green: "bg-green-50 text-green-700",
  purple: "bg-purple-50 text-purple-600",
  orange: "bg-orange-50 text-orange-600",
  red: "bg-red-50 text-red-600",
  teal: "bg-teal-50 text-teal-600",
  gray: "bg-gray-100 text-gray-600",
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
