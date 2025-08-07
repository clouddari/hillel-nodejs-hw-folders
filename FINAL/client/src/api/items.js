import axios from "axios";

const API_URL = "http://localhost:3000/api/items";

export async function getItems() {
  const token = localStorage.getItem("token");

  try {
    const res = await axios.get(API_URL, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true,
    });
    return res.data;
  } catch (err) {
    console.error("Failed to fetch items:", err);
    throw err;
  }
}

export async function getItemById(id) {
  const token = localStorage.getItem("token");

  try {
    const res = await axios.get(`${API_URL}/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (err) {
    console.error("Failed to fetch item:", err);
    throw err;
  }
}
