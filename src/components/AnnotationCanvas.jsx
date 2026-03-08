import { useRef, useState, useEffect, useCallback } from 'react'

function AnnotationCanvas({ imageSrc, onSave, onCancel }) {
  const canvasRef = useRef(null)
  const [tool, setTool] = useState('pen')
  const [color, setColor] = useState('#ef4444')
  const [lineWidth, setLineWidth] = useState(3)
  const [drawing, setDrawing] = useState(false)
  const [circleStart, setCircleStart] = useState(null)
  const imgRef = useRef(null)
  const pathsRef = useRef([])

  // Load image onto canvas
  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => {
      // Scale to fit modal while maintaining aspect ratio
      const maxW = 800
      const maxH = 600
      const scale = Math.min(maxW / img.width, maxH / img.height, 1)
      canvas.width = img.width * scale
      canvas.height = img.height * scale
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
      imgRef.current = img
    }
    img.src = imageSrc
  }, [imageSrc])

  const getPos = (e) => {
    const rect = canvasRef.current.getBoundingClientRect()
    const scaleX = canvasRef.current.width / rect.width
    const scaleY = canvasRef.current.height / rect.height
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    }
  }

  const redraw = useCallback(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (imgRef.current) {
      ctx.drawImage(imgRef.current, 0, 0, canvas.width, canvas.height)
    }
    // Replay all saved paths
    for (const path of pathsRef.current) {
      ctx.strokeStyle = path.color
      ctx.lineWidth = path.lineWidth
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'
      if (path.type === 'pen') {
        ctx.beginPath()
        for (let i = 0; i < path.points.length; i++) {
          if (i === 0) ctx.moveTo(path.points[i].x, path.points[i].y)
          else ctx.lineTo(path.points[i].x, path.points[i].y)
        }
        ctx.stroke()
      } else if (path.type === 'circle') {
        const dx = path.end.x - path.start.x
        const dy = path.end.y - path.start.y
        const radius = Math.sqrt(dx * dx + dy * dy)
        ctx.beginPath()
        ctx.arc(path.start.x, path.start.y, radius, 0, Math.PI * 2)
        ctx.stroke()
      } else if (path.type === 'text') {
        ctx.font = `${path.lineWidth * 6}px sans-serif`
        ctx.fillStyle = path.color
        ctx.fillText(path.text, path.pos.x, path.pos.y)
      }
    }
  }, [])

  const handleMouseDown = (e) => {
    const pos = getPos(e)
    if (tool === 'pen') {
      setDrawing(true)
      pathsRef.current.push({ type: 'pen', color, lineWidth, points: [pos] })
    } else if (tool === 'circle') {
      setCircleStart(pos)
      setDrawing(true)
    } else if (tool === 'text') {
      const text = prompt('Enter label text:')
      if (text) {
        pathsRef.current.push({ type: 'text', color, lineWidth, pos, text })
        redraw()
      }
    }
  }

  const handleMouseMove = (e) => {
    if (!drawing) return
    const pos = getPos(e)
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')

    if (tool === 'pen') {
      const current = pathsRef.current[pathsRef.current.length - 1]
      current.points.push(pos)
      ctx.strokeStyle = color
      ctx.lineWidth = lineWidth
      ctx.lineCap = 'round'
      ctx.beginPath()
      const prev = current.points[current.points.length - 2]
      ctx.moveTo(prev.x, prev.y)
      ctx.lineTo(pos.x, pos.y)
      ctx.stroke()
    } else if (tool === 'circle' && circleStart) {
      redraw()
      const dx = pos.x - circleStart.x
      const dy = pos.y - circleStart.y
      const radius = Math.sqrt(dx * dx + dy * dy)
      ctx.strokeStyle = color
      ctx.lineWidth = lineWidth
      ctx.beginPath()
      ctx.arc(circleStart.x, circleStart.y, radius, 0, Math.PI * 2)
      ctx.stroke()
    }
  }

  const handleMouseUp = (e) => {
    if (tool === 'circle' && circleStart && drawing) {
      const pos = getPos(e)
      pathsRef.current.push({ type: 'circle', color, lineWidth, start: circleStart, end: pos })
      setCircleStart(null)
    }
    setDrawing(false)
  }

  const handleUndo = () => {
    pathsRef.current.pop()
    redraw()
  }

  const handleSave = () => {
    onSave(canvasRef.current.toDataURL('image/png'))
  }

  const tools = [
    { id: 'pen', label: 'Pen' },
    { id: 'circle', label: 'Circle' },
    { id: 'text', label: 'Text' },
  ]

  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-[900px] w-full">
        {/* Toolbar */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-200">
          <div className="flex gap-1">
            {tools.map(t => (
              <button
                key={t.id}
                onClick={() => setTool(t.id)}
                className={`px-3 py-1 text-sm rounded ${
                  tool === t.id
                    ? 'bg-rics-purple text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div className="h-6 w-px bg-gray-300" />

          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="w-8 h-8 rounded cursor-pointer border border-gray-300"
          />

          <label className="text-xs text-gray-500">Width:</label>
          <input
            type="range"
            min="1"
            max="10"
            value={lineWidth}
            onChange={(e) => setLineWidth(Number(e.target.value))}
            className="w-20"
          />

          <button onClick={handleUndo} className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200">
            Undo
          </button>

          <div className="flex-1" />

          <button onClick={onCancel} className="px-4 py-1.5 text-sm text-gray-600 hover:text-gray-800">
            Cancel
          </button>
          <button onClick={handleSave} className="px-4 py-1.5 text-sm bg-rics-purple text-white rounded-lg hover:bg-rics-purple-dark">
            Save
          </button>
        </div>

        {/* Canvas */}
        <div className="p-4 flex items-center justify-center bg-gray-100">
          <canvas
            ref={canvasRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={() => setDrawing(false)}
            className="max-w-full max-h-[60vh] cursor-crosshair rounded border border-gray-300"
          />
        </div>
      </div>
    </div>
  )
}

export default AnnotationCanvas
