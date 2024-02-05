import { isFunctionKey } from "@/utils/validate";
import { Mode } from "./internal";
import { addStringAtIndex, removeCharAtIndex } from "@/utils/strings";

interface CursorPosition {
  row: number;
  col: number;
}

export class VimEditor {
  content: string[];
  clipboard: string;
  cursor: CursorPosition;
  mode: Mode;

  constructor() {
    this.content = [];
    this.content.push("");
    this.clipboard = "";
    this.cursor = {
      row: 0,
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

  getCurrentLine() {
    return this.content[this.cursor.row];
  }

  setCurrentLine(value: string) {
    this.content[this.cursor.row] = value;
  }

  private handleNormalModeKey(key: string) {
    switch (key) {
      case "i": {
        this.mode = "Insert";
        break;
      }
      case "a": {
        this.mode = "Insert";
        this.goRight();
        break;
      }
      case "o": {
        this.mode = "Insert";
        this.cursor.row++;
        this.cursor.col = 0;
        this.content.splice(this.cursor.row, 0, "");
        break;
      }
      case "O": {
        this.mode = "Insert";
        const line = this.getCurrentLine();
        this.setCurrentLine("");
        this.cursor.col = 0;
        this.content.splice(this.cursor.row + 1, 0, line);
        break;
      }
      case "v":
        this.mode = "View";
        break;
      case "h":
        this.goLeft();
        break;
      case "l":
        this.goRight();
        break;
      case "k":
        this.goUp();
        break;
      case "j":
        this.goDown();
        break;
      default:
        break;
    }
  }

  private handleInsertModeKey(key: string) {
    if (isFunctionKey(key)) {
      switch (key) {
        case "Escape": {
          this.mode = "Normal";
          this.goLeft();
          break;
        }
        case "Enter": {
          const breakContent = this.getCurrentLine().slice(this.cursor.col);
          this.setCurrentLine(this.getCurrentLine().slice(0, this.cursor.col));
          this.cursor.row++;
          this.cursor.col = 0;
          this.content.splice(this.cursor.row, 0, breakContent);
          break;
        }
        case "Backspace": {
          if (this.cursor.col > 0) {
            this.cursor.col--;
            this.setCurrentLine(
              removeCharAtIndex(this.getCurrentLine(), this.cursor.col),
            );
          }
          break;
        }
        case "Delete": {
          this.setCurrentLine(
            removeCharAtIndex(this.getCurrentLine(), this.cursor.col),
          );
          break;
        }
        case "ArrowLeft":
          this.goLeft();
          break;
        case "ArrowRight":
          this.goRight();
          break;
        case "ArrowUp":
          this.goUp();
          break;
        case "ArrowDown":
          this.goDown();
          break;
        default:
          break;
      }
    } else {
      this.setCurrentLine(
        addStringAtIndex({
          baseString: this.getCurrentLine(),
          stringToAdd: key,
          index: this.cursor.col,
        }),
      );
      this.cursor.col++;
    }
  }

  private handleViewModeKey(key: string) {
    if (key === "Escape") {
      this.mode = "Normal";
    }
  }

  /* Navigation */
  private goLeft() {
    if (this.cursor.col > 0) {
      this.cursor.col--;
    }
  }

  private goRight() {
    let maxReach = this.getCurrentLine().length;

    if (this.mode !== "Insert") {
      maxReach--;
    }

    if (this.cursor.col < maxReach) {
      this.cursor.col++;
    }
  }

  private goUp() {
    if (this.cursor.row > 0) {
      this.cursor.row--;
      this.switchLine();
    }
  }

  private goDown() {
    if (this.cursor.row < this.content.length - 1) {
      this.cursor.row++;
      this.switchLine();
    }
  }

  private switchLine() {
    const lineLength = this.getCurrentLine().length;
    if (this.cursor.col >= lineLength) {
      if (lineLength === 0) {
        this.cursor.col = 0;
      } else {
        this.cursor.col = this.mode === "Insert" ? lineLength : lineLength - 1;
      }
    }
  }
}
