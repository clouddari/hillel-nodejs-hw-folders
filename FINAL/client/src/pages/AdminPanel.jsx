import "./AdminPanel.css";
import { useEffect, useState } from "react";
import axios from "axios";
import SearchInput from "../components/SearchInput";
import { Link } from "react-router-dom";

function AdminPanel() {
  const [items, setItems] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    name: "",
    year: "",
    description: "",
    image: "",
    type: "movie",
  });

  const [query, setQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const token = localStorage.getItem("token");

  useEffect(() => {
    axios
      .get("http://localhost:3000/api/items", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setItems(res.data))
      .catch((err) => console.error(err));
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await axios.put(`http://localhost:3000/api/items/${editing}`, form, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await axios.post("http://localhost:3000/api/items", form, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      setForm({
        name: "",
        year: "",
        description: "",
        image: "",
        type: "movie",
      });
      setEditing(null);
      const res = await axios.get("http://localhost:3000/api/items", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setItems(res.data);
    } catch (err) {
      console.error("Error saving item:", err);
    }
  };

  const handleAddNew = () => {
    setForm({
      name: "",
      year: "",
      description: "",
      image: "",
      type: "movie",
    });
    setEditing(null);
    setShowModal(true);
  };

  const handleEdit = (item) => {
    setForm(item);
    setEditing(item._id);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/api/items/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setItems(items.filter((i) => i._id !== id));
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="admin-container">
      <h2>Admin Panel</h2>

      <button onClick={handleAddNew} className="add-new-button">
        Add New Item
      </button>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <form className="admin-form" onSubmit={handleSubmit}>
              <h3>{editing ? "Update item" : "Add new item"}</h3>

              <input
                type="text"
                placeholder="Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
              <input
                type="number"
                placeholder="Year"
                value={form.year}
                onChange={(e) => setForm({ ...form, year: e.target.value })}
                required
              />
              <input
                type="text"
                placeholder="Image URL"
                value={form.image}
                onChange={(e) => setForm({ ...form, image: e.target.value })}
              />
              <textarea
                placeholder="Description"
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
              />
              <select
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
              >
                <option value="movie">Movie</option>
                <option value="book">Book</option>
              </select>

              <div className="modal-buttons">
                <button type="submit">{editing ? "Update" : "Create"}</button>
                <button type="button" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="admin-search">
        <h3>Search Items:</h3>
        <SearchInput
          query={query}
          setQuery={setQuery}
          placeholder="Search by name..."
        />
      </div>

      <ul className="admin-item-list">
        {filteredItems.map((item) => (
          <li key={item._id} className="admin-item-card">
            <Link to={`/item/${item._id}`}>
              <img
                src={item.image}
                alt={item.name}
                className="admin-item-image"
              />
              <h4>
                {item.name} ({item.year})
              </h4>
            </Link>
            <div className="admin-item-actions">
              <button onClick={() => handleEdit(item)}>Edit</button>
              <button onClick={() => handleDelete(item._id)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AdminPanel;
