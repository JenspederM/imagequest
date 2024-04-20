import { useState } from "react";
import { Select } from "../components/Select";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebaseConfig";

export function Settings() {
  const navigate = useNavigate();
  const [currentTheme, setCurrentTheme] = useState("dark");

  const allThemes = [
    "light",
    "dark",
    "cupcake",
    "bumblebee",
    "emerald",
    "corporate",
    "synthwave",
    "retro",
    "cyberpunk",
    "valentine",
    "halloween",
    "garden",
    "forest",
    "aqua",
    "lofi",
    "pastel",
    "fantasy",
    "wireframe",
    "black",
    "luxury",
    "dracula",
    "cmyk",
    "autumn",
    "business",
    "acid",
    "lemonade",
    "night",
    "coffee",
    "winter",
    "dim",
    "nord",
    "sunset",
  ];

  const changeTheme = (theme?: string, defaultTheme: string = "dark") => {
    const body = document.querySelector("html");
    if (!body) return;
    if (theme) {
      body.setAttribute("data-theme", theme);
    } else {
      body.setAttribute("data-theme", defaultTheme);
    }
  };

  function onSelect(theme: string) {
    setCurrentTheme(theme);
    changeTheme(theme);
  }

  async function signOut() {
    console.log("signing out");
    await auth.signOut();
    navigate("/");
  }

  return (
    <>
      <div className="text-2xl font-bold mb-6 text-primary">Settings</div>
      <div className="flex flex-col flex-grow w-full space-y-4">
        <Select
          id="selectThemeInput"
          label="Theme"
          value={currentTheme}
          options={allThemes}
          onChange={(e) => onSelect(e)}
        />
      </div>
      <div className="flex flex-col space-y-2">
        <button className="btn btn-error" onClick={() => signOut()}>
          Sign out
        </button>
        <button className="btn btn-primary" onClick={() => navigate("/")}>
          Go back home
        </button>
      </div>
    </>
  );
}
