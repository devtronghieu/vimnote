import { proxy } from "valtio";

export type Theme = "light" | "dark";

export interface AppState {
  theme: Theme;
  cheatsheet: boolean;
}

export const appState = proxy<AppState>({
  theme: (function (): Theme {
    const storedTheme = localStorage.getItem("vimnote_theme");
    const theme: Theme = storedTheme ? JSON.parse(storedTheme) : "dark";
    return theme;
  })(),
  cheatsheet: false,
});

export const appActions = {
  toggleTheme: () => {
    appState.theme = appState.theme === "dark" ? "light" : "dark";
    localStorage.setItem("vimnote_theme", JSON.stringify(appState.theme));
  },
  toggleCheatsheet: () => (appState.cheatsheet = !appState.cheatsheet),
};

export enum Keymap {
  ToggleTheme = "t",
  Cheatsheet = "?",
  Unknown = "unknown",
}

export const handleKeyPress = (key: string) => {
  switch (key) {
    case Keymap.ToggleTheme:
      appActions.toggleTheme();
      break;

    case Keymap.Cheatsheet:
      console.log("--> Toggle cheat sheet");
      break;

    default:
      console.log("--> Unmapped key:", key);
      break;
  }
};
