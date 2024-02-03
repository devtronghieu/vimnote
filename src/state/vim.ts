import { proxy } from "valtio";

export type Mode = "Normal" | "View" | "Insert";

export type Theme = "light" | "dark";

export enum PluginModal {
  Cheatsheet,
}

export type LineNumber = number;
export type LineExpand = number;
export type LineMap = Map<LineNumber, LineExpand>;

export interface VimState {
  mode: Mode;
  theme: Theme;
  editor: {
    content: string;
    totalCols: number;
    charSize: {
      charWidth: number;
      charHeight: number;
    };
    caretPosition: {
      start: number;
      end: number;
    };
    lineMap: LineMap;
  };
  modals: PluginModal[];
}

export const vimState = proxy<VimState>({
  mode: "Normal",
  theme: "light",
  editor: {
    content: "",
    totalCols: 20,
    charSize: { charWidth: 0, charHeight: 0 },
    caretPosition: { start: 0, end: 0 },
    lineMap: new Map<LineNumber, LineExpand>(),
  },
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
      h: {
        type: "Navigation",
        desc: "Move cursor left",
        action: () => {
          const newStart = vimState.editor.caretPosition.start - 1;
          if (newStart >= 0) {
            vimState.editor.caretPosition.start = newStart;
          }
        },
      },
      j: {
        type: "Navigation",
        desc: "Move cursor down",
        action: () => {
          const newStart =
            vimState.editor.caretPosition.start + vimState.editor.totalCols;
          if (newStart < vimState.editor.content.length) {
            vimState.editor.caretPosition.start = newStart;
          }
        },
      },
      k: {
        type: "Navigation",
        desc: "Move cursor up",
        action: () => {
          const newStart =
            vimState.editor.caretPosition.start - vimState.editor.totalCols;
          if (newStart >= 0) {
            vimState.editor.caretPosition.start = newStart;
          }
        },
      },
      l: {
        type: "Navigation",
        desc: "Move cursor right",
        action: () => {
          const newStart = vimState.editor.caretPosition.start + 1;
          if (newStart < vimState.editor.content.length) {
            vimState.editor.caretPosition.start = newStart;
          }
        },
      },
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
        action: () => {
          vimState.mode = "Normal";
          Keymap.Normal.keys["h"].action();
        },
      },
    },
  },
};
