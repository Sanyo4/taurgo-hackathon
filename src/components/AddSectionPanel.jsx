import { useState } from 'react'
import { ELEMENT_ORDER, ELEMENT_NAMES } from '../lib/elementOrder'
import { analyseImage } from '../lib/gemini'
import { resolveFromTaxonomy } from '../lib/taxonomyLookup'

function AddSectionPanel({ onAdd, onCancel }) {
  const [elementCode, setElementCode] = useState('D4')
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleFile = (e) => {
    const f = e.target.files?.[0]
    if (!f) return
    setFile(f)
    const reader = new FileReader()
    reader.onload = () => setPreview(reader.result)
    reader.readAsDataURL(f)
  }

  const handleAnalyse = async () => {
    if (!file) return
    setLoading(true)
    try {
      const reader = new FileReader()
      const base64 = await new Promise((resolve) => {
        reader.onload = () => resolve(reader.result.split(',')[1])
        reader.readAsDataURL(file)
      })

      const analysis = await analyseImage(base64, file.type)
      const resolved = resolveFromTaxonomy(analysis)

      onAdd({
        id: crypto.randomUUID(),
        ...resolved,
        originalImage: preview,
        annotatedImage: null,
        annotationSource: null,
        imageName: file.name,
        _modified: {},
      })
    } catch (err) {
      alert('Analysis failed: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleAddEmpty = () => {
    onAdd({
      id: crypto.randomUUID(),
      element_code: elementCode,
      condition_rating: 2,
      bre_category: 0,
      defect_type: 'unidentified',
      location_description: '',
      description: '',
      confidence: 1.0,
      display_name: ELEMENT_NAMES[elementCode] || elementCode,
      possible_causes: [],
      recommended_action: '',
      severity_rating: null,
      bre_category_range: null,
      location_tags: [],
      cv_labels: [],
      hhsrs_hazard: null,
      hhsrs_flag: false,
      defect_category: null,
      source_standard: null,
      _sourceResolved: false,
      originalImage: preview,
      annotatedImage: null,
      annotationSource: null,
      imageName: file?.name || 'Manual entry',
      _thinking: null,
      _modified: {},
    })
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 space-y-4">
      <h3 className="font-medium text-gray-900">Add New Section</h3>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Element Code</label>
          <select
            value={elementCode}
            onChange={(e) => setElementCode(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-rics-purple focus:border-rics-purple outline-none"
          >
            {ELEMENT_ORDER.map(code => (
              <option key={code} value={code}>
                {code} — {ELEMENT_NAMES[code]}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Image (optional)</label>
          <input
            type="file"
            accept="image/jpeg,image/png"
            onChange={handleFile}
            className="w-full text-sm text-gray-500 file:mr-2 file:py-1 file:px-3 file:rounded file:border-0 file:text-sm file:font-medium file:bg-purple-50 file:text-rics-purple hover:file:bg-purple-100"
          />
        </div>
      </div>

      {preview && (
        <img src={preview} alt="Preview" className="w-32 h-24 object-cover rounded-lg border border-gray-200" />
      )}

      <div className="flex gap-2">
        {file && (
          <button
            onClick={handleAnalyse}
            disabled={loading}
            className="px-4 py-2 bg-rics-purple text-white text-sm rounded-lg hover:bg-rics-purple-dark disabled:opacity-50 transition"
          >
            {loading ? 'Analysing...' : 'Analyse Image'}
          </button>
        )}
        <button
          onClick={handleAddEmpty}
          className="px-4 py-2 bg-gray-100 text-gray-700 text-sm rounded-lg hover:bg-gray-200 transition"
        >
          Add Empty
        </button>
        <button
          onClick={onCancel}
          className="px-4 py-2 text-gray-500 text-sm hover:text-gray-700 transition"
        >
          Cancel
        </button>
      </div>
    </div>
  )
}

export default AddSectionPanel
