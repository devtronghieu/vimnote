import { handleKeyPress } from "@/state/vim";
import { throttle } from "@/utils";
import { useEffect, type FC, type ReactNode } from "react";
import Theme from "./Theme";
import Cheatsheet from "./Cheatsheet";

interface Props {
  children: ReactNode;
  className?: string;
}

const PluginProvider: FC<Props> = ({ children, className }) => {
  useEffect(() => {
    const onKeyPress = throttle((e: KeyboardEvent) => {
      handleKeyPress(e.key);
    }, 200);

    document.addEventListener("keydown", onKeyPress);

    return () => {
      document.removeEventListener("keydown", onKeyPress);
    };
  }, []);

  return (
    <Theme className={className}>
      {children}
      <Cheatsheet />
    </Theme>
  );
};

export default PluginProvider;
