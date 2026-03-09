import { useCallback, useEffect, useState } from "react";
import { getHealth, getModelsStatus, getRootMessage } from "../services/backendService";

export default function useApiStatus() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [root, setRoot] = useState(null);
  const [health, setHealth] = useState(null);
  const [models, setModels] = useState(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [rootRes, healthRes, modelsRes] = await Promise.all([getRootMessage(), getHealth(), getModelsStatus()]);
      setRoot(rootRes);
      setHealth(healthRes);
      setModels(modelsRes);
    } catch (err) {
      setError(err.message || "Failed to reach backend.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { loading, error, root, health, models, refresh };
}
