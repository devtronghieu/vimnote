import { proxy } from "valtio";
import {
  VimEditor,
  Operator,
  NormalOperatorHandlers,
  NormalKeyHandlers,
  InsertFunctionHandlers,
  ViewKeyHandlers,
} from "./editor";
import { isFunctionKey } from "@/utils/validate";
import { Mode } from "./internal";

export interface VimState {
  editor: VimEditor;
}

export const vimState = proxy<VimState>({
  editor: new VimEditor(),
});

export const vimActions = {
  type: (key: string) => {
    const { mode, count } = vimState.editor;

    console.log("--> pressed", key);

    if (mode === Mode.Normal) {
      if (!isNaN(parseInt(key))) {
        vimState.editor.count = count * 10 + parseInt(key);
      } else if (vimState.editor.operator !== Operator.None) {
        NormalOperatorHandlers[key] &&
          NormalOperatorHandlers[key](vimState.editor);
        vimState.editor.operator = Operator.None;
        vimState.editor.count = 0;
      } else {
        NormalKeyHandlers[key] && NormalKeyHandlers[key](vimState.editor);
      }
      return;
    }

    if (mode === Mode.Insert) {
      if (isFunctionKey(key)) {
        InsertFunctionHandlers[key] &&
          InsertFunctionHandlers[key](vimState.editor);
      } else {
        vimState.editor.insertAtCursor(key);
      }
      return;
    }

    if (mode === Mode.View) {
      ViewKeyHandlers[key] && ViewKeyHandlers[key](vimState.editor);
      return;
    }
  },
};
