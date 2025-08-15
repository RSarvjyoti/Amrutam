export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-blue-50 via-teal-50 to-white border-t border-blue-200 shadow-inner">
      <div className="max-w-6xl mx-auto py-6 px-4 flex flex-col md:flex-row items-center justify-between text-sm font-medium text-gray-700">
        <p className="mb-2 md:mb-0">&copy; {new Date().getFullYear()} <span className="font-bold text-blue-600">AyurAppointments</span></p>
        <p className="opacity-80 flex items-center gap-1">
          Built with <span className="text-red-400">❤️</span> using <span className="font-semibold text-blue-500">React</span> & <span className="font-semibold text-teal-500">Tailwind</span>
        </p>
      </div>
    </footer>
  )
}