import { proxy } from "valtio";
import {} from ".";
import { isFunctionKey } from "@/utils/validate";
import { Mode } from "./internal";
import { Operator, VimEditorState } from "./editor/types";
import {
  createVimEditorState,
  insertAtCursor,
  setMaxCharsPerRow,
} from "./editor/utils";
import {
  NormalKeyHandlers,
  NormalOperatorHandlers,
} from "./editor/modes/normal";
import { InsertFunctionHandlers } from "./editor/modes/insert";
import { ViewKeyHandlers } from "./editor/modes/view";

export const vimState = proxy<VimEditorState>(createVimEditorState());

export const vimActions = {
  type: (key: string) => {
    const { mode, count } = vimState;

    if (mode === Mode.Normal) {
      if (!isNaN(parseInt(key))) {
        vimState.count = count * 10 + parseInt(key);
        if (vimState.operator === Operator.None) {
          vimState.operator = Operator.Unknown;
        }
      } else if (vimState.operator !== Operator.None) {
        if (vimState.count === 0) {
          vimState.count = 1;
        }
        NormalOperatorHandlers[key] && NormalOperatorHandlers[key](vimState);
        vimState.operator = Operator.None;
        vimState.count = 0;
      } else {
        NormalKeyHandlers[key] && NormalKeyHandlers[key](vimState);
      }
      return;
    }

    if (mode === Mode.Insert) {
      if (isFunctionKey(key)) {
        InsertFunctionHandlers[key] && InsertFunctionHandlers[key](vimState);
      } else {
        insertAtCursor(vimState, key);
      }
      return;
    }

    if (mode === Mode.View) {
      ViewKeyHandlers[key] && ViewKeyHandlers[key](vimState);
      return;
    }
  },

  countSegmentsBeforeRow: (row: number) => {
    return vimState.content
      .slice(0, row)
      .reduce((acc, cur) => acc + cur.length, 0);
  },

  setMaxCharsPerRow: (max: number) => setMaxCharsPerRow(vimState, max),
};
