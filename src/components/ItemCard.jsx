
export function ItemCard({ item, onDragStart }) {
  return (
    <button
      className="item-chip"
      draggable="true"
      onDragStart={() => onDragStart(item)}
    >
      {item.nom_commune}
    </button>
  )
}