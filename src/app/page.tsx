"use client";

import Key from "@/components/Key";
import RootWrapper from "@/components/RootWrapper";

export default function Home() {
  return (
    <RootWrapper className="h-screen flex-center gap-2">
      <h1 className="text-lg font-semibold">Hello, Vimnote</h1>
      <p>
        Press <Key name="?" /> to toggle Cheat sheet
      </p>
    </RootWrapper>
  );
}
