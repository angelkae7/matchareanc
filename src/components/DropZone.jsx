
export function DropZone({ province, communes, targetCount, onDrop }) {
  const provinceType = province.toLowerCase()
  const colorClass = provinceType.includes("nord")
    ? "zone-nord"
    : provinceType.includes("sud")
    ? "zone-sud"
    : "zone-iles"

  return (
    <div
      className={`drop-zone ${colorClass}`}
      onDrop={() => onDrop(province)}
      onDragOver={(e) => e.preventDefault()}
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