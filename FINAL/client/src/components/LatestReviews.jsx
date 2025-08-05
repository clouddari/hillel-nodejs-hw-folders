import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

function LatestReviews() {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:3000/api/items/reviews/latest")
      .then((res) => setReviews(res.data))
      .catch((err) => console.error("Fetch reviews failed", err));
  }, []);

  if (reviews.length === 0) return <p>No reviews yet.</p>;

  return (
    <section className="latest-reviews">
      <h3>Latest Reviews</h3>
      <ul className="review-list">
        {reviews.slice(0, 6).map((review) => (
          <li key={review._id} className="review-card">
            <div
              className="review-stars"
              aria-label={`Rating: ${review.rating} out of 5`}
            >
              {"★".repeat(review.rating)}
              {"☆".repeat(5 - review.rating)}
            </div>
            <p className="review-text">
              "
              {review.text.length > 200
                ? review.text.slice(0, 200) + "..."
                : review.text}
              "
            </p>
            <div className="review-author">
              — {review.author} on{" "}
              <Link
                to={`/item/${review.itemId}`}
                className="review-link"
                title="Go to item page"
              >
                {review.itemName}
              </Link>
              {review.itemYear && (
                <span className="review-year">({review.itemYear})</span>
              )}
            </div>
            <div className="review-date">
              {new Date(review.time).toLocaleDateString()}
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default LatestReviews;
