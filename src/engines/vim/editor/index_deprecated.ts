import { addStringAtIndex, removeCharAtIndex } from "@/utils/strings";
import { VimEditor, KeyHandler, Operator, PasteStyle } from ".";
import {
  getCurrentRow,
  getCurrentSegment,
  moveCursorDown,
  moveCursorLeft,
  moveCursorRight,
  moveCursorUp,
  setRow,
  setSegment,
} from "./actions";

export const NormalKeyHandlers: Record<string, KeyHandler> = {
  i: (state) => {
    state.mode = "Insert";
  },
  a: (state) => {
    state.mode = "Insert";
    moveCursorRight(state);
  },
  A: (state) => {
    state.mode = "Insert";
    state.cursor.col = getCurrentSegment(state).length;
  },
  o: (state) => {
    state.mode = "Insert";
    state.cursor.row++;
    state.cursor.col = 0;
    state.content.splice(state.cursor.row, 0, [""]);
  },
  O: (state) => {
    state.mode = "Insert";
    const row = getCurrentRow(state);
    setRow({
      state,
      row: state.cursor.row,
      segments: [""],
    });
    state.cursor.col = 0;
    state.content.splice(state.cursor.row + 1, 0, row);
  },
  p: (state) => {
    if (state.pasteStyle === PasteStyle.Characterwise) {
      // TODO: Handle paste char/word
    } else if (state.pasteStyle === PasteStyle.Linewise) {
      // TODO: Handle paste line
    } else if (state.pasteStyle === PasteStyle.Blockwise) {
      // TODO: Handle paste block
    }
  },
  $: (state) => {
    state.cursor.col = getCurrentSegment(state).length - 1;
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
  h: moveCursorLeft,
  l: moveCursorRight,
  k: moveCursorUp,
  j: moveCursorDown,
  Escape: (state) => {
    state.operator = Operator.None;
    state.count = 0;
  },
};

export const NormalOperatorHandlers: Record<string, KeyHandler> = {
  d: (state) => {
    if (state.operator !== Operator.Delete) return;
  },
  Escape: (state) => {
    state.operator = Operator.None;
    state.count = 0;
  },
};

export const InsertFunctionKeyHandlers: Record<string, KeyHandler> = {
  Escape: (state) => {
    state.mode = "Normal";
    moveCursorLeft(state);
  },
  Enter: (state) => {
    // TODO: Hanel this enter action
  },
  Backspace: (state) => {
    if (state.cursor.col > 0) {
      state.cursor.col--;
      setSegment(
        state,
        removeCharAtIndex(getCurrentSegment(state), state.cursor.col),
      );
    } else if (state.cursor.row > 0) {
      state.content.splice(state.cursor.row, 1);
      state.cursor.row--;
      state.cursor.col = getCurrentSegment(state).length;
    }
  },
  Delete: (state) => {
    setSegment(
      state,
      removeCharAtIndex(getCurrentSegment(state), state.cursor.col),
    );
  },
  ArrowLeft: moveCursorLeft,
  ArrowRight: moveCursorRight',
  ArrowUp: goUp,
  ArrowDown: goDown,
};

export const insert = (state: VimEditor, char: string) => {
  const wrappedIdx = Math.floor(state.cursor.col / state.maxCharsPerRow);
  if (state.content[state.cursor.row][wrappedIdx]) {
    addStringAtIndex({
      baseString: state.content[state.cursor.row][wrappedIdx],
      stringToAdd: char,
      index: state.cursor.col - wrappedIdx * state.maxCharsPerRow,
    });
  } else {
    state.content[state.cursor.row][wrappedIdx] = char;
    state.cursor.col++;
  }
};

export const ViewKeyHandlers: Record<string, KeyHandler> = {
  Escape: (state) => {
    state.mode = "Normal";
  },
};
