import { useState, useCallback } from 'react'

function InputScreen({ onSubmit }) {
  const [address, setAddress] = useState('')
  const [files, setFiles] = useState([])
  const [dragActive, setDragActive] = useState(false)

  const handleFiles = useCallback((newFiles) => {
    const imageFiles = Array.from(newFiles).filter(f =>
      f.type === 'image/jpeg' || f.type === 'image/png'
    )
    setFiles(prev => [...prev, ...imageFiles])
  }, [])

  const handleDrop = useCallback((e) => {
    e.preventDefault()
    setDragActive(false)
    handleFiles(e.dataTransfer.files)
  }, [handleFiles])

  const handleDragOver = useCallback((e) => {
    e.preventDefault()
    setDragActive(true)
  }, [])

  const handleDragLeave = useCallback(() => {
    setDragActive(false)
  }, [])

  const removeFile = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async () => {
    const images = await Promise.all(
      files.map(file => new Promise((resolve) => {
        const reader = new FileReader()
        reader.onload = () => {
          const base64 = reader.result.split(',')[1]
          resolve({
            name: file.name,
            mimeType: file.type,
            base64,
            preview: reader.result,
          })
        }
        reader.readAsDataURL(file)
      }))
    )
    onSubmit({ address, images })
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-rics-purple rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">T</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Taurgo Survey</h1>
          </div>
          <p className="text-gray-500">AI-powered RICS Level 3 property survey report generation</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Property Address
            </label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="e.g. 14 Elm Street, Cardiff, CF10 1AA"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rics-purple focus:border-rics-purple outline-none transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Property Defect Images
            </label>
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition ${
                dragActive
                  ? 'border-rics-purple bg-purple-50'
                  : 'border-gray-300 hover:border-rics-purple'
              }`}
              onClick={() => document.getElementById('file-input').click()}
            >
              <div className="space-y-2">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="text-gray-600">
                  <span className="font-medium text-rics-purple">Click to upload</span> or drag and drop
                </p>
                <p className="text-sm text-gray-400">JPEG or PNG images</p>
              </div>
            </div>
            <input
              id="file-input"
              type="file"
              multiple
              accept="image/jpeg,image/png"
              onChange={(e) => handleFiles(e.target.files)}
              className="hidden"
            />
          </div>

          {files.length > 0 && (
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">
                {files.length} image{files.length !== 1 ? 's' : ''} selected
              </p>
              <div className="grid grid-cols-4 gap-3">
                {files.map((file, i) => (
                  <div key={i} className="relative group">
                    <img
                      src={URL.createObjectURL(file)}
                      alt={file.name}
                      className="w-full h-24 object-cover rounded-lg border border-gray-200"
                    />
                    <button
                      onClick={(e) => { e.stopPropagation(); removeFile(i) }}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                    >
                      &times;
                    </button>
                    <p className="text-xs text-gray-500 mt-1 truncate">{file.name}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={files.length === 0}
            className="w-full py-3 bg-rics-purple text-white font-medium rounded-lg hover:bg-rics-purple-dark disabled:opacity-40 disabled:cursor-not-allowed transition"
          >
            Generate Report
          </button>
        </div>
      </div>
    </div>
  )
}

export default InputScreen
