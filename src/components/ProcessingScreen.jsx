import { useState, useEffect, useRef } from 'react'
import { analyseImage } from '../lib/gemini'
import { annotateImage } from '../lib/nanoBanana'
import { resolveFromTaxonomy } from '../lib/taxonomyLookup'
import { ELEMENT_NAMES } from '../lib/elementOrder'

function ProcessingScreen({ images, address, onComplete }) {
  const [statuses, setStatuses] = useState(() =>
    images.map(() => ({ state: 'pending', label: '' }))
  )
  const [completed, setCompleted] = useState(0)
  const hasStarted = useRef(false)

  useEffect(() => {
    if (hasStarted.current) return
    hasStarted.current = true

    const processAll = async () => {
      const results = await Promise.allSettled(
        images.map(async (img, idx) => {
          setStatuses(prev => {
            const next = [...prev]
            next[idx] = { state: 'analysing', label: 'Analysing...' }
            return next
          })

          try {
            const analysis = await analyseImage(img.base64, img.mimeType)
            const resolved = resolveFromTaxonomy(analysis)

            const elementName = ELEMENT_NAMES[analysis.element_code] || analysis.element_code
            setStatuses(prev => {
              const next = [...prev]
              next[idx] = {
                state: 'annotating',
                label: `${analysis.element_code} ${elementName}`,
              }
              return next
            })

            // Try annotation (non-blocking on failure)
            let annotation = null
            try {
              annotation = await annotateImage(img.base64, img.mimeType, analysis)
            } catch {
              // Annotation is optional
            }

            setStatuses(prev => {
              const next = [...prev]
              next[idx] = {
                state: 'done',
                label: `${analysis.element_code} ${elementName}`,
              }
              return next
            })
            setCompleted(c => c + 1)

            return {
              id: crypto.randomUUID(),
              ...resolved,
              originalImage: img.preview,
              annotatedImage: annotation
                ? `data:${annotation.mimeType};base64,${annotation.data}`
                : null,
              annotationSource: annotation ? 'ai' : null,
              imageName: img.name,
              _modified: {},
            }
          } catch (err) {
            setStatuses(prev => {
              const next = [...prev]
              next[idx] = { state: 'error', label: err.message }
              return next
            })
            setCompleted(c => c + 1)
            throw err
          }
        })
      )

      const sections = []
      const unassigned = []

      for (const result of results) {
        if (result.status === 'fulfilled') {
          const section = result.value
          if (section.confidence >= 0.6 && section.defect_type !== 'unidentified') {
            sections.push(section)
          } else {
            unassigned.push(section)
          }
        }
      }

      // Small delay so user can see completed state
      await new Promise(r => setTimeout(r, 800))
      onComplete({ sections, unassigned })
    }

    processAll()
  }, [images, onComplete])

  const progress = Math.round((completed / images.length) * 100)

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-rics-purple rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">T</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Analysing Images</h1>
          </div>
          <p className="text-gray-500">{address}</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          {/* Progress bar */}
          <div className="mb-6">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-600">{completed} of {images.length} complete</span>
              <span className="font-medium text-rics-purple">{progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-rics-purple h-2 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Per-image status */}
          <div className="space-y-3">
            {images.map((img, idx) => {
              const status = statuses[idx]
              return (
                <div key={idx} className="flex items-center gap-3">
                  <img
                    src={img.preview}
                    alt={img.name}
                    className="w-12 h-12 object-cover rounded-lg border border-gray-200"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{img.name}</p>
                    <p className={`text-xs ${
                      status.state === 'error' ? 'text-red-500' :
                      status.state === 'done' ? 'text-green-600' :
                      'text-gray-400'
                    }`}>
                      {status.label || 'Waiting...'}
                    </p>
                  </div>
                  <div className="flex-shrink-0">
                    {status.state === 'pending' && (
                      <div className="w-5 h-5 rounded-full border-2 border-gray-300" />
                    )}
                    {(status.state === 'analysing' || status.state === 'annotating') && (
                      <div className="w-5 h-5 rounded-full border-2 border-rics-purple border-t-transparent animate-spin" />
                    )}
                    {status.state === 'done' && (
                      <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                    {status.state === 'error' && (
                      <svg className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProcessingScreen
