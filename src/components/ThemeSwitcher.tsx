import { appActions, appState } from "@/state";
import { useEffect } from "react";
import { useSnapshot } from "valtio";

const ThemeSwitcher = () => {
  const themeSnap = useSnapshot(appState).theme;

  useEffect(() => {
    document.body.classList.remove("light", "dark");
    document.body.classList.add(themeSnap);
    localStorage.setItem("vimnote_theme", JSON.stringify(themeSnap));
  }, [themeSnap]);

  return (
    <div>
      <button
        className="bg-sky-300 p-2 rounded hover:bg-sky-400 transition-colors"
        onClick={appActions.toggleTheme}
      >
        Toggle
      </button>
      <p>Theme: {themeSnap}</p>
    </div>
  );
};

export default ThemeSwitcher;
