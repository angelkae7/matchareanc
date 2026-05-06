
import { useRef } from 'react'

export function DropZone({ province, communes, targetCount, onDrop, isError }) {
  const provinceType = province.toLowerCase()
  const colorClass = provinceType.includes("nord")
    ? "zone-nord"
    : provinceType.includes("sud")
    ? "zone-sud"
    : "zone-iles"
  const zoneRef = useRef(null)

  // Ajouter animation d'erreur si nécessaire
  if (isError) {
    zoneRef.current?.classList.add('zone-error')
    setTimeout(() => {
      zoneRef.current?.classList.remove('zone-error')
    }, 600)
  }

  return (
    <div
      ref={zoneRef}
      className={`drop-zone ${colorClass}`}
      onDrop={(e) => {
        e.preventDefault()
        onDrop(province, e)
      }}
      onDragOver={(e) => e.preventDefault()}
      onDragEnter={(e) => e.preventDefault()}
      onPointerUp={(e) => onDrop(province, e)}
      onTouchEnd={(e) => onDrop(province, e)}
      onClick={() => onDrop(province)}
    >
      <div className="zone-header">
        <h3>{province.toUpperCase()}</h3>
        <span>{communes.length}/{targetCount}</span>
      </div>
      <div className="zone-content">
        {communes.length === 0 ? (
          <div className="zone-empty" />
        ) : (
          communes.map((commune, index) => (
            <span key={index} className="zone-chip">
              {commune.nom_commune}
            </span>
          ))
        )}
      </div>
    </div>
  )
}