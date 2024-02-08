import { removeCharAtIndex } from "@/utils/strings";
import { KeyHandler } from "../types";
import {
  getCurrRow,
  getCurrSegment,
  getCurrSegmentLen,
  isContentEmpty,
  moveLeft,
  normalizeContentFromThisSegment,
  setCurrSegment,
} from "../utils";
import { Mode } from "../../internal";

export const InsertFunctionHandlers: Record<string, KeyHandler> = {
  Enter: (state) => {
    let remainingText = getCurrSegment(state).slice(state.cursor.col);
    remainingText += getCurrRow(state)
      .splice(state.cursor.segment + 1)
      .reduce((acc, cur) => acc + cur, "");

    setCurrSegment(state, getCurrSegment(state).slice(0, state.cursor.col));

    state.cursor.row++;
    state.cursor.segment = 0;
    state.cursor.col = 0;
    state.content.splice(state.cursor.row, 0, [remainingText]);

    normalizeContentFromThisSegment({
      state,
      row: state.cursor.row,
      segment: state.cursor.segment,
    });
  },
  Backspace: (state) => {
    if (state.cursor.col > 0) {
      state.cursor.col--;
      setCurrSegment(
        state,
        removeCharAtIndex(getCurrSegment(state), state.cursor.col),
      );
    } else if (state.cursor.segment > 0) {
      state.cursor.segment--;
      state.cursor.col = getCurrSegmentLen(state) - 1;
      setCurrSegment(
        state,
        removeCharAtIndex(getCurrSegment(state), state.cursor.col),
      );
    } else if (state.cursor.row > 0) {
      const remainingText = getCurrRow(state).reduce(
        (acc, cur) => acc + cur,
        "",
      );
      state.cursor.row--;
      state.cursor.segment = getCurrRow(state).length - 1;
      state.cursor.col = getCurrSegmentLen(state);
      setCurrSegment(state, getCurrSegment(state) + remainingText);
      state.content.splice(state.cursor.row + 1, 1);
    }

    if (!isContentEmpty(state)) {
      normalizeContentFromThisSegment({
        state,
        row: state.cursor.row,
        segment: state.cursor.segment,
      });
    }
  },
  Escape: (state) => {
    state.mode = Mode.Normal;
    moveLeft(state);
  },
};
