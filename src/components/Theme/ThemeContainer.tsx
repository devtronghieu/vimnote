import type { FC, ReactNode } from "react";

interface Props {
  children: ReactNode;
  className?: string;
}

const ThemeContainer: FC<Props> = ({ children, className }) => {
  return (
    <div
      className={`dark:bg-black dark:text-white duration-500 transition-colors ease-in-out ${className}`}
    >
      {children}
    </div>
  );
};

export default ThemeContainer;
