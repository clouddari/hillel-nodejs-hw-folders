import { useState } from "react";
import useItems from "../hooks/useItems";
import { Link } from "react-router-dom";
import SearchInput from "../components/SearchInput";
import "./Works.css";

function Works() {
  const { items, loading, error } = useItems();
  const [filter, setFilter] = useState("all");
  const [query, setQuery] = useState("");

  const filteredItems = items
    .filter((item) => (filter === "all" ? true : item.type === filter))
    .filter((item) => item.name.toLowerCase().includes(query.toLowerCase()));

  if (loading) return <p>loading...</p>;
  if (error) return <p>error</p>;

  return (
    <div className="works-page">
      <h2 className="works-title">Books and movies</h2>
      {items.length === 0 && <p>Loading or no data...</p>}

      <div className="filter-buttons">
        <button onClick={() => setFilter("all")}>All</button>
        <button onClick={() => setFilter("book")}>Books</button>
        <button onClick={() => setFilter("movie")}>Movies</button>
      </div>

      <SearchInput
        query={query}
        setQuery={setQuery}
        placeholder="Search by name..."
      />

      <ul className="works-list">
        {filteredItems.map((item) => (
          <li key={item._id}>
            <Link to={`/item/${item._id}`}>
              {" "}
              <img
                src={item.image}
                alt={item.name}
                style={{ maxWidth: "120px", maxHeight: "180px" }}
              />
              <h3>
                {item.name} ({item.year})
              </h3>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Works;
