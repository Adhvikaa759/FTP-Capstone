export default function Select({ label, options, placeholder, className = '', ...props }) {
  return (
    <div>
      {label && <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>}
      <select
        className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white ${className}`}
        {...props}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </div>
  );
}
