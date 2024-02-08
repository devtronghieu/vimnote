import { Mode } from "../internal";

/**
 * A empty row is \[""\]
 */
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

export type KeyHandler = (editor: VimEditorState) => void;
