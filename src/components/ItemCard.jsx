
export function ItemCard({ item, onDragStart, onTouchStart, isSelected }) {
  return (
    <button
      className={`item-chip${isSelected ? " selected" : ""}`}
      draggable="true"
      onDragStart={(e) => onDragStart(item, e)}
      onClick={() => onDragStart(item)}
      onTouchStart={(e) => onTouchStart?.(item, e)}
    >
      {item.nom_commune}
    </button>
  )
}
