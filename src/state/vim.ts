import { proxy } from "valtio";

export enum Mode {
  Normal,
  Insert,
  View,
}

export type Theme = "light" | "dark";

export enum PluginModal {
  Cheatsheet,
}

export interface AppState {
  mode: Mode;
  theme: Theme;
  modals: PluginModal[];
}

export const pluginState = proxy<AppState>({
  mode: Mode.Normal,
  theme: (() => {
    const storedTheme = localStorage.getItem("vimnote_theme");
    if (storedTheme) {
      return JSON.parse(storedTheme);
    }
    return "dark";
  })(),
  modals: [],
});

export const handleKeyPress = (key: string) => {
  Keymap[pluginState.mode].keys[key]?.action();
};

export type Action = "Navigation" | "Theme" | "Unknown";

export interface KeymapDetail {
  type: Action;
  desc: string;
  action: () => any;
}

export interface ModeDetail {
  name: string;
  desc: string;
  keys: Record<string, KeymapDetail>;
}

export const Keymap: Record<Mode, ModeDetail> = {
  [Mode.Normal]: {
    name: "Normal",
    desc: "Normal mode description",
    keys: {
      t: {
        type: "Theme",
        desc: "Toggle theme (Light | Dark)",
        action: () => {
          pluginState.theme = pluginState.theme === "dark" ? "light" : "dark";
          localStorage.setItem(
            "vimnote_theme",
            JSON.stringify(pluginState.theme),
          );
        },
      },
      "?": {
        type: "Unknown",
        desc: "Open Cheat sheet",
        action: () => {
          if (!pluginState.modals.includes(PluginModal.Cheatsheet)) {
            pluginState.modals.push(PluginModal.Cheatsheet);
          }
        },
      },
      q: {
        type: "Unknown",
        desc: "Close top-most modal",
        action: () => {
          pluginState.modals.pop();
        },
      },
    },
  },
  [Mode.View]: {
    name: "View",
    desc: "View mode description",
    keys: {},
  },
  [Mode.Insert]: {
    name: "Insert",
    desc: "Insert mode description",
    keys: {},
  },
};
