import { addStringAtIndex, isPunctuation } from "@/utils/strings";
import { Mode } from "../internal";
import { CursorPosition, Operator, PasteStyle, VimEditorState } from "./types";

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

interface FindWordProps {
  state: VimEditorState;
  startCursor: CursorPosition;
  treatPuncAsWord?: boolean;
}
// TODO: take time to refactor this func
export function findNextWord({
  state,
  startCursor,
  treatPuncAsWord = true,
}: FindWordProps): CursorPosition {
  const rowContent = state.content[startCursor.row].join("");
  let nextWordIndex =
    startCursor.segment * state.maxCharsPerRow + startCursor.col + 1;

  while (
    rowContent[nextWordIndex] !== " " &&
    nextWordIndex < rowContent.length
  ) {
    if (treatPuncAsWord && isPunctuation(rowContent[nextWordIndex])) {
      return {
        row: startCursor.row,
        segment: Math.floor(nextWordIndex / state.maxCharsPerRow),
        col: nextWordIndex % state.maxCharsPerRow,
      };
    } else {
      nextWordIndex++;
    }
  }

  while (rowContent[nextWordIndex] === " ") {
    nextWordIndex++;
  }

  if (nextWordIndex === -1 || nextWordIndex >= rowContent.length) {
    if (state.cursor.row < state.content.length - 1) {
      return {
        row: state.cursor.row + 1,
        segment: 0,
        col: 0,
      };
    } else return startCursor;
  } else {
    return {
      row: startCursor.row,
      segment: Math.floor(nextWordIndex / state.maxCharsPerRow),
      col: nextWordIndex % state.maxCharsPerRow,
    };
  }
}

export const findPrevWord = ({
  state,
  startCursor,
  treatPuncAsWord = true,
}: FindWordProps): CursorPosition => {
  if (startCursor.col === 0 && startCursor.segment === 0) {
    if (startCursor.row === 0) {
      return startCursor;
    } else {
      startCursor.row--;
      startCursor.segment = state.content[startCursor.row].length - 1;
      startCursor.col =
        state.content[startCursor.row][startCursor.segment].length - 1;
    }
  }

  let rowContent = state.content[startCursor.row].join("");
  let nextWordIndex =
    startCursor.segment * state.maxCharsPerRow + startCursor.col - 1;

  while (rowContent[nextWordIndex] === " " && nextWordIndex > 0) {
    nextWordIndex--;
  }

  while (rowContent[nextWordIndex] !== " ") {
    if (treatPuncAsWord && isPunctuation(rowContent[nextWordIndex])) {
      return {
        row: startCursor.row,
        segment: Math.floor(nextWordIndex / state.maxCharsPerRow),
        col: nextWordIndex % state.maxCharsPerRow,
      };
    }

    if (nextWordIndex > 0) {
      nextWordIndex--;
    } else {
      return {
        row: startCursor.row,
        segment: 0,
        col: 0,
      };
    }
  }

  return {
    row: startCursor.row,
    segment: Math.floor(nextWordIndex / state.maxCharsPerRow),
    col: (nextWordIndex % state.maxCharsPerRow) + 1,
  };
};

export function isContentEmpty(state: VimEditorState) {
  if (state.content.length > 1) {
    return false;
  }

  if (state.content[0].length > 1) {
    return false;
  }

  if (state.content[0][0].length > 0) {
    return false;
  }

  return true;
}

export function isEndOfFile(state: VimEditorState, cursor: CursorPosition) {
  if (cursor.row !== state.content.length - 1) {
    return false;
  }

  if (cursor.segment !== state.content[cursor.row].length - 1) {
    return false;
  }

  if (cursor.col !== state.content[cursor.row][cursor.segment].length - 1) {
    return false;
  }

  return true;
}

interface NormalizeContentFromThisSegmentProps {
  state: VimEditorState;
  row: number;
  segment: number;
}
export function normalizeContentFromThisSegment({
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

  if (state.content[row].length === 0) {
    state.content[row] = [""];
  }
}

export function insertAtCursor(state: VimEditorState, text: string): void {
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
