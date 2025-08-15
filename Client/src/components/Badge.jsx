export default function Badge({ children }) {
  return (
    <span className="inline-flex items-center px-3 py-1 rounded-full bg-gradient-to-r from-blue-100 to-teal-100 text-blue-700 text-sm font-semibold shadow">
      {children}
    </span>
  )
}