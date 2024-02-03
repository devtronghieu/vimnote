import { handleKeyPress, vimState } from "@/state/vim";
import { throttle } from "@/utils";
import { useEffect, FC, ReactNode, useState, memo } from "react";
import Theme from "./Theme";
import Cheatsheet from "./Cheatsheet";
import FloatingKey from "./FloatingKey";
import FloatingMode from "./FloatingMode";

interface Props {
  children: ReactNode;
  className?: string;
}

const PluginProvider: FC<Props> = ({ children, className }) => {
  const [key, setKey] = useState<string>();

  useEffect(() => {
    const storedTheme = localStorage.getItem("vimnote_theme");
    if (storedTheme) {
      vimState.theme = JSON.parse(storedTheme);
    } else if (
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    ) {
      vimState.theme = "dark";
    }

    const onKeyPress = (e: KeyboardEvent) => {
      handleKeyPress(e.key);
      setKey(e.key !== " " ? e.key : "Space");
    };

    document.addEventListener("keydown", onKeyPress);

    return () => {
      document.removeEventListener("keydown", onKeyPress);
    };
  }, []);

  return (
    <MemoizedTheme className={className}>
      {children}
      <MemoizedCheatsheet />
      <MemoizedFloatingMode />
      <MemoizedFloatingKey keyName={key} />
    </MemoizedTheme>
  );
};

const MemoizedTheme = memo(Theme);
const MemoizedCheatsheet = memo(Cheatsheet);
const MemoizedFloatingMode = memo(FloatingMode);
const MemoizedFloatingKey = memo(FloatingKey);

export default PluginProvider;
