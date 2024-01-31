"use client";

import Key from "@/components/Key";
import PluginProvider from "@/features/plugins";
import { pluginState } from "@/state/vim";
import { useSnapshot } from "valtio";

export default function Home() {
  const snap = useSnapshot(pluginState);

  return (
    <PluginProvider className="h-screen flex-center gap-2">
      <h1 className="text-lg font-semibold">Hello, Vimnote</h1>
      <p>
        Press <Key name="?" /> to open Cheat sheet
      </p>
      <p>Mode: {snap.mode}</p>
    </PluginProvider>
  );
}
