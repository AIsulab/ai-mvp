export default function Input({
  label,
  placeholder,
  value,
  onChange,
  type = "text",
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
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2.5 text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 bg-white dark:bg-gray-700
          focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
          hover:border-gray-300 dark:hover:border-gray-500 transition-colors"
        {...props}
      />
    </div>
  );
}
