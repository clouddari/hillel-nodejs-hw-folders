import { useEffect, useState } from "react";
import { getItemById } from "../api/items";

function useItemsById(id) {
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getItemById(id)
      .then(setItem)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [id]);

  return { item, loading, error };
}

export default useItemsById;
