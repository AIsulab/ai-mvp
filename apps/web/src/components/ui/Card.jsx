export default function Card({
  children,
  padding = "p-5 md:p-6",
  className = "",
  ...props
}) {
  return (
    <div
      className={`bg-white dark:bg-gray-800 rounded-[16px] border border-gray-100 shadow-card hover:shadow-card-lift transition-all duration-200 ${padding} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
