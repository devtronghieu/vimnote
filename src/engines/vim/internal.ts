export enum Mode {
  Normal = "Normal",
  Insert = "Insert",
  View = "View",
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
