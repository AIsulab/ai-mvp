export default function Select({
  label,
  value,
  onChange,
  options = [],
  placeholder = "선택하세요",
  className = "",
  ...props
}) {
  return (
    <div className={className}>
      {label && (
        <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5 block">
          {label}
        </label>
      )}
      <select
        value={value}
        onChange={onChange}
        className="w-full border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2.5 text-sm text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700
          focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
          hover:border-gray-300 dark:hover:border-gray-500 transition-colors"
        {...props}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
}
