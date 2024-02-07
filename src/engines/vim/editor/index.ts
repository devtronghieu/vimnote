import { addStringAtIndex } from "@/utils/strings";
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

export class VimEditor {
  content: string[][] = [[""]];
  clipboard: string[][] = [];
  maxCharsPerRow: number = 0;
  operator: Operator = 0;
  count: number = 0;
  pasteStyle: PasteStyle = PasteStyle.Characterwise;
  cursor: CursorPosition = { row: 0, col: 0, segment: 0 };
  mode: Mode = Mode.Normal;

  setMaxCharsPerRow(max: number): void {
    this.maxCharsPerRow = max;
  }

  adjustCursorOnNewSegment(): void {
    const segmentLength = this.getCurrSegment().length;
    if (this.cursor.col >= segmentLength) {
      this.cursor.col =
        this.mode === Mode.Insert
          ? segmentLength
          : Math.max(segmentLength - 1, 0);
    }
  }

  getCurrRow(): string[] {
    return this.content[this.cursor.row];
  }

  getCurrRowLen(): number {
    return this.content[this.cursor.row].length;
  }

  getCurrSegment(): string {
    return this.getCurrRow()[this.cursor.segment];
  }

  getCurrSegmentLen(): number {
    return this.getCurrRow()[this.cursor.segment].length;
  }

  setRow(props: { row: number; segments: string[] }): void {
    this.content[props.row] = props.segments;
  }

  setCurrSegment(value: string): void {
    this.content[this.cursor.row][this.cursor.segment] = value;
  }

  moveLeft(): void {
    if (this.getCurrSegmentLen() > 0) {
      this.cursor.col--;
    }
  }

  moveRight(): void {
    let maxReach = this.getCurrSegmentLen();
    if (this.mode !== Mode.Insert) {
      maxReach--;
    }
    if (this.cursor.col < maxReach) {
      this.cursor.col++;
    }
  }

  moveUp(): void {
    if (this.cursor.segment > 0) {
      this.cursor.segment--;
      this.adjustCursorOnNewSegment();
    } else if (this.cursor.row > 0) {
      this.cursor.row--;
      this.adjustCursorOnNewSegment();
    }
  }

  moveDown(): void {
    if (this.cursor.segment < this.getCurrSegment().length - 1) {
      this.cursor.segment++;
      this.adjustCursorOnNewSegment();
    } else if (this.cursor.row < this.content.length - 1) {
      this.cursor.row++;
      this.adjustCursorOnNewSegment();
    }
  }

  insertAtCursor(text: string): void {
    this.setCurrSegment(
      addStringAtIndex({
        baseString: this.getCurrSegment(),
        stringToAdd: text,
        index: this.cursor.col,
      }),
    );

    this.cursor.col++;

    const currRow = this.getCurrRow();
    let segment = this.cursor.segment;
    if (currRow[segment].length > this.maxCharsPerRow) {
      const overflowText = currRow[segment].slice(this.maxCharsPerRow);
      segment++;
      if (currRow[segment]) {
        currRow[segment] = overflowText + currRow[segment];
      } else {
        currRow.push(overflowText);
      }
    }
  }
}

type KeyHandler = (editor: VimEditor) => void;

export const NormalKeyHandlers: Record<string, KeyHandler> = {
  i: (editor) => {
    editor.mode = Mode.Insert;
  },
  a: (editor) => {
    editor.mode = Mode.Insert;
    editor.moveRight();
    console.log("--> appended", editor.mode);
  },
  A: (editor) => {
    editor.mode = Mode.Insert;
    editor.cursor.col = editor.getCurrSegmentLen();
  },
  o: (editor) => {
    editor.mode = Mode.Insert;
    editor.cursor.row++;
    editor.cursor.segment = 0;
    editor.cursor.col = 0;
    editor.content.splice(editor.cursor.row, 0, [""]);
  },
  O: (editor) => {
    editor.mode = Mode.Insert;
    const row = editor.getCurrRow();
    editor.setRow({
      row: editor.cursor.row,
      segments: [""],
    });
    editor.cursor.segment = 0;
    editor.cursor.col = 0;
    editor.content.splice(editor.cursor.row + 1, 0, row);
  },
  p: (editor) => {
    if (editor.pasteStyle === PasteStyle.Characterwise) {
      // TODO: Handle paste char/word
    } else if (editor.pasteStyle === PasteStyle.Linewise) {
      // TODO: Handle paste line
    } else if (editor.pasteStyle === PasteStyle.Blockwise) {
      // TODO: Handle paste block
    }
  },
  $: (editor) => {
    editor.cursor.col = editor.getCurrSegmentLen() - 1;
  },
  "^": (editor) => {
    editor.cursor.col = 0;
  },
  h: (editor) => editor.moveLeft,
  l: (editor) => editor.moveRight,
  k: (editor) => editor.moveUp,
  j: (editor) => editor.moveDown,
  d: (editor) => {
    editor.operator = Operator.Delete;
  },
  y: (editor) => {
    editor.operator = Operator.Copy;
  },
  Escape: (editor) => {
    editor.operator = Operator.None;
    editor.count = 0;
  },
};

export const NormalOperatorHandlers: Record<string, KeyHandler> = {};

export const InsertFunctionHandlers: Record<string, KeyHandler> = {};

export const ViewKeyHandlers: Record<string, KeyHandler> = {};
