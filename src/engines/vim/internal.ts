import { LinkedList, ListNode } from "@/utils/linkedlist";
import { isFunctionKey } from "@/utils/validate";

export enum Mode {
  Normal,
  Insert,
  View,
}

export interface KeymapDetail {
  desc: string;
  action: () => any;
}

export interface Plugin {
  name: string;
  desc: string;
  keymaps: Map<Mode, Map<string, KeymapDetail>>;
}

interface CursorPosition {
  row: ListNode<string>;
  col: number;
}

export class VimEditor {
  content: LinkedList<string>;
  cursor: CursorPosition;

  constructor() {
    this.content = new LinkedList<string>();
    this.content.append("");
    this.cursor = {
      row: this.content.head!,
      col: 0,
    };
  }

  type(key: string) {
    if (isFunctionKey(key)) {
      this.handleFunctionKey(key);
    } else {
      this.cursor.row.value += key;
      this.cursor.col++;
    }
  }

  private handleFunctionKey(key: string) {
    // TODO: handle function key such as Backspace, Delete, Enter, etc.
    console.log("--> Function key pressed", key);
  }
}
