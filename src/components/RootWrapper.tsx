import { appActions } from "@/state";
import { useEffect, type FC, type ReactNode } from "react";

interface Props {
  children: ReactNode;
  className?: string;
}

const RootWrapper: FC<Props> = ({ children, className }) => {
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      switch (event.key) {
        case "t":
          appActions.toggleTheme();
          break;

        default:
          console.log("--> Unmapped key:", event.key);
          break;
      }
    };

    document.addEventListener("keydown", handleKeyPress);

    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, []);

  return (
    <div
      className={`dark:bg-black dark:text-white duration-500 transition-colors ease-in-out ${className}`}
    >
      {children}
    </div>
  );
};

export default RootWrapper;
