import { Mode } from "../internal";

interface CursorPosition {
  row: number;
  col: number;
}

export interface EditorState {
  content: string[];
  clipboard: string;
  cursor: CursorPosition;
  mode: Mode;
}

export type KeyHandler = (state: EditorState) => void;
