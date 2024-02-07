import { addStringAtIndex, removeCharAtIndex } from "@/utils/strings";
import { EditorState, KeyHandler, Operator, PasteStyle } from "./types";
import {
  getCurrentLine,
  goDown,
  goLeft,
  goRight,
  goUp,
  placeColOnNewRow,
  setCurrentLine,
} from "./actions";

export const NormalKeyHandlers: Record<string, KeyHandler> = {
  i: (state) => {
    state.mode = "Insert";
  },
  a: (state) => {
    state.mode = "Insert";
    goRight(state);
  },
  A: (state) => {
    state.mode = "Insert";
    state.cursor.col = getCurrentLine(state).length;
  },
  o: (state) => {
    state.mode = "Insert";
    state.cursor.row++;
    state.cursor.col = 0;
    state.content.splice(state.cursor.row, 0, "");
  },
  O: (state) => {
    state.mode = "Insert";
    const line = getCurrentLine(state);
    setCurrentLine(state, "");
    state.cursor.col = 0;
    state.content.splice(state.cursor.row + 1, 0, line);
  },
  p: (state) => {
    if (state.pasteStyle === PasteStyle.Characterwise) {
      // TODO: Handle paste char/word
    } else if (state.pasteStyle === PasteStyle.Linewise) {
      state.cursor.row++;
      state.content.splice(state.cursor.row, 0, state.clipboard[0]);
    } else if (state.pasteStyle === PasteStyle.Blockwise) {
      state.content.splice(state.cursor.row + 1, 0, ...state.clipboard);
      state.cursor.row += state.clipboard.length;
    }
  },
  $: (state) => {
    state.cursor.col = getCurrentLine(state).length - 1;
  },
  "^": (state) => {
    state.cursor.col = 0;
  },
  d: (state) => {
    state.operator = Operator.Delete;
  },
  y: (state) => {
    state.operator = Operator.Copy;
  },
  v: (state) => (state.mode = "View"),
  h: goLeft,
  l: goRight,
  k: goUp,
  j: goDown,
  Escape: (state) => {
    state.operator = Operator.None;
    state.count = 0;
  },
};

export const NormalOperatorHandlers: Record<string, KeyHandler> = {
  d: (state) => {
    if (state.operator !== Operator.Delete) return;

    state.clipboard = [];

    let maxReach = state.cursor.row + (state.count || 1);
    if (maxReach > state.content.length - 1) {
      maxReach = state.content.length;
    }

    for (let i = state.cursor.row; i < maxReach; i++) {
      state.clipboard.push(state.content[i]);
    }

    let linesToSplice = maxReach - state.cursor.row;
    if (linesToSplice === 0) {
      linesToSplice = 1;
    }
    if (state.cursor.row === 0 && linesToSplice >= state.content.length) {
      state.content.push("");
    }

    state.content.splice(state.cursor.row, linesToSplice);

    if (state.cursor.row > state.content.length - 1) {
      state.cursor.row = state.content.length - 1;
    }

    placeColOnNewRow(state);

    state.pasteStyle =
      state.clipboard.length > 1 ? PasteStyle.Blockwise : PasteStyle.Linewise;
  },
  Escape: (state) => {
    state.operator = Operator.None;
    state.count = 0;
  },
};

export const InsertFunctionKeyHandlers: Record<string, KeyHandler> = {
  Escape: (state) => {
    state.mode = "Normal";
    goLeft(state);
  },
  Enter: (state) => {
    const breakContent = getCurrentLine(state).slice(state.cursor.col);
    setCurrentLine(state, getCurrentLine(state).slice(0, state.cursor.col));
    state.cursor.row++;
    state.cursor.col = 0;
    state.content.splice(state.cursor.row, 0, breakContent);
  },
  Backspace: (state) => {
    if (state.cursor.col > 0) {
      state.cursor.col--;
      setCurrentLine(
        state,
        removeCharAtIndex(getCurrentLine(state), state.cursor.col),
      );
    } else if (state.cursor.row > 0) {
      state.content.splice(state.cursor.row, 1);
      state.cursor.row--;
      state.cursor.col = getCurrentLine(state).length;
    }
  },
  Delete: (state) => {
    setCurrentLine(
      state,
      removeCharAtIndex(getCurrentLine(state), state.cursor.col),
    );
  },
  ArrowLeft: goLeft,
  ArrowRight: goRight,
  ArrowUp: goUp,
  ArrowDown: goDown,
};

export const insertText = (state: EditorState, text: string) => {
  setCurrentLine(
    state,
    addStringAtIndex({
      baseString: getCurrentLine(state),
      stringToAdd: text,
      index: state.cursor.col,
    }),
  );
  state.cursor.col++;
};

export const ViewKeyHandlers: Record<string, KeyHandler> = {
  Escape: (state) => {
    state.mode = "Normal";
  },
};
