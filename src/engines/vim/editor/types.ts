import { Mode } from "../internal";

/**
 * A empty row is \[""\]
 */
export interface CursorPosition {
  row: number;
  col: number;
  segment: number;
}

export enum Operator {
  None,
  Unknown,
  Delete,
  Copy,
  G, // operator starts with "g" (vim has not named it yet)
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

export type KeyHandler = (editor: VimEditorState) => void;
