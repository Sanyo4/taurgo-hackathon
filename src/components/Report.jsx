import { useState, useCallback } from 'react'
import { reorderSections } from '../lib/elementOrder'
import { resolveFromTaxonomy } from '../lib/taxonomyLookup'
import ElementSection from './ElementSection'
import SectionB from './SectionB'
import UnassignedTray from './UnassignedTray'
import AddSectionPanel from './AddSectionPanel'

function Report({ address, initialSections, initialUnassigned, onBack }) {
  const [sections, setSections] = useState(() => reorderSections(initialSections))
  const [unassigned, setUnassigned] = useState(initialUnassigned || [])
  const [showAddPanel, setShowAddPanel] = useState(false)

  const updateSection = useCallback((id, changes) => {
    setSections(prev => {
      const updated = prev.map(s => {
        if (s.id !== id) return s
        let merged = { ...s, ...changes }

        // If defect_type changed, re-resolve taxonomy
        if (changes.defect_type && changes.defect_type !== s.defect_type) {
          const reResolved = resolveFromTaxonomy({
            element_code: merged.element_code,
            condition_rating: merged.condition_rating,
            bre_category: merged.bre_category,
            defect_type: changes.defect_type,
            location_description: merged.location_description,
            description: merged.description,
            confidence: merged.confidence,
          })
          merged = {
            ...merged,
            ...reResolved,
            id: s.id,
            originalImage: s.originalImage,
            annotatedImage: s.annotatedImage,
            annotationSource: s.annotationSource,
            _thinking: s._thinking,
            _modified: changes._modified || s._modified,
          }
        }

        return merged
      })

      // If element_code changed, re-sort
      if (changes.element_code) {
        return reorderSections(updated)
      }
      return updated
    })
  }, [])

  const updateImage = useCallback((id, imageData) => {
    setSections(prev => prev.map(s => {
      if (s.id !== id) return s
      return {
        ...s,
        annotatedImage: imageData.annotatedImage,
        annotationSource: imageData.annotationSource,
      }
    }))
  }, [])

  const promoteFromUnassigned = useCallback((item, elementCode, defectType) => {
    const reResolved = resolveFromTaxonomy({
      ...item,
      element_code: elementCode,
      defect_type: defectType,
      confidence: 1.0,
    })

    const promoted = {
      ...item,
      ...reResolved,
      element_code: elementCode,
      confidence: 1.0,
      _modified: {},
    }

    setUnassigned(prev => prev.filter(u => u.id !== item.id))
    setSections(prev => reorderSections([...prev, promoted]))
  }, [])

  const addSection = useCallback((newSection) => {
    setSections(prev => reorderSections([...prev, newSection]))
    setShowAddPanel(false)
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* Header */}
      <div className="bg-rics-purple text-white">
        <div className="max-w-4xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">T</span>
              </div>
              <div>
                <h1 className="text-xl font-bold">RICS Level 3 Building Survey</h1>
                <p className="text-purple-200 text-sm">{address}</p>
              </div>
            </div>
            <div className="flex gap-2 no-print">
              <button
                onClick={onBack}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm transition"
              >
                New Survey
              </button>
              <button
                onClick={() => window.print()}
                className="px-4 py-2 bg-white text-rics-purple font-medium rounded-lg text-sm hover:bg-purple-50 transition"
              >
                Export PDF
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 mt-6 space-y-6">
        {/* Section B: Summary */}
        <SectionB sections={sections} />

        {/* Element Sections D-G */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-gray-900">Detailed Findings</h2>
          {sections.map(section => (
            <ElementSection
              key={section.id}
              section={section}
              onUpdate={updateSection}
              onUpdateImage={updateImage}
            />
          ))}
        </div>

        {/* Add Section */}
        <div className="no-print">
          {showAddPanel ? (
            <AddSectionPanel
              onAdd={addSection}
              onCancel={() => setShowAddPanel(false)}
            />
          ) : (
            <button
              onClick={() => setShowAddPanel(true)}
              className="w-full py-3 border-2 border-dashed border-gray-300 text-gray-500 rounded-xl hover:border-rics-purple hover:text-rics-purple transition"
            >
              + Add Section
            </button>
          )}
        </div>

        {/* Unassigned Tray */}
        {unassigned.length > 0 && (
          <UnassignedTray
            items={unassigned}
            onPromote={promoteFromUnassigned}
          />
        )}
      </div>
    </div>
  )
}

export default Report
