"use client";

import Key from "@/components/Key";
import VimEditor from "@/components/VimEditor";
import PluginProvider from "@/features/plugins";

export default function Home() {
  return (
    <PluginProvider className="h-screen flex-center gap-2">
      <h1 className="text-lg font-semibold">Hello, Vimnote</h1>
      <p>
        Press <Key name="?" /> to open Cheat sheet
      </p>
      <VimEditor className="w-96" />
    </PluginProvider>
  );
}
