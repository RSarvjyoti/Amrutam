export default function Select({ label, children, ...props }) {
  return (
    <label className="flex flex-col gap-2 mb-2">
      {label && (
        <span className="text-sm font-semibold text-blue-700 mb-1">{label}</span>
      )}
      <select
        className="px-4 py-2 rounded-lg border border-blue-200 focus:border-teal-400 focus:ring-2 focus:ring-teal-100 outline-none transition bg-white text-gray-800 shadow-sm"
        {...props}
      >
        {children}
      </select>
    </label>
  )
}