import { pluginState } from "@/state/vim";
import { FC, ReactNode, useEffect } from "react";
import { useSnapshot } from "valtio";

interface Props {
  children: ReactNode;
  className?: string;
}

const Theme: FC<Props> = ({ children, className }) => {
  const themeSnap = useSnapshot(pluginState).theme;

  useEffect(() => {
    document.body.classList.remove("light", "dark");
    document.body.classList.add(themeSnap);
  }, [themeSnap]);

  return (
    <div
      className={`bg-white dark:bg-black text-black dark:text-white duration-500 transition-colors ease-in-out ${className}`}
    >
      {children}
    </div>
  );
};

export default Theme;
