import { useState, useRef } from 'react'
import AnnotationCanvas from './AnnotationCanvas'

function ImagePanel({ originalImage, annotatedImage, annotationSource, onUpdateImage }) {
  const [showCanvas, setShowCanvas] = useState(false)
  const [canvasTarget, setCanvasTarget] = useState(null)
  const aiAnnotationRef = useRef(annotatedImage)

  // Store AI annotation when we first receive one
  if (annotationSource === 'ai' && annotatedImage) {
    aiAnnotationRef.current = annotatedImage
  }

  const openCanvas = (target) => {
    setCanvasTarget(target)
    setShowCanvas(true)
  }

  const handleSaveAnnotation = (dataUrl) => {
    onUpdateImage({
      annotatedImage: dataUrl,
      annotationSource: 'manual',
    })
    setShowCanvas(false)
  }

  const handleResetToAI = () => {
    if (aiAnnotationRef.current) {
      onUpdateImage({
        annotatedImage: aiAnnotationRef.current,
        annotationSource: 'ai',
      })
    }
  }

  return (
    <>
      <div className="grid grid-cols-2 gap-3">
        {/* Original */}
        <div className="relative group">
          <p className="text-xs font-medium text-gray-500 mb-1">Original</p>
          {originalImage ? (
            <img
              src={originalImage}
              alt="Original"
              className="w-full h-40 object-cover rounded-lg border border-gray-200"
            />
          ) : (
            <div className="w-full h-40 bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center text-gray-400 text-sm">
              No image
            </div>
          )}
          {originalImage && (
            <button
              onClick={() => openCanvas('original')}
              className="edit-controls absolute bottom-2 right-2 px-2 py-1 bg-black/60 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition"
            >
              Annotate
            </button>
          )}
        </div>

        {/* Annotated */}
        <div className="relative group">
          <div className="flex items-center gap-2 mb-1">
            <p className="text-xs font-medium text-gray-500">Annotated</p>
            {annotationSource === 'manual' && aiAnnotationRef.current && (
              <button
                onClick={handleResetToAI}
                className="edit-controls text-xs text-rics-purple hover:underline"
              >
                Reset to AI
              </button>
            )}
          </div>
          {annotatedImage ? (
            <img
              src={annotatedImage}
              alt="Annotated"
              className="w-full h-40 object-cover rounded-lg border border-gray-200"
            />
          ) : (
            <div className="w-full h-40 bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center text-gray-400 text-sm">
              No annotation
            </div>
          )}
          {originalImage && (
            <button
              onClick={() => openCanvas('annotated')}
              className="edit-controls absolute bottom-2 right-2 px-2 py-1 bg-black/60 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition"
            >
              Edit annotation
            </button>
          )}
        </div>
      </div>

      {/* Canvas overlay */}
      {showCanvas && (
        <AnnotationCanvas
          imageSrc={canvasTarget === 'annotated' && annotatedImage ? annotatedImage : originalImage}
          onSave={handleSaveAnnotation}
          onCancel={() => setShowCanvas(false)}
        />
      )}
    </>
  )
}

export default ImagePanel
