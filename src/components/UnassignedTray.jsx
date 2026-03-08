import { useState } from 'react'
import { ELEMENT_ORDER, ELEMENT_NAMES } from '../lib/elementOrder'
import { VALID_DEFECT_TYPES } from '../lib/reportSchema'

function UnassignedTray({ items, onPromote }) {
  return (
    <div className="no-print bg-amber-50 border-2 border-amber-300 rounded-xl overflow-hidden">
      <div className="px-4 py-3 border-b border-amber-200">
        <h3 className="text-sm font-bold text-amber-800">
          Unassigned Images ({items.length})
        </h3>
        <p className="text-xs text-amber-600">
          Low-confidence or unidentified defects. Assign an element code to add to the report.
        </p>
      </div>

      <div className="p-4 space-y-3">
        {items.map(item => (
          <UnassignedItem key={item.id} item={item} onPromote={onPromote} />
        ))}
      </div>
    </div>
  )
}

function UnassignedItem({ item, onPromote }) {
  const [elementCode, setElementCode] = useState(item.element_code || '')
  const [defectType, setDefectType] = useState(item.defect_type || 'unidentified')

  const canPromote = elementCode && defectType !== 'unidentified'

  return (
    <div className="flex items-start gap-3 bg-white rounded-lg p-3 border border-amber-200">
      <img
        src={item.originalImage}
        alt={item.imageName}
        className="w-20 h-20 object-cover rounded-lg border border-gray-200 flex-shrink-0"
      />
      <div className="flex-1 space-y-2">
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium text-gray-900 truncate">{item.imageName}</p>
          <span className="text-xs px-2 py-0.5 bg-amber-100 text-amber-700 rounded-full">
            {Math.round(item.confidence * 100)}% confidence
          </span>
        </div>
        {item.description && (
          <p className="text-xs text-gray-500">{item.description}</p>
        )}
        <div className="flex gap-2">
          <select
            value={elementCode}
            onChange={(e) => setElementCode(e.target.value)}
            className="flex-1 px-2 py-1 border border-gray-300 rounded text-xs focus:ring-2 focus:ring-rics-purple focus:border-rics-purple outline-none"
          >
            <option value="">Select element...</option>
            {ELEMENT_ORDER.map(code => (
              <option key={code} value={code}>
                {code} — {ELEMENT_NAMES[code]}
              </option>
            ))}
          </select>
          <select
            value={defectType}
            onChange={(e) => setDefectType(e.target.value)}
            className="flex-1 px-2 py-1 border border-gray-300 rounded text-xs focus:ring-2 focus:ring-rics-purple focus:border-rics-purple outline-none"
          >
            {VALID_DEFECT_TYPES.map(dt => (
              <option key={dt} value={dt}>
                {dt.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
              </option>
            ))}
          </select>
          <button
            onClick={() => canPromote && onPromote(item, elementCode, defectType)}
            disabled={!canPromote}
            className="px-3 py-1 bg-rics-purple text-white text-xs rounded hover:bg-rics-purple-dark disabled:opacity-40 disabled:cursor-not-allowed transition"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  )
}

export default UnassignedTray
