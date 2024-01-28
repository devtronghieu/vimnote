"use client";

import RootWrapper from "@/components/RootWrapper";
import ThemeSwitcher from "@/components/ThemeSwitcher";

export default function Home() {
  return (
    <RootWrapper className="h-screen flex-center">
      <ThemeSwitcher />
    </RootWrapper>
  );
}
