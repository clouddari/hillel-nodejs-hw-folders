import { useEffect, useState } from "react";
import { getItems } from "../api/items";

function useItems() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getItems()
      .then(setItems)
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  return { items, loading, error };
}

export default useItems;
