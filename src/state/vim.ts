import { proxy } from "valtio";

export type Mode = "Normal" | "View" | "Insert";

export type Theme = "light" | "dark";

export enum PluginModal {
  Cheatsheet,
}

export interface VimState {
  mode: Mode;
  theme: Theme;
  modals: PluginModal[];
}

export const vimState = proxy<VimState>({
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
  Keymap[vimState.mode].keys[key]?.action();
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
          vimState.mode = "Insert";
        },
      },
      a: {
        type: "Editing",
        desc: "Insert after the cursor",
        action: () => {
          vimState.mode = "Insert";
        },
      },
      o: {
        type: "Editing",
        desc: "Open a new line below",
        action: () => {
          vimState.mode = "Insert";
        },
      },
      O: {
        type: "Editing",
        desc: "Open a new line above",
        action: () => {
          vimState.mode = "Insert";
        },
      },
      t: {
        type: "Theme",
        desc: "Toggle theme (Light | Dark)",
        action: () => {
          vimState.theme = vimState.theme === "dark" ? "light" : "dark";
          localStorage.setItem("vimnote_theme", JSON.stringify(vimState.theme));
        },
      },
      q: {
        type: "Navigation",
        desc: "Close top-most modal",
        action: () => vimState.modals.pop(),
      },
      v: {
        type: "Navigation",
        desc: "Switch to View mode",
        action: () => (vimState.mode = "View"),
      },
      "?": {
        type: "Unknown",
        desc: "Open Cheat sheet",
        action: () => {
          if (!vimState.modals.includes(PluginModal.Cheatsheet)) {
            vimState.modals.push(PluginModal.Cheatsheet);
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
        action: () => vimState.modals.pop(),
      },
      "?": {
        type: "Unknown",
        desc: "Open Cheat sheet",
        action: () => {
          if (!vimState.modals.includes(PluginModal.Cheatsheet)) {
            vimState.modals.push(PluginModal.Cheatsheet);
          }
        },
      },
      Escape: {
        type: "Navigation",
        desc: "Switch to Normal mode",
        action: () => (vimState.mode = "Normal"),
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
        action: () => (vimState.mode = "Normal"),
      },
    },
  },
};
