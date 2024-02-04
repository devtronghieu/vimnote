import { proxy } from "valtio";
import { VimEditor } from "./editor";

export interface VimState {
  editor: VimEditor;
}

export const vimState = proxy<VimState>({
  editor: new VimEditor(),
});
