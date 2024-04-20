import { Game } from "./pages/Game";
import { Settings } from "./pages/Settings";
import { Home } from "./pages/Home";
import Play from "./pages/Play";
import {
  ErrorResponse,
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
  isRouteErrorResponse,
  useNavigate,
  useRouteError,
} from "react-router-dom";
import { AuthProvider } from "./providers/AuthProvider";

function ErrorBoundary() {
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

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route ErrorBoundary={ErrorBoundary} path="/" element={<Home />} />
      <Route
        ErrorBoundary={ErrorBoundary}
        path="/settings"
        element={<Settings />}
      />
      <Route ErrorBoundary={ErrorBoundary} path="/play" element={<Play />} />
      <Route
        ErrorBoundary={ErrorBoundary}
        path="/game/:id"
        element={<Game />}
      />
    </>
  )
);

function App() {
  return (
    <div className="flex flex-col absolute inset-0 w-full min-h-0 max-h-screen items-center justify-center overscroll-contain overflow-hidden">
      <div className="flex flex-col h-full w-full xs:w-5/6 sm:w-2/3 lg:w-1/3 p-8 pb-16">
        <AuthProvider>
          <RouterProvider router={router} />
        </AuthProvider>
      </div>
    </div>
  );
}
export default App;
