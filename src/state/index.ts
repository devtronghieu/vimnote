import { proxy } from "valtio";

export type Theme = "light" | "dark";

export interface AppState {
  theme: Theme;
}

export const appState = proxy<AppState>({
  theme: (function (): Theme {
    const storedTheme = localStorage.getItem("vimnote_theme");
    if (storedTheme) {
      return JSON.parse(storedTheme);
    }
    return "dark";
  })(),
});

export const appActions = {
  toggleTheme: () => {
    appState.theme = appState.theme === "dark" ? "light" : "dark";
  },
};

export enum Keymap {
  ToggleTheme = "t",
  Unknown = "unknown",
}

export const handleKeyPress = (key: string) => {
  switch (key) {
    case Keymap.ToggleTheme:
      appActions.toggleTheme();
      break;

    default:
      console.log("--> Unmapped key:", key);
      break;
  }
};
