import { useLocalStorage } from "@/hooks";
import { useEffect } from "react";

type Theme = "light" | "dark";

const ThemeSwitcher = () => {
  const [theme, setTheme] = useLocalStorage<Theme>("vimnote_theme", "dark");

  useEffect(() => {
    document.body.classList.remove("light", "dark");
    document.body.classList.add(theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <div>
      <button
        className="bg-sky-300 p-2 rounded hover:bg-sky-400 transition-colors"
        onClick={toggleTheme}
      >
        Toggle
      </button>
      <p>Theme: {theme}</p>
    </div>
  );
};

export default ThemeSwitcher;
