import { vimState } from "@/engines/vim";
import { FC } from "react";
import { useSnapshot } from "valtio";

interface Props {
  className?: string;
}

const VimEditor: FC<Props> = ({ className }) => {
  const vimSnap = useSnapshot(vimState);
  console.log(
    "-->",
    vimSnap.editor.cursor.col,
    vimSnap.editor.cursor.row.value,
  );

  return (
    <div
      className={`text-black with-border overflow-hidden flex h-[200px] ${className}`}
    >
      I&apos;m gonna rework this one
    </div>
  );
};

export default VimEditor;
