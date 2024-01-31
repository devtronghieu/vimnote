import { proxy } from "valtio";

export type Theme = "light" | "dark";

export enum PluginModal {
  Cheatsheet,
}

export interface AppState {
  theme: Theme;
  modals: PluginModal[];
}

export const pluginState = proxy<AppState>({
  theme: (() => {
    const storedTheme = localStorage.getItem("vimnote_theme");
    if (storedTheme) {
      return JSON.parse(storedTheme);
    }
    return "dark";
  })(),
  modals: [],
});

export enum Keymap {
  ToggleTheme = "t",
  Cheatsheet = "?",
  PopModal = "q",
}

export const pluginActions: Record<Keymap, () => void> = {
  [Keymap.PopModal]: () => {
    pluginState.modals.pop();
  },
  [Keymap.ToggleTheme]: () => {
    pluginState.theme = pluginState.theme === "dark" ? "light" : "dark";
    localStorage.setItem("vimnote_theme", JSON.stringify(pluginState.theme));
  },
  [Keymap.Cheatsheet]: () => {
    if (!pluginState.modals.includes(PluginModal.Cheatsheet)) {
      pluginState.modals.push(PluginModal.Cheatsheet);
    }
  },
};

export const handleKeyPress = (key: Keymap) => {
  if (Object.values(Keymap).includes(key)) {
    pluginActions[key]();
  }
};
