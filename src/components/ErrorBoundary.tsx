import {
  ErrorResponse,
  isRouteErrorResponse,
  useNavigate,
  useRouteError,
} from "react-router-dom";

export function ErrorBoundary() {
  const error = useRouteError();
  const navigate = useNavigate();

  if (isRouteErrorResponse(error)) {
    return (
      <>
        <div className="flex flex-col flex-grow items-center justify-center space-y-4">
          <h1 className="text-5xl font-bold">
            {(error as ErrorResponse).status}
          </h1>
          <h1 className="text-2xl">{(error as ErrorResponse).statusText}</h1>
        </div>
        <button className="btn btn-primary" onClick={() => navigate("/")}>
          Go bank home
        </button>
      </>
    );
  }
}
