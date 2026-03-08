function SourceBadge({ source, modified }) {
  if (!source && !modified) return null

  return (
    <span className={`source-badge no-print inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
      modified
        ? 'bg-amber-100 text-amber-800'
        : 'bg-purple-100 text-purple-800'
    }`}>
      {modified ? 'Modified by surveyor' : source}
    </span>
  )
}

export default SourceBadge
