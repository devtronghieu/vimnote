import { addStringAtIndex, removeCharAtIndex } from "@/utils/strings";
import { Mode } from "../../internal";
import { KeyHandler, Operator, PasteStyle } from "../types";
import {
  findNextWord,
  findPrevWord,
  getCurrRow,
  getCurrSegment,
  getCurrSegmentLen,
  moveDown,
  moveLeft,
  moveRight,
  moveUp,
  setCurrSegment,
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
  x: (state) => {
    const currSegment = getCurrSegment(state);
    state.clipboard = [[currSegment[state.cursor.col]]];
    setCurrSegment(state, removeCharAtIndex(currSegment, state.cursor.col));
    if (state.cursor.col === getCurrSegmentLen(state)) {
      state.cursor.col--;
    }
  },
  p: (state) => {
    if (state.pasteStyle === PasteStyle.Characterwise) {
      setCurrSegment(
        state,
        addStringAtIndex({
          baseString: getCurrSegment(state),
          stringToAdd: state.clipboard[0][0],
          index: state.cursor.col + 1,
        }),
      );
      state.cursor.col += state.clipboard[0][0].length;
    } else if (state.pasteStyle === PasteStyle.Linewise) {
      state.content.splice(state.cursor.row + 1, 0, state.clipboard[0]);
      state.cursor = {
        row: state.cursor.row + 1,
        segment: 0,
        col: 0,
      };
    } else if (state.pasteStyle === PasteStyle.Blockwise) {
      state.content.splice(state.cursor.row + 1, 0, ...state.clipboard);
      state.cursor = {
        row: state.cursor.row + 1,
        segment: 0,
        col: 0,
      };
    }
  },
  P: (state) => {
    if (state.pasteStyle === PasteStyle.Characterwise) {
      setCurrSegment(
        state,
        addStringAtIndex({
          baseString: getCurrSegment(state),
          stringToAdd: state.clipboard[0][0],
          index: state.cursor.col,
        }),
      );
    } else if (state.pasteStyle === PasteStyle.Linewise) {
      state.content.splice(state.cursor.row, 0, state.clipboard[0]);
      state.cursor.segment = 0;
      state.cursor.col = 0;
    } else if (state.pasteStyle === PasteStyle.Blockwise) {
      state.clipboard.push(getCurrRow(state));
      state.content.splice(state.cursor.row, 1, ...state.clipboard);
      state.cursor = {
        row: state.cursor.row,
        segment: 0,
        col: 0,
      };
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
  b: (state) => {
    state.cursor = findPrevWord({
      state,
      startCursor: state.cursor,
    });
  },
  w: (state) => {
    state.cursor = findNextWord({
      state,
      startCursor: state.cursor,
    });
  },
  g: (state) => {
    state.operator = Operator.G;
  },
  G: (state) => {
    state.cursor.row = state.content.length - 1;
    state.cursor.segment = getCurrRow(state).length - 1;
    state.cursor.col = getCurrSegmentLen(state) - 1;
  },
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

export const NormalOperatorHandlers: Record<string, KeyHandler> = {
  d: (state) => {
    if (state.operator !== Operator.Delete) return;

    if (state.cursor.row > 0) {
      state.clipboard = state.content.splice(state.cursor.row, state.count);
      if (state.cursor.row === state.content.length) {
        state.cursor.row--;
      }
    } else {
      state.clipboard = state.content.splice(
        state.cursor.row + 1,
        state.count - 1,
      );
      state.clipboard.unshift(state.content[0]);

      if (state.content.length === 1) {
        state.content[0] = [""];
      } else {
        state.content.splice(0, 1);
      }
    }

    if (state.clipboard.length > 1) {
      state.pasteStyle = PasteStyle.Blockwise;
    } else {
      state.pasteStyle = PasteStyle.Linewise;
    }

    state.cursor = {
      row: state.cursor.row,
      segment: 0,
      col: 0,
    };
  },
  y: (state) => {
    if (state.operator !== Operator.Copy) return;

    state.clipboard = state.content.slice(state.cursor.row, state.count);

    if (state.clipboard.length > 1) {
      state.pasteStyle = PasteStyle.Blockwise;
    } else {
      state.pasteStyle = PasteStyle.Linewise;
    }
  },
  g: (state) => {
    state.cursor = {
      row: 0,
      segment: 0,
      col: 0,
    };
  },
  b: (state) => {
    for (let i = 0; i < state.count; i++) {
      state.cursor = findPrevWord({
        state,
        startCursor: state.cursor,
      });
    }
  },
  w: (state) => {
    for (let i = 0; i < state.count; i++) {
      state.cursor = findNextWord({
        state,
        startCursor: state.cursor,
      });
    }
  },
};
