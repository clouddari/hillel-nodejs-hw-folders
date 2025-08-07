import { Link } from "react-router-dom";
import "./ItemCard.css";

function ItemCard({ item, onRemove }) {
  return (
    <div className="item-card">
      <Link to={`/item/${item._id}`} className="card-link">
        <img src={item.image} alt={item.name} />
        <h3 className="item-title">{item.name}</h3>
        <p className="item-description">{item.description}</p>
      </Link>

      {onRemove && (
        <div className="actions">
          <button className="favorite-toggle-button" onClick={() => onRemove(item._id)}>
            🗑 Remove
          </button>
        </div>
      )}
    </div>
  );
}

export default ItemCard;
