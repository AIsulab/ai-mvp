export default function PillSelector({
  label,
  options = [],
  value,
  onChange,
  className = "",
}) {
  return (
    <div className={className}>
      {label && (
        <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2 block">
          {label}
        </label>
      )}
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => (
          <button
            key={opt}
            type="button"
            onClick={() => onChange(opt)}
            className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
              value === opt
                ? "border-primary bg-primary/10 text-primary font-medium"
                : "border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700/50"
            }`}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}
