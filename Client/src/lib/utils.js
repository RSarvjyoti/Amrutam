export const cls = (...arr) => arr.filter(Boolean).join(' ')
export const fmtDate = (iso) => new Date(iso).toLocaleString()
export const toISO = (d) => (d instanceof Date ? d.toISOString() : new Date(d).toISOString())