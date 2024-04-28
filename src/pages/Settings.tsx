import { useState } from "react";
import { Select } from "../components/Select";
import { useNavigate } from "react-router-dom";
import { db } from "../firebaseConfig";
import { changeTheme } from "../utils";
import { useAuth } from "../providers/AuthProvider";
import { doc, updateDoc } from "firebase/firestore";

export function Settings() {
  const auth = useAuth();
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

  async function onSelect(theme: string) {
    setCurrentTheme(theme);
    await updateDoc(doc(db, "users", auth.user.uid), { theme: theme });
    changeTheme(theme);
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
        <button
          className="btn btn-error"
          onClick={async () => {
            await auth.signOut();
            navigate("/");
          }}
        >
          Sign out
        </button>
        <button className="btn btn-primary" onClick={() => navigate("/")}>
          Go back home
        </button>
      </div>
    </>
  );
}
