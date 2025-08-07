import { useEffect, useState } from "react";
import axios from "axios";
import ItemCard from "../components/ItemCard";
import "./Favorites.css";

function Favorites() {
  const [favorites, setFavorites] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token || token === "null") {
      setError("User not logged in.");
      return;
    }

    const fetchFavorites = async () => {
      try {
        const res = await axios.get(
          "http://localhost:3000/api/users/favorites",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (typeof res.data[0] === "object" && res.data[0]._id) {
          setFavorites(res.data);
          return;
        }

        const itemPromises = res.data.map((id) =>
          axios.get(`http://localhost:3000/api/items/${id}`)
        );
        const fullItems = await Promise.all(itemPromises);
        setFavorites(fullItems.map((res) => res.data));
      } catch (err) {
        console.error("Error fetching favorites", err);
        setError("Error fetching favorites.");
      }
    };

    fetchFavorites();
  }, []);

  const handleRemoveFavorite = async (itemId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `http://localhost:3000/api/users/favorites/${itemId}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setFavorites((prev) => prev.filter((item) => item._id !== itemId));
    } catch (err) {
      console.error("Failed to remove favorite:", err);
    }
  };

  return (
    <div className="favorites-page">
      <h2>My Favorites</h2>

      {error && <p className="error-message">{error}</p>}

      {favorites.length === 0 && !error ? (
        <p className="empty-message">You have no favorite items yet.</p>
      ) : (
        <div className="item-list">
          {favorites.map((item) => (
            <ItemCard
              key={item._id}
              item={item}
              onRemove={handleRemoveFavorite}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default Favorites;
