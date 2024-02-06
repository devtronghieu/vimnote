import { proxy } from "valtio";
import { EditorState } from "./editor/types";
import {
  insertText,
  InsertFunctionKeyHandlers,
  NormalKeyHandlers,
  ViewKeyHandlers,
} from "./editor";
import { isFunctionKey } from "@/utils/validate";

export interface VimState {
  editor: EditorState;
}

export const vimState = proxy<VimState>({
  editor: {
    content: [""],
    clipboard: "",
    cursor: { row: 0, col: 0 },
    mode: "Normal",
  },
});

export const vimActions = {
  type: (key: string) => {
    const { mode } = vimState.editor;

    if (mode === "Normal") {
      return NormalKeyHandlers[key] && NormalKeyHandlers[key](vimState.editor);
    }

    if (mode === "Insert") {
      if (isFunctionKey(key)) {
        return (
          InsertFunctionKeyHandlers[key] &&
          InsertFunctionKeyHandlers[key](vimState.editor)
        );
      } else {
        return insertText(vimState.editor, key);
      }
    }

    if (mode === "View") {
      return ViewKeyHandlers[key] && ViewKeyHandlers[key](vimState.editor);
    }
  },
};
