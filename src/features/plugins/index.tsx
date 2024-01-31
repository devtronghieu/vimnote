import { handleKeyPress } from "@/state/vim";
import { throttle } from "@/utils";
import { useEffect, FC, ReactNode, useState, memo } from "react";
import Theme from "./Theme";
import Cheatsheet from "./Cheatsheet";
import FloatingKey from "./FloatingKey";

interface Props {
  children: ReactNode;
  className?: string;
}

const PluginProvider: FC<Props> = ({ children, className }) => {
  const [key, setKey] = useState<string>();

  useEffect(() => {
    const onKeyPress = throttle((e: KeyboardEvent) => {
      handleKeyPress(e.key);
      setKey(e.key);
    }, 200);

    document.addEventListener("keydown", onKeyPress);

    return () => {
      document.removeEventListener("keydown", onKeyPress);
    };
  }, []);

  return (
    <MemoizedTheme className={className}>
      {children}
      <MemoizedCheatsheet />
      <MemoizedFloatingKey keyName={key} />
    </MemoizedTheme>
  );
};

const MemoizedTheme = memo(Theme);
const MemoizedCheatsheet = memo(Cheatsheet);
const MemoizedFloatingKey = memo(FloatingKey);

export default PluginProvider;
