import { FC } from "react";

interface Props {
  name: string;
  className?: string;
}

const Key: FC<Props> = ({ name, className }) => {
  return (
    <span
      className={`px-2 py-1 border border-slate-700 dark:border-slate-200 rounded font-mono select-none ${className}`}
    >
      {name}
    </span>
  );
};

export default Key;
