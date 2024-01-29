import { appState, handleKeyPress } from "@/state";
import { throttle } from "@/utils";
import { useEffect, type FC, type ReactNode } from "react";
import { useSnapshot } from "valtio";

interface Props {
  children: ReactNode;
  className?: string;
}

const RootWrapper: FC<Props> = ({ children, className }) => {
  const themeSnap = useSnapshot(appState).theme;

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
    document.body.classList.add(themeSnap);
  }, [themeSnap]);

  return (
    <div
      className={`dark:bg-black dark:text-white duration-500 transition-colors ease-in-out ${className}`}
    >
      {children}
    </div>
  );
};

export default RootWrapper;
