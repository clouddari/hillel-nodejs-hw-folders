import { useParams } from "react-router-dom";
import useItemsById from "../hooks/useItemsByID";
import { useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import "./Item.css";

function ItemPage() {
  const { id } = useParams();
  const { item, loading, error } = useItemsById(id);
  const [text, setText] = useState("");
  const [rating, setRating] = useState(5);
  const { user } = useContext(AuthContext);

  if (loading) return <p>loading...</p>;
  if (error || !item) return <p>Item not found.</p>;

  const submitReview = async () => {
    try {
      await axios.post(
        `http://localhost:3000/api/items/${item._id}/reviews`,
        {
          author: user.username,
          authorPic: "/default-user.png",
          rating,
          text,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      alert("Review submitted and will appear after approval");
      setText("");
    } catch (err) {
      console.error("Review submit error:", err);
    }
  };

  return (
    <div className="item-container">
      <h2>
        {item.name} ({item.year})
      </h2>
      <img src={item.image} alt={item.name} />
      <p>{item.description}</p>

      <div className="reviews-section">
        {item.reviews?.length > 0 ? (
          <>
            <h4>Reviews:</h4>
            <ul className="item-review-list">
              {item.reviews.map((r, i) => (
                <li key={i}>
                  <img
                    src={r.authorPic}
                    alt={r.author}
                    style={{
                      width: "30px",
                      height: "30px",
                      borderRadius: "50%",
                    }}
                  />
                  <strong>{r.author}</strong> – ⭐ {r.rating}/5
                  <br />
                  <small>{new Date(r.time).toLocaleString()}</small>
                  <p className="item-review-text">{r.text}</p>
                </li>
              ))}
            </ul>
          </>
        ) : (
          <p>No reviews yet.</p>
        )}
      </div>

      {user && (
        <form
          className="item-review-form"
          onSubmit={(e) => {
            e.preventDefault();
            submitReview();
          }}
        >
          <textarea
            placeholder="Your review"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <div className="rating-label">Your rating:</div>
          <div className="star-rating">
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                className={star <= rating ? "star filled" : "star"}
                onClick={() => setRating(star)}
                title={`Rate ${star} out of 5`}
              >
                ★
              </span>
            ))}
          </div>

          <button type="submit">Submit Review</button>
        </form>
      )}
    </div>
  );
}

export default ItemPage;
