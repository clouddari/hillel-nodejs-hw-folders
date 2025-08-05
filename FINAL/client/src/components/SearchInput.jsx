import "./SearchInput.css";

function SearchInput({ query, setQuery, placeholder = "Search..." }) {
  return (
    <div className="search-wrapper">
      <input
        type="text"
        className="search-input"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
      />
    </div>
  );
}

export default SearchInput;
