import { useState } from 'react'
import { ELEMENT_ORDER, ELEMENT_NAMES } from '../lib/elementOrder'
import { VALID_DEFECT_TYPES } from '../lib/reportSchema'
import ThinkingBubble from './ThinkingBubble'
import SourceBadge from './SourceBadge'
import ImagePanel from './ImagePanel'

const CR_COLORS = {
  1: 'bg-cr1',
  2: 'bg-cr2',
  3: 'bg-cr3',
}

const CR_LABELS = {
  1: 'No repair needed',
  2: 'Non-urgent repair',
  3: 'Urgent repair',
}

const BRE_OPTIONS = [
  { value: 0, label: '0 - Negligible (<0.1mm)' },
  { value: 1, label: '1 - Very Slight (up to 1mm)' },
  { value: 2, label: '2 - Slight (up to 5mm)' },
  { value: 3, label: '3 - Moderate (5-15mm)' },
  { value: 4, label: '4 - Severe (15-25mm)' },
  { value: 5, label: '5 - Very Severe (>25mm)' },
]

function ElementSection({ section, onUpdate, onUpdateImage }) {
  const [expanded, setExpanded] = useState(true)
  const modified = section._modified || {}

  const update = (field, value) => {
    onUpdate(section.id, {
      [field]: value,
      _modified: { ...modified, [field]: true },
    })
  }

  const cycleRating = () => {
    const next = (section.condition_rating % 3) + 1
    update('condition_rating', next)
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b border-gray-100">
        <button
          onClick={cycleRating}
          className={`w-10 h-10 rounded-full ${CR_COLORS[section.condition_rating]} text-white font-bold text-lg flex items-center justify-center flex-shrink-0 transition hover:opacity-80`}
          title={`Condition Rating ${section.condition_rating}: ${CR_LABELS[section.condition_rating]}. Click to cycle.`}
        >
          {section.condition_rating}
        </button>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <select
              value={section.element_code}
              onChange={(e) => update('element_code', e.target.value)}
              className="text-lg font-bold text-gray-900 bg-transparent border-none outline-none cursor-pointer edit-controls"
            >
              {ELEMENT_ORDER.map(code => (
                <option key={code} value={code}>
                  {code} — {ELEMENT_NAMES[code]}
                </option>
              ))}
            </select>
          </div>
          <p className="text-sm text-gray-500">{section.display_name}</p>
        </div>
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-gray-400 hover:text-gray-600 no-print"
        >
          <svg className={`w-5 h-5 transition ${expanded ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {expanded && (
        <div className="p-4 space-y-4">
          <ThinkingBubble thinking={section._thinking} />

          {/* Images */}
          <ImagePanel
            originalImage={section.originalImage}
            annotatedImage={section.annotatedImage}
            annotationSource={section.annotationSource}
            onUpdateImage={(imageData) => onUpdateImage(section.id, imageData)}
          />

          {/* Classification */}
          <div className="grid grid-cols-2 gap-4 edit-controls">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Defect Type</label>
              <select
                value={section.defect_type}
                onChange={(e) => update('defect_type', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-rics-purple focus:border-rics-purple outline-none"
              >
                {VALID_DEFECT_TYPES.map(dt => (
                  <option key={dt} value={dt}>
                    {dt.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">BRE Crack Category</label>
              <select
                value={section.bre_category}
                onChange={(e) => update('bre_category', Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-rics-purple focus:border-rics-purple outline-none"
              >
                {BRE_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Location */}
          <div>
            <div className="flex items-center gap-2 mb-1">
              <label className="text-xs font-medium text-gray-500">Location</label>
            </div>
            <div
              contentEditable
              suppressContentEditableWarning
              onBlur={(e) => update('location_description', e.currentTarget.textContent)}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-800 focus:ring-2 focus:ring-rics-purple focus:border-rics-purple outline-none"
            >
              {section.location_description}
            </div>
          </div>

          {/* Description */}
          <div>
            <div className="flex items-center gap-2 mb-1">
              <label className="text-xs font-medium text-gray-500">Description</label>
            </div>
            <div
              contentEditable
              suppressContentEditableWarning
              onBlur={(e) => update('description', e.currentTarget.textContent)}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-800 min-h-[60px] focus:ring-2 focus:ring-rics-purple focus:border-rics-purple outline-none"
            >
              {section.description}
            </div>
          </div>

          {/* Taxonomy-sourced fields */}
          {section._sourceResolved && (
            <>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <label className="text-xs font-medium text-gray-500">Probable Causes</label>
                  <SourceBadge source={section.source_standard} modified={modified.possible_causes} />
                </div>
                <div
                  contentEditable
                  suppressContentEditableWarning
                  onBlur={(e) => update('possible_causes', e.currentTarget.textContent.split('\n').filter(Boolean))}
                  className="px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-800 focus:ring-2 focus:ring-rics-purple focus:border-rics-purple outline-none"
                >
                  {(section.possible_causes || []).join('\n')}
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-1">
                  <label className="text-xs font-medium text-gray-500">Recommended Action</label>
                  <SourceBadge source={section.source_standard} modified={modified.recommended_action} />
                </div>
                <div
                  contentEditable
                  suppressContentEditableWarning
                  onBlur={(e) => update('recommended_action', e.currentTarget.textContent)}
                  className="px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-800 focus:ring-2 focus:ring-rics-purple focus:border-rics-purple outline-none"
                >
                  {section.recommended_action}
                </div>
              </div>

              {/* HHSRS flag */}
              {section.hhsrs_flag && (
                <div className="flex items-center gap-2 px-3 py-2 bg-red-50 border border-red-200 rounded-lg">
                  <svg className="w-4 h-4 text-red-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <span className="text-sm font-medium text-red-800">
                    HHSRS Hazard {section.hhsrs_hazard} — Structural Collapse & Falling Elements
                  </span>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  )
}

export default ElementSection
