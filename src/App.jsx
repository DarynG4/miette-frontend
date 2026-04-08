import { useState, useEffect } from "react";

// import.meta.env is Vite's way of exposing environmental variables
//  it's the frontend equivalent of process.env on the backend
//  ?? is the nullish coalescing operator — it returns the right side only if the left side is null or undefined
// in development VITE_API_URL is http://localhost:8080 but the Vite proxy (in vite.config.js) intercepts /api requests anyway so the empty string fallback means the fetch goes to the same origin
// in production VITE_API_URL will be the Render backend URL
const API_URL = import.meta.env.VITE_API_URL ?? "";

// isLoading starts as true because the fetch begins immediately when the component mounts — so the component is already loading from the very first render
// starting as false would cause a flash of the empty data state before the loading state kicks in
export default function App() {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // fetchHealth is defined inside useEffect and then called
  // this is because useEffect's callback cannot be async directly — React doesn't handle async cleanup properly if the effect itself is async
  // solution is to define an async function inside the effect and call it immediately
  // this is the standard pattern for async operations inside useEffect
  useEffect(() => {
    const fetchHealth = async () => {
      try {
        const response = await fetch(`${API_URL}/api/health`);

        // fetch() only rejects (throws) on network failures — a completely unreachable server, it does NOT throw on HTTP error status codes like 404 or 500
        // a response with status 500 from the server still resolves as a successful fetch from JavaScript's perspective
        // must manually check response.ok (which is true for status codes 200-299) and throw your own error for non-success statuses
        if (!response.ok) {
          throw new Error(`Server responded with status ${response.status}`);
        }

        // response.json() is itself an async operation — it reads the response body stream and parses it — this is why it needs await
        // can't access the parsed data without waiting for this step
        const json = await response.json();
        setData(json);
      } catch (error) {
        setError(error.message);
      } finally {
        // finally runs regardless of whether the try succeeded or the catch ran
        // this ensures isLoading always gets set to false when the fetch completes — whether it succeeded or failed
        // without finally you'd have to call setIsLoading(false) in both the try block and the catch block
        setIsLoading(false);
      }
    };

    // empty dependency array [] is critical — it means the effect runs exactly once, after the component's first render
    // without it the effect would run after every render, potentially creating an infinite loop
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
