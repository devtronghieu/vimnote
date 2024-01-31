import { proxy } from "valtio";

export type Theme = "light" | "dark";

export enum PluginModal {
  Cheatsheet,
}

export interface AppState {
  theme: Theme;
  modals: PluginModal[];
}

export const appState = proxy<AppState>({
  theme: "dark",
  modals: [],
});

export enum Keymap {
  ToggleTheme = "t",
  Cheatsheet = "?",
  PopModal = "q",
}

export const appActions: Record<Keymap, () => void> = {
  [Keymap.PopModal]: () => {
    appState.modals.pop();
  },
  [Keymap.ToggleTheme]: () => {
    appState.theme = appState.theme === "dark" ? "light" : "dark";
    localStorage.setItem("vimnote_theme", JSON.stringify(appState.theme));
  },
  [Keymap.Cheatsheet]: () => {
    if (!appState.modals.includes(PluginModal.Cheatsheet)) {
      appState.modals.push(PluginModal.Cheatsheet);
    }
  },
};

export const handleKeyPress = (key: Keymap) => {
  if (Object.values(Keymap).includes(key)) {
    appActions[key]();
  }
};
