import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import "./AdminReviewModeration.css";

function AdminReviewModeration() {
  const { user } = useContext(AuthContext);
  const [reviews, setReviews] = useState([]);
  const [selectedReview, setSelectedReview] = useState(null);

  useEffect(() => {
    const fetchPending = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/items/reviews/pending", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setReviews(res.data);
      } catch (err) {
        console.error("Error fetching pending reviews:", err);
      }
    };

    if (user?.role === "admin") {
      fetchPending();
    }
  }, [user]);

  const approve = async (reviewId) => {
    try {
      await axios.put(
        `http://localhost:3000/api/items/reviews/${reviewId}/approve`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setReviews(reviews.filter((r) => r._id !== reviewId));
    } catch (err) {
      console.error("Approve failed:", err);
    }
  };

  const cancel = async (reviewId) => {
    try {
      await axios.delete(
        `http://localhost:3000/api/items/reviews/${reviewId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setReviews(reviews.filter((r) => r._id !== reviewId));
    } catch (err) {
      console.error("Cancel failed:", err);
    }
  };

  return (
    <div className="admin-review-container">
      <h2 className="admin-review-title">Pending Reviews</h2>

      {reviews.length === 0 ? (
        <p>No pending reviews</p>
      ) : (
        <ul className="review-list">
          {reviews.map((r) => (
            <li
              key={r._id}
              className="review-item"
              onClick={() => setSelectedReview(r)}
            >
              <p>
                <strong>{r.author}</strong> on <em>{r.itemName}</em> ({r.itemType})
              </p>
              <p>{r.text}</p>
              <p>Rating: {r.rating}/5</p>
            </li>
          ))}
        </ul>
      )}

      {selectedReview && (
        <div className="overlay" onClick={() => setSelectedReview(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>Review by {selectedReview.author}</h3>
            <p><strong>Item:</strong> {selectedReview.itemName}</p>
            <p><strong>Type:</strong> {selectedReview.itemType}</p>
            <p><strong>Rating:</strong> {selectedReview.rating}/5</p>
            <p><strong>Text:</strong> {selectedReview.text}</p>

            <div className="button-group">
              <button className="approve-button" onClick={() => approve(selectedReview._id)}>
                Approve
              </button>
              <button className="cancel-button" onClick={() => cancel(selectedReview._id)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminReviewModeration;
