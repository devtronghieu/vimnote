import { proxy } from "valtio";
import { EditorState, Operator, PasteStyle } from "./editor/types";
import {
  insertText,
  InsertFunctionKeyHandlers,
  NormalKeyHandlers,
  ViewKeyHandlers,
  NormalOperatorHandlers,
} from "./editor";
import { isFunctionKey } from "@/utils/validate";

export interface VimState {
  editor: EditorState;
}

export const vimState = proxy<VimState>({
  editor: {
    content: [""],
    clipboard: [],
    operator: Operator.None,
    count: 0,
    pasteStyle: PasteStyle.Characterwise,
    cursor: { row: 0, col: 0 },
    mode: "Normal",
  },
});

export const vimActions = {
  type: (key: string) => {
    const { mode } = vimState.editor;

    if (mode === "Normal") {
      if (!isNaN(parseInt(key))) {
        vimState.editor.count = vimState.editor.count * 10 + parseInt(key);
      } else if (vimState.editor.operator !== Operator.None) {
        if (NormalOperatorHandlers[key]) {
          NormalOperatorHandlers[key](vimState.editor);
        }
        vimState.editor.operator = Operator.None;
        vimState.editor.count = 0;
      } else {
        NormalKeyHandlers[key] && NormalKeyHandlers[key](vimState.editor);
      }
      return;
    }

    if (mode === "Insert") {
      if (isFunctionKey(key)) {
        InsertFunctionKeyHandlers[key] &&
          InsertFunctionKeyHandlers[key](vimState.editor);
      } else {
        insertText(vimState.editor, key);
      }
      return;
    }

    if (mode === "View") {
      return ViewKeyHandlers[key] && ViewKeyHandlers[key](vimState.editor);
    }
  },
};
