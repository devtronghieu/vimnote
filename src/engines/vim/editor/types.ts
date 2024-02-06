import { Mode } from "../internal";

interface CursorPosition {
  row: number;
  col: number;
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

export interface EditorState {
  content: string[];
  clipboard: string[];
  operator: Operator;
  count: number;
  pasteStyle: PasteStyle;
  cursor: CursorPosition;
  mode: Mode;
}

export type KeyHandler = (state: EditorState) => void;
