import { FC, useEffect, useRef, useState } from "react";
import { defaultCols, getCharWidth } from "./utils";

interface Props {
  className?: string;
}

const VimEditor: FC<Props> = ({ className }) => {
  const lineNumbersRef = useRef<HTMLDivElement>(null);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  const [cols, setCols] = useState(defaultCols);

  useEffect(() => {
    renderLineNumbers();
    setCols(getCols());
  }, [lineNumbersRef, textAreaRef]);

  const renderLineNumbers = () => {
    if (!lineNumbersRef.current || !textAreaRef.current) return;

    const lines = textAreaRef.current.value.split("\n");

    const lineNumbers: number[] = [];
    for (let i = 0; i < lines.length; i++) {
      lineNumbers.push(i + 1);
      const emptyLines = Math.floor(lines[i].length / textAreaRef.current.cols);
      Array.from({ length: emptyLines }).forEach(() => lineNumbers.push(0));
    }

    lineNumbersRef.current.innerHTML = lineNumbers
      .map((num) => (num !== 0 ? `<p>${num}</p>` : "<p>&nbsp;</p>"))
      .join("");
  };

  const getCols = () => {
    if (!textAreaRef.current) return defaultCols;
    const textArea = textAreaRef.current;
    const charWidth = getCharWidth(textArea.style.font);
    const textWidth = textArea.clientWidth;
    return Math.floor(textWidth / charWidth);
  };

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

      <div className="bg-white flex-1 p-2">
        <textarea
          ref={textAreaRef}
          className={`
          h-full w-full
          focus:outline-none no-scrollbar overflow-scroll resize-none
        `}
          cols={cols}
          onChange={renderLineNumbers}
          onScroll={syncScroll}
        />
      </div>
    </div>
  );
};

export default VimEditor;
