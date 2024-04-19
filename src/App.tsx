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

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<Home />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="/play" element={<Play />} />
      <Route path="/game/:id" element={<Game />} />
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
