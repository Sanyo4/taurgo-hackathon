function ThinkingBubble({ thinking }) {
  if (!thinking) return null

  return (
    <details className="ai-thinking-bubble no-print mb-3">
      <summary className="text-xs text-gray-400 cursor-pointer hover:text-gray-600 select-none">
        AI reasoning
      </summary>
      <div className="mt-2 p-3 bg-gray-50 rounded-lg border border-gray-200 text-xs text-gray-600 font-mono whitespace-pre-wrap max-h-48 overflow-y-auto">
        {thinking}
      </div>
    </details>
  )
}

export default ThinkingBubble
