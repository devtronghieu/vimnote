import { appState } from "@/state";
import { FC, ReactNode, useEffect } from "react";
import { useSnapshot } from "valtio";

interface Props {
  children: ReactNode;
  className?: string;
}

const Theme: FC<Props> = ({ children, className }) => {
  const themeSnap = useSnapshot(appState).theme;

  useEffect(() => {
    const storedTheme = localStorage.getItem("vimnote_theme");
    if (storedTheme) {
      appState.theme = JSON.parse(storedTheme);
    }
  }, []);

  useEffect(() => {
    document.body.classList.remove("light", "dark");
    document.body.classList.add(themeSnap);
  }, [themeSnap]);

  return (
    <div
      className={`dark:bg-black dark:text-white duration-500 transition-colors ease-in-out ${className}`}
    >
      {children}
    </div>
  );
};

export default Theme;
