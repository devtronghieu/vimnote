import {
  addStringAtIndex,
  removeCharAtIndex,
  truncateOverflow,
} from "@/utils/strings";
import { Mode } from "../internal";

interface CursorPosition {
  row: number;
  col: number;
  segment: number;
}

export enum Operator {
  None,
  Delete,
  Copy,
}

export enum PasteStyle {
  Characterwise,
  Linewise,
  Blockwise,
}

export interface VimEditorState {
  content: string[][];
  clipboard: string[][];
  maxCharsPerRow: number;
  operator: Operator;
  count: number;
  pasteStyle: PasteStyle;
  cursor: CursorPosition;
  mode: Mode;
}

export function createVimEditorState(): VimEditorState {
  return {
    content: [[""]],
    clipboard: [],
    maxCharsPerRow: 0,
    operator: Operator.None,
    count: 0,
    pasteStyle: PasteStyle.Characterwise,
    cursor: { row: 0, col: 0, segment: 0 },
    mode: Mode.Normal,
  };
}

export function setMaxCharsPerRow(state: VimEditorState, max: number): void {
  state.maxCharsPerRow = max;
}

export function adjustCursorOnNewSegment(state: VimEditorState): void {
  const segmentLength = getCurrSegment(state).length;
  if (state.cursor.col >= segmentLength) {
    state.cursor.col =
      state.mode === Mode.Insert
        ? segmentLength
        : Math.max(segmentLength - 1, 0);
  }
}

export function getCurrRow(state: VimEditorState): string[] {
  return state.content[state.cursor.row];
}

export function countCurrSegments(state: VimEditorState): number {
  return state.content[state.cursor.row].length;
}

export function getCurrSegment(state: VimEditorState): string {
  return getCurrRow(state)[state.cursor.segment];
}

export function getCurrSegmentLen(state: VimEditorState): number {
  return getCurrRow(state)[state.cursor.segment].length;
}

export function setRow(
  state: VimEditorState,
  props: { row: number; segments: string[] },
): void {
  state.content[props.row] = props.segments;
}

export function setCurrSegment(state: VimEditorState, value: string): void {
  state.content[state.cursor.row][state.cursor.segment] = value;
}

export function moveLeft(state: VimEditorState): void {
  if (state.cursor.col > 0) {
    state.cursor.col--;
  }
}

export function moveRight(state: VimEditorState): void {
  const maxReach = getCurrSegmentLen(state);
  if (state.mode !== Mode.Insert) {
    state.cursor.col = Math.min(state.cursor.col + 1, maxReach - 1);
  } else {
    state.cursor.col = Math.min(state.cursor.col + 1, maxReach);
  }
}

export function moveUp(state: VimEditorState): void {
  if (state.cursor.segment > 0) {
    state.cursor.segment--;
    adjustCursorOnNewSegment(state);
  } else if (state.cursor.row > 0) {
    state.cursor.row--;
    state.cursor.segment = countCurrSegments(state) - 1;
    adjustCursorOnNewSegment(state);
  }
}

export function moveDown(state: VimEditorState): void {
  if (state.cursor.segment < countCurrSegments(state) - 1) {
    state.cursor.segment++;
    adjustCursorOnNewSegment(state);
  } else if (state.cursor.row < state.content.length - 1) {
    state.cursor.row++;
    state.cursor.segment = 0;
    adjustCursorOnNewSegment(state);
  }
}

interface NormalizeContentFromThisSegmentProps {
  state: VimEditorState;
  row: number;
  segment: number;
}
function normalizeContentFromThisSegment({
  state,
  row,
  segment,
}: NormalizeContentFromThisSegmentProps) {
  let remainingText = state.content[row]
    .splice(segment)
    .reduce((acc, cur) => acc + cur, "");

  const newSegments: string[] = [];
  for (
    let i = 0;
    i < Math.ceil(remainingText.length / state.maxCharsPerRow);
    i++
  ) {
    newSegments.push(
      remainingText.slice(
        i * state.maxCharsPerRow,
        (i + 1) * state.maxCharsPerRow,
      ),
    );
  }

  state.content[row] = [...state.content[row], ...newSegments];
}

export function insertAtCursor(state: VimEditorState, text: string): void {
  console.log("--> insert at", state.cursor, getCurrRow(state));
  setCurrSegment(
    state,
    addStringAtIndex({
      baseString: getCurrSegment(state),
      stringToAdd: text,
      index: state.cursor.col,
    }),
  );

  const isOverflowed = getCurrSegmentLen(state) >= state.maxCharsPerRow;

  if (isOverflowed) {
    normalizeContentFromThisSegment({
      state,
      row: state.cursor.row,
      segment: state.cursor.segment,
    });
  }

  if (state.cursor.col === state.maxCharsPerRow - 1) {
    state.cursor.segment++;
    state.cursor.col = 0;
    if (!getCurrRow(state)[state.cursor.segment]) {
      getCurrRow(state).push("");
    }
  } else {
    state.cursor.col++;
  }
}

type KeyHandler = (editor: VimEditorState) => void;

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

export const InsertFunctionHandlers: Record<string, KeyHandler> = {
  Backspace: (state) => {
    if (state.cursor.col > 0) {
      state.cursor.col--;
    } else if (state.cursor.row !== 0 || state.cursor.segment !== 0) {
      state.cursor.segment--;
      state.cursor.col = getCurrSegmentLen(state) - 1;
    }
    setCurrSegment(
      state,
      removeCharAtIndex(getCurrSegment(state), state.cursor.col),
    );
    normalizeContentFromThisSegment({
      state,
      row: state.cursor.row,
      segment: state.cursor.segment,
    });
  },
  Escape: (state) => {
    state.mode = Mode.Normal;
    moveLeft(state);
  },
};

export const ViewKeyHandlers: Record<string, KeyHandler> = {};
