export default function Card({
  children,
  padding = "p-6",
  shadow = true,
  className = "",
  ...props
}) {
  return (
    <div
      className={`
        bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700
        ${shadow ? "shadow-sm" : ""}
        ${padding}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
}
