import { EditorState } from "./types";

export const getCurrentLine = (state: EditorState) =>
  state.content[state.cursor.row];

export const setCurrentLine = (state: EditorState, value: string) => {
  state.content[state.cursor.row] = value;
  return state;
};

export const placeColOnNewRow = (state: EditorState) => {
  const lineLength = getCurrentLine(state).length;
  if (state.cursor.col >= lineLength) {
    if (lineLength === 0) {
      state.cursor.col = 0;
    } else {
      state.cursor.col = state.mode === "Insert" ? lineLength : lineLength - 1;
    }
  }
  return state;
};

export const goLeft = (state: EditorState) => {
  if (state.cursor.col > 0) {
    state.cursor.col--;
  }
  return state;
};

export const goRight = (state: EditorState) => {
  let maxReach = getCurrentLine(state).length;

  if (state.mode !== "Insert") {
    maxReach--;
  }

  if (state.cursor.col < maxReach) {
    state.cursor.col++;
  }
  return state;
};

export const goUp = (state: EditorState) => {
  if (state.cursor.row > 0) {
    state.cursor.row--;
    placeColOnNewRow(state);
  }
  return state;
};

export const goDown = (state: EditorState) => {
  if (state.cursor.row < state.content.length - 1) {
    state.cursor.row++;
    placeColOnNewRow(state);
  }
  return state;
};
