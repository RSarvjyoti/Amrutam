export default function Button({ as: Comp = 'button', className = '', ...props }) {
  return (
    <Comp
      className={`px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-teal-400 text-white font-semibold shadow-md hover:from-blue-600 hover:to-teal-500 transition ${className}`}
      {...props}
    />
  )
}
