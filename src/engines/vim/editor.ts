import { LinkedList, ListNode } from "@/utils/linkedlist";
import { isFunctionKey } from "@/utils/validate";
import { Mode } from "./internal";
import { addStringAtIndex, removeCharAtIndex } from "@/utils/strings";

interface CursorPosition {
  row: ListNode<string>;
  col: number;
}

export class VimEditor {
  content: LinkedList<string>;
  cursor: CursorPosition;
  mode: Mode;

  constructor() {
    this.content = new LinkedList<string>();
    this.content.append("");
    this.cursor = {
      row: this.content.head!,
      col: 0,
    };
    this.mode = "Normal";
  }

  type(key: string) {
    console.log("--> key pressed", key);
    if (this.mode === "Normal") {
      this.handleNormalModeKey(key);
    } else if (this.mode === "Insert") {
      this.handleInsertModeKey(key);
    } else if (this.mode === "View") {
      this.handleViewModeKey(key);
    }
  }

  private handleNormalModeKey(key: string) {
    switch (key) {
      case "a":
        this.mode = "Insert";
        break;
      case "v":
        this.mode = "View";
        break;
      default:
        break;
    }
  }

  private handleInsertModeKey(key: string) {
    if (isFunctionKey(key)) {
      switch (key) {
        case "Escape":
          this.mode = "Normal";
          break;
        case "Enter": {
          const temp = this.cursor.row.next;
          this.cursor.row.next = new ListNode("");
          this.cursor.row.next.next = temp;
          this.cursor.row = this.cursor.row.next;
          this.cursor.col = 0;
          break;
        }
        case "Backspace": {
          this.cursor.col--;
          this.cursor.row.value = removeCharAtIndex(
            this.cursor.row.value,
            this.cursor.col,
          );
          break;
        }
        case "Delete": {
          this.cursor.row.value = removeCharAtIndex(
            this.cursor.row.value,
            this.cursor.col,
          );
          break;
        }
        case "ArrowLeft":
          if (this.cursor.col > 0) {
            this.cursor.col--;
          }
          break;
        case "ArrowRight":
          if (this.cursor.col < this.cursor.row.value.length) {
            this.cursor.col++;
          }
          break;
        default:
          break;
      }
      if (key === "Escape") {
        this.mode = "Normal";
      }
    } else {
      this.cursor.row.value = addStringAtIndex({
        baseString: this.cursor.row.value,
        stringToAdd: key,
        index: this.cursor.col,
      });
      this.cursor.col++;
    }
  }

  private handleViewModeKey(key: string) {
    if (key === "Escape") {
      this.mode = "Normal";
    }
  }
}
