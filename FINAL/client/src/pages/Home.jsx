import LatestReviews from "../components/LatestReviews";
import { Link } from "react-router-dom";
import "./Home.css";

function Home() {
  return (
    <div className="home-container">
      <section className="hero-section">
        <img
          src="https://prh.imgix.net/articles/finalheader_booktomovie.png"
          alt="Reading and Watching"
          className="hero-image"
        />{" "}
        <h1 className="hero-title">
          Welcome to <span>Review-Bro</span>
        </h1>
        <p className="hero-subtitle">
          Discover and share reviews for your favorite <strong>books</strong>{" "}
          and <strong>movies</strong>. Join the community and add your voice!
        </p>
        <Link to="/register" className="cta-button">
          Get Started
        </Link>
      </section>

      <section className="features-section">
        <h2>Why Join Review-Bro?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <h3>🗣️ Voice Your Opinion</h3>
            <p>
              Write reviews for your favorite (or least favorite!) books and
              movies.
            </p>
          </div>
          <div className="feature-card">
            <h3>📚 Your Library</h3>
            <p>
              Save what you love. Create your personal list of favorites for
              quick access.
            </p>
          </div>
          <div className="feature-card">
            <h3>🌟 Trusted Community</h3>
            <p>
              We moderate every review to ensure quality and respectful
              conversation.
            </p>
          </div>
        </div>
      </section>

      <LatestReviews />
    </div>
  );
}

export default Home;
