import { proxy } from "valtio";

export type Theme = "light" | "dark";

export enum PluginModal {
  Cheatsheet,
}

export interface AppState {
  theme: Theme;
  modals: Record<PluginModal, boolean>;
}

export const appState = proxy<AppState>({
  theme: "dark",
  modals: {
    [PluginModal.Cheatsheet]: false,
  },
});

export const appActions = {
  toggleTheme: () => {
    appState.theme = appState.theme === "dark" ? "light" : "dark";
    localStorage.setItem("vimnote_theme", JSON.stringify(appState.theme));
  },
  toggleCheatsheet: () => {
    appState.modals[PluginModal.Cheatsheet] =
      !appState.modals[PluginModal.Cheatsheet];
  },
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
      appActions.toggleCheatsheet();
      break;

    default:
      console.log("--> Unmapped key:", key);
      break;
  }
};
