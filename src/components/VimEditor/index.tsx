import { FC, useEffect, useRef, useState } from "react";
import { defaultCols, getCharSize, getCols, renderLineNumbers } from "./utils";
import { useSnapshot } from "valtio";
import { vimState } from "@/state/vim";

interface Props {
  className?: string;
}

const VimEditor: FC<Props> = ({ className }) => {
  const lineNumbersRef = useRef<HTMLDivElement>(null);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  const vimSnap = useSnapshot(vimState);

  const [cols, setCols] = useState(defaultCols);
  const [charSize, setCharSize] = useState({
    charWidth: 0,
    charHeight: 0,
  });

  useEffect(() => {
    if (!lineNumbersRef.current || !textAreaRef.current) return;
    renderLineNumbers(lineNumbersRef.current, textAreaRef.current);
    setCharSize(getCharSize(textAreaRef.current.style.font));
    setCols(getCols(textAreaRef.current));
  }, [lineNumbersRef, textAreaRef]);

  useEffect(() => {
    if (vimSnap.mode === "Insert" && textAreaRef.current) {
      textAreaRef.current.focus();
    }
  }, [vimSnap.mode]);

  const syncScroll = () => {
    if (!lineNumbersRef.current || !textAreaRef.current) return;
    lineNumbersRef.current.scrollTop = textAreaRef.current.scrollTop;
  };

  return (
    <div
      className={`text-black with-border overflow-hidden flex h-[200px] ${className}`}
    >
      <div
        ref={lineNumbersRef}
        className="bg-slate-100 p-2 text-right no-scrollbar overflow-scroll"
      />

      <div className="h-full w-[1px] bg-slate-200" />

      <div className="relative bg-white flex-1 p-2">
        <div
          className={`absolute bg-sky-300 opacity-30`}
          style={{
            width: charSize.charWidth,
            height: charSize.charHeight,
          }}
        />

        <textarea
          ref={textAreaRef}
          className={`
            h-full w-full
            focus:outline-none no-scrollbar overflow-scroll resize-none
            disabled:bg-transparent
          `}
          cols={cols}
          onChange={() =>
            lineNumbersRef.current &&
            textAreaRef.current &&
            renderLineNumbers(lineNumbersRef.current, textAreaRef.current)
          }
          onScroll={syncScroll}
          disabled={vimSnap.mode !== "Insert"}
        />
      </div>
    </div>
  );
};

export default VimEditor;
