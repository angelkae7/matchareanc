
export function ItemCard({ item, onDragStart, isSelected }) {
  return (
    <button
      className={`item-chip${isSelected ? " selected" : ""}`}
      draggable="true"
      onDragStart={(e) => onDragStart(item, e)}
      onClick={() => onDragStart(item)}
    >
      {item.nom_commune}
    </button>
  )
}