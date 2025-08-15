import { useState } from 'react'
import { addDays, format, subDays } from 'date-fns'

export default function DateRangePicker({ onChange }) {
  const [start, setStart] = useState(subDays(new Date(), 0))
  const [end, setEnd] = useState(addDays(new Date(), 7))
  const apply = () => onChange?.({ start, end })
  return (
    <div className="rounded-xl bg-gradient-to-br from-white via-blue-50 to-teal-50 shadow-lg p-6 max-w-lg mx-auto">
      <h2 className="text-xl font-bold text-blue-700 mb-4 text-center">Select Date Range</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <label className="flex flex-col gap-2">
          <span className="text-sm font-semibold text-blue-700">From</span>
          <input
            type="datetime-local"
            className="px-4 py-2 rounded-lg border border-blue-200 focus:border-teal-400 focus:ring-2 focus:ring-teal-100 outline-none transition bg-white text-gray-800 shadow-sm"
            value={format(start, "yyyy-MM-dd'T'HH:mm")}
            onChange={e => setStart(new Date(e.target.value))}
          />
        </label>
        <label className="flex flex-col gap-2">
          <span className="text-sm font-semibold text-blue-700">To</span>
          <input
            type="datetime-local"
            className="px-4 py-2 rounded-lg border border-blue-200 focus:border-teal-400 focus:ring-2 focus:ring-teal-100 outline-none transition bg-white text-gray-800 shadow-sm"
            value={format(end, "yyyy-MM-dd'T'HH:mm")}
            onChange={e => setEnd(new Date(e.target.value))}
          />
        </label>
      </div>
      <div className="flex justify-center">
        <button
          className="px-6 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-teal-400 text-white font-bold shadow-md hover:from-blue-600 hover:to-teal-500 transition"
          onClick={apply}
        >
          Apply
        </button>
      </div>
    </div>
  )
}