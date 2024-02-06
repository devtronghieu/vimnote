import { addStringAtIndex, removeCharAtIndex } from "@/utils/strings";
import { EditorState, KeyHandler } from "./types";
import {
  getCurrentLine,
  goDown,
  goLeft,
  goRight,
  goUp,
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
  $: (state) => {
    state.cursor.col = getCurrentLine(state).length - 1;
  },
  "^": (state) => {
    state.cursor.col = 0;
  },
  v: (state) => (state.mode = "View"),
  h: goLeft,
  l: goRight,
  k: goUp,
  j: goDown,
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
