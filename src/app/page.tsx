"use client";

import ThemeContainer from "@/components/Theme/ThemeContainer";
import ThemeSwitcher from "@/components/Theme/ThemeSwitcher";

export default function Home() {
  return (
    <ThemeContainer className="h-screen flex-center">
      <ThemeSwitcher />
    </ThemeContainer>
  );
}
