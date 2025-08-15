export default function Input({ label, type='text', className='', ...props }) {
  return (
    <label className="block mb-2">
      {label && (
        <span className="block mb-1 text-sm font-semibold text-blue-700">{label}</span>
      )}
      <input
        type={type}
        className={`w-full px-4 py-2 rounded-lg border border-blue-200 focus:border-teal-400 focus:ring-2 focus:ring-teal-100 outline-none transition bg-white text-gray-800 shadow-sm ${className}`}
        {...props}
      />
    </label>
  )
}