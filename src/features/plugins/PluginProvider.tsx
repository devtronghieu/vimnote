import { appState, handleKeyPress } from "@/state";
import { throttle } from "@/utils";
import { useEffect, type FC, type ReactNode } from "react";
import { useSnapshot } from "valtio";

interface Props {
  children: ReactNode;
  className?: string;
}

const PluginProvider: FC<Props> = ({ children, className }) => {
  const snap = useSnapshot(appState);

  useEffect(() => {
    const onKeyPress = throttle((e: KeyboardEvent) => {
      handleKeyPress(e.key);
    }, 200);

    document.addEventListener("keydown", onKeyPress);

    return () => {
      document.removeEventListener("keydown", onKeyPress);
    };
  }, []);

  useEffect(() => {
    document.body.classList.remove("light", "dark");
    document.body.classList.add(snap.theme);
  }, [snap.theme]);

  return (
    <div
      className={`dark:bg-black dark:text-white duration-500 transition-colors ease-in-out ${className}`}
    >
      {children}
    </div>
  );
};

export default PluginProvider;
