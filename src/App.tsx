import { Game } from "./pages/Game";
import { Settings } from "./pages/Settings";
import { Home } from "./pages/Home";
import Play from "./pages/Play";
import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import { AuthProvider } from "./providers/AuthProvider";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { NotificationProvider } from "./providers/NotificationProvider";

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
      <Route
        path="*"
        element={
          <div className="flex flex-col items-center justify-center">
            <h1 className="text-3xl font-bold">404</h1>
            <p>Page not found</p>
          </div>
        }
      />
    </>
  )
);

function App() {
  return (
    <div className="flex flex-col absolute inset-0 w-full min-h-0 max-h-screen items-center justify-center overscroll-contain overflow-hidden">
      <div className="flex flex-col h-full w-full xs:w-5/6 sm:w-2/3 lg:w-1/3 p-8 pb-16">
        <NotificationProvider>
          <AuthProvider>
            <RouterProvider router={router}></RouterProvider>
          </AuthProvider>
        </NotificationProvider>
      </div>
    </div>
  );
}
export default App;
