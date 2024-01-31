import { proxy } from "valtio";

export type Mode = "Normal" | "View" | "Insert";

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
  mode: "Normal",
  theme: (() => {
    const storedTheme = localStorage.getItem("vimnote_theme");
    if (storedTheme) {
      return JSON.parse(storedTheme);
    }

    if (
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    ) {
      return "dark";
    }

    return "light";
  })(),
  modals: [],
});

export const handleKeyPress = (key: string) => {
  Keymap[pluginState.mode].keys[key]?.action();
};

export type Action = "Navigation" | "Theme" | "Editing" | "Unknown";

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
  Normal: {
    name: "Normal",
    desc: "Normal mode description",
    keys: {
      i: {
        type: "Editing",
        desc: "Insert before the cursor",
        action: () => {
          pluginState.mode = "Insert";
        },
      },
      a: {
        type: "Editing",
        desc: "Insert after the cursor",
        action: () => {
          pluginState.mode = "Insert";
        },
      },
      o: {
        type: "Editing",
        desc: "Open a new line below",
        action: () => {
          pluginState.mode = "Insert";
        },
      },
      O: {
        type: "Editing",
        desc: "Open a new line above",
        action: () => {
          pluginState.mode = "Insert";
        },
      },
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
      q: {
        type: "Navigation",
        desc: "Close top-most modal",
        action: () => pluginState.modals.pop(),
      },
      v: {
        type: "Navigation",
        desc: "Switch to View mode",
        action: () => (pluginState.mode = "View"),
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
    },
  },
  View: {
    name: "View",
    desc: "View mode description",
    keys: {
      q: {
        type: "Navigation",
        desc: "Close top-most modal",
        action: () => pluginState.modals.pop(),
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
      Escape: {
        type: "Navigation",
        desc: "Switch to Normal mode",
        action: () => (pluginState.mode = "Normal"),
      },
    },
  },
  Insert: {
    name: "Insert",
    desc: "Insert mode description",
    keys: {
      Escape: {
        type: "Navigation",
        desc: "Switch to Normal mode",
        action: () => (pluginState.mode = "Normal"),
      },
    },
  },
};
