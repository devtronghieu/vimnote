import { FC } from "react";

interface Props {
  className?: string;
}

const VimEditor: FC<Props> = ({ className }) => {
  return (
    <div
      className={`text-black with-border overflow-hidden flex h-[200px] ${className}`}
    >
      I&apos;m gonna rework this one
    </div>
  );
};

export default VimEditor;
