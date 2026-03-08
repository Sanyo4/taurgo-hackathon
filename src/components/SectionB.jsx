import { ELEMENT_NAMES } from '../lib/elementOrder'

const CR_CONFIG = {
  3: { label: 'Condition Rating 3 — Urgent', color: 'bg-cr3', textColor: 'text-red-800', bgLight: 'bg-red-50', border: 'border-red-200' },
  2: { label: 'Condition Rating 2 — Non-urgent', color: 'bg-cr2', textColor: 'text-amber-800', bgLight: 'bg-amber-50', border: 'border-amber-200' },
  1: { label: 'Condition Rating 1 — No action', color: 'bg-cr1', textColor: 'text-green-800', bgLight: 'bg-green-50', border: 'border-green-200' },
}

function SectionB({ sections }) {
  // Group by condition rating
  const groups = { 3: [], 2: [], 1: [] }
  for (const s of sections) {
    const cr = s.condition_rating
    if (groups[cr]) groups[cr].push(s)
  }

  const cr3Items = groups[3]
  const hasUrgent = cr3Items.length > 0

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-4 border-b border-gray-100">
        <h2 className="text-lg font-bold text-gray-900">Section B — Summary of Condition Ratings</h2>
      </div>

      <div className="p-4 space-y-4">
        {[3, 2, 1].map(cr => {
          const config = CR_CONFIG[cr]
          const items = groups[cr]
          if (items.length === 0) return null

          return (
            <div key={cr} className={`rounded-lg border ${config.border} ${config.bgLight} overflow-hidden`}>
              <div className={`flex items-center gap-2 px-4 py-2 border-b ${config.border}`}>
                <div className={`w-6 h-6 rounded-full ${config.color} text-white text-xs font-bold flex items-center justify-center`}>
                  {cr}
                </div>
                <span className={`text-sm font-semibold ${config.textColor}`}>{config.label}</span>
                <span className="text-xs text-gray-500 ml-auto">{items.length} item{items.length !== 1 ? 's' : ''}</span>
              </div>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200/50">
                    <th className="text-left px-4 py-2 text-xs font-medium text-gray-500 w-20">Element</th>
                    <th className="text-left px-4 py-2 text-xs font-medium text-gray-500 w-40">Name</th>
                    <th className="text-left px-4 py-2 text-xs font-medium text-gray-500">Comments</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map(s => (
                    <tr key={s.id} className="border-b border-gray-200/30 last:border-0">
                      <td className="px-4 py-2 font-medium text-gray-900">{s.element_code}</td>
                      <td className="px-4 py-2 text-gray-700">{ELEMENT_NAMES[s.element_code]}</td>
                      <td className="px-4 py-2 text-gray-600">{s.description?.slice(0, 120)}{s.description?.length > 120 ? '...' : ''}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        })}

        {sections.length === 0 && (
          <p className="text-sm text-gray-400 text-center py-4">No sections analysed yet.</p>
        )}

        {/* Summary of repairs */}
        {hasUrgent && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <h3 className="text-sm font-semibold text-red-800 mb-2">Further Investigations Required</h3>
            <ul className="text-sm text-red-700 space-y-1">
              {cr3Items.map(s => (
                <li key={s.id}>
                  <span className="font-medium">{s.element_code} {ELEMENT_NAMES[s.element_code]}</span>
                  {s.recommended_action && ` — ${s.recommended_action}`}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}

export default SectionB
