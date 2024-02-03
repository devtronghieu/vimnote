import { FC, useEffect, useRef } from "react";
import { getCharSize, getTotalCols, renderLineNumbers } from "./utils";
import { useSnapshot } from "valtio";
import { vimState } from "@/state/vim";

interface Props {
  className?: string;
}

const VimEditor: FC<Props> = ({ className }) => {
  const lineNumbersRef = useRef<HTMLDivElement>(null);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  const {
    mode,
    editor: { charSize, totalCols, caretPosition, lineMap, content },
  } = useSnapshot(vimState);

  useEffect(() => {
    if (!textAreaRef.current) return;
    vimState.editor.lineMap = renderLineNumbers(textAreaRef.current);
    vimState.editor.charSize = getCharSize(textAreaRef.current.style.font);
    vimState.editor.totalCols = getTotalCols(textAreaRef.current);
  }, [textAreaRef]);

  useEffect(() => {
    if (mode === "Insert" && textAreaRef.current) {
      textAreaRef.current.setSelectionRange(
        vimState.editor.caretPosition.start,
        vimState.editor.caretPosition.end,
      );
      textAreaRef.current.focus();
    }
  }, [mode]);

  const syncScroll = () => {
    if (!lineNumbersRef.current || !textAreaRef.current) return;
    lineNumbersRef.current.scrollTop = textAreaRef.current.scrollTop;
  };

  const handleChange = () => {
    if (!textAreaRef.current) return;
    vimState.editor.content = textAreaRef.current.value;
    vimState.editor.lineMap = renderLineNumbers(textAreaRef.current);
    vimState.editor.caretPosition = {
      start: textAreaRef.current.selectionStart,
      end: textAreaRef.current.selectionEnd,
    };
  };

  const startRow = Math.floor(caretPosition.start / totalCols);
  const startCol = caretPosition.start % totalCols;
  console.log("-->", startRow, startCol);

  const lines: string[] = [];
  for (let i = 0; i < lineMap.size; i++) {
    lines.push(`${i + 1}`);
    for (let j = 1; j < (lineMap.get(i) || 0); j++) {
      lines.push(`${i + 1}.${j}`);
    }
  }

  return (
    <div
      className={`text-black with-border overflow-hidden flex h-[200px] ${className}`}
    >
      <div
        ref={lineNumbersRef}
        className="bg-slate-100 p-2 text-right no-scrollbar overflow-scroll"
      >
        {lines.map((line) => (
          <p key={line}>{line}</p>
        ))}
      </div>

      <div className="h-full w-[1px] bg-slate-200" />

      <div className="relative bg-white flex-1 p-2">
        <div
          className={`absolute bg-sky-300 opacity-30`}
          style={{
            width: charSize.charWidth,
            height: charSize.charHeight,
            transform: `translate(${startCol * charSize.charWidth}px, ${startRow * charSize.charHeight}px)`,
          }}
        />

        <textarea
          ref={textAreaRef}
          className={`
            h-full w-full font-mono bg-orange-200
            focus:outline-none no-scrollbar overflow-scroll resize-none
            disabled:bg-transparent
          `}
          cols={totalCols}
          value={content}
          onInput={handleChange}
          onScroll={syncScroll}
          readOnly={mode !== "Insert"}
        />
      </div>
    </div>
  );
};

export default VimEditor;
