export default function StatCard({ icon: Icon, label, value, sub, color = "blue", trend, loading }) {
  const colorMap = {
    blue: "from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-transparent border-blue-100/60 dark:border-blue-900/40",
    green: "from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-transparent border-green-100/60 dark:border-green-900/40",
    orange: "from-orange-50 to-amber-50 dark:from-orange-950/20 dark:to-transparent border-orange-100/60 dark:border-orange-900/40",
    purple: "from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-transparent border-purple-100/60 dark:border-purple-900/40",
  };

  const textColor = {
    blue: "text-blue-600 dark:text-blue-400",
    green: "text-green-600 dark:text-green-400",
    orange: "text-orange-600 dark:text-orange-400",
    purple: "text-purple-600 dark:text-purple-400",
  };

  return (
    <div className={`bg-gradient-to-br ${colorMap[color]} border rounded-2xl p-4 shadow-sm`}>
      <div className="flex items-center justify-between mb-2">
        <span className={`text-xs font-semibold ${textColor[color]}`}>{label}</span>
        {trend && (
          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
            trend.startsWith("+") || trend.startsWith("▲")
              ? "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400"
              : "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400"
          }`}>
            {trend}
          </span>
        )}
      </div>
      {loading ? (
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
      ) : (
        <>
          <div className="flex items-baseline gap-1.5 mb-1">
            <span className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">{value}</span>
            {sub && <span className="text-xs text-gray-500 dark:text-gray-400">{sub}</span>}
          </div>
          {Icon && <Icon size={14} className={`${textColor[color]} opacity-40 mt-1`} />}
        </>
      )}
    </div>
  );
}
