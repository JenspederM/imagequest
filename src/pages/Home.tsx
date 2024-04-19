import { useNavigate } from "react-router-dom";

export function Home() {
  const navigate = useNavigate();
  return (
    <>
      <div className="flex flex-col flex-grow">
        <h1 className="flex flex-col text-2xl text-center h-4/5 items-center justify-center">
          Guess the Prompt!
        </h1>
      </div>
      <div className="flex flex-col w-full space-y-2">
        <button
          className="btn btn-primary btn-block"
          onClick={() => navigate("/play")}
        >
          Play
        </button>
        <button
          className="btn btn-primary btn-block"
          onClick={() => navigate("/settings")}
        >
          Settings
        </button>
      </div>
    </>
  );
}
