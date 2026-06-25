export default function Skeleton({ className = "", lines = 1 }) {
  return (
    <div className={`animate-pulse ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className={`bg-gray-200 rounded ${i < lines - 1 ? "mb-2" : ""}`}
          style={{ height: "16px", width: i === lines - 1 ? "60%" : "100%" }}
        />
      ))}
    </div>
  );
}
