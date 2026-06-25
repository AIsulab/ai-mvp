export default function Textarea({
  label,
  placeholder,
  value,
  onChange,
  rows = 4,
  className = "",
  ...props
}) {
  return (
    <div className={className}>
      {label && (
        <label className="text-xs font-medium text-gray-500 mb-1.5 block">
          {label}
        </label>
      )}
      <textarea
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 resize-none
          focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
          hover:border-gray-300 transition-colors"
        {...props}
      />
    </div>
  );
}
