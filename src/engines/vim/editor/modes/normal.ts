import { Mode } from "../../internal";
import { KeyHandler, Operator, PasteStyle } from "../types";
import {
  getCurrRow,
  getCurrSegmentLen,
  moveDown,
  moveLeft,
  moveRight,
  moveUp,
  setRow,
} from "../utils";

export const NormalKeyHandlers: Record<string, KeyHandler> = {
  i: (state) => {
    state.mode = Mode.Insert;
  },
  a: (state) => {
    state.mode = Mode.Insert;
    moveRight(state);
  },
  A: (state) => {
    state.mode = Mode.Insert;
    state.cursor.col = getCurrSegmentLen(state);
  },
  o: (state) => {
    state.mode = Mode.Insert;
    state.cursor.row++;
    state.cursor.segment = 0;
    state.cursor.col = 0;
    state.content.splice(state.cursor.row, 0, [""]);
  },
  O: (state) => {
    state.mode = Mode.Insert;
    const row = getCurrRow(state);
    setRow(state, {
      row: state.cursor.row,
      segments: [""],
    });
    state.cursor.segment = 0;
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
    state.cursor.col = getCurrSegmentLen(state) - 1;
  },
  "^": (state) => {
    state.cursor.col = 0;
  },
  h: (state) => moveLeft(state),
  l: (state) => moveRight(state),
  k: (state) => moveUp(state),
  j: (state) => moveDown(state),
  d: (state) => {
    state.operator = Operator.Delete;
  },
  y: (state) => {
    state.operator = Operator.Copy;
  },
  Escape: (state) => {
    state.operator = Operator.None;
    state.count = 0;
  },
};

export const NormalOperatorHandlers: Record<string, KeyHandler> = {};
