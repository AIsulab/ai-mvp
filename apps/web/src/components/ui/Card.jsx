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
        bg-white rounded-xl border border-gray-200
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
