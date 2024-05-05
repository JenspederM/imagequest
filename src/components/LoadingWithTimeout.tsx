import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export function LoadingWithTimeout(
  { timeout }: { timeout?: number } = { timeout: 1500 }
) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, timeout);
  }, []);
  return (
    <>
      <div className="flex flex-col flex-grow text-primary items-center justify-center">
        {loading ? (
          <div className="loading loading-xs"></div>
        ) : (
          <h1>Something went wrong...</h1>
        )}
      </div>
      {!loading && (
        <button className="btn btn-error" onClick={() => navigate("/")}>
          Go back home
        </button>
      )}
    </>
  );
}
