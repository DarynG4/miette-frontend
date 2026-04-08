import { useState, useEffect } from "react";

const API_URL = import.meta.env.VITE_API_URL ?? "";

export default function App() {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHealth = async () => {
      try {
        const response = await fetch(`${API_URL}/api/health`);

        if (!response.ok) {
          throw new Error(`Server responded with status ${response.status}`);
        }

        const json = await response.json();
        setData(json);
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHealth();
  }, []);

  if (isLoading) return <p>Checking connection...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <p>{data.message}</p>
      <p>Database: {data.db}</p>
    </div>
  );
}
