export default function Card({
  children,
  padding = "p-5 md:p-6",
  className = "",
  ...props
}) {
  return (
    <div
      style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}
      className={`bg-white dark:bg-gray-800 rounded-xl ${padding} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
