import { vimActions, vimState } from "@/engines/vim";
import { Container, Stage } from "@pixi/react";
import { FC, useEffect, useState } from "react";
import { useSnapshot } from "valtio";
import Char from "./Char";
import Caret from "./Caret";
import StatusLine from "./StatusLine";

interface Props {}

const charWidth = 10;
const charHeight = 18;
const rowHeight = 22;
const containerWidth = 400;
const containerHeight = 200;
const gapBetweenLineNumberAndTextArea = 10;
const statusLineHeight = 20;
const codeHeight = containerHeight - statusLineHeight;
const maxRowsDisplayed = Math.floor(codeHeight / rowHeight);

const VimEditor: FC<Props> = ({}) => {
  const snap = useSnapshot(vimState);
  const [maxLineNumberDigits, setMaxLineNumberDigits] = useState(
    vimState.content.length.toString().length,
  );
  const [codeViewStartFromSegment, setCodeViewStartFromSegment] = useState(0);

  const lineNumberWidth =
    maxLineNumberDigits * charWidth + gapBetweenLineNumberAndTextArea;

  const textWidth = containerWidth - lineNumberWidth;

  const maxCharsPerRow = Math.floor(textWidth / charWidth);

  const segmentsBeforeRow = vimActions.countSegmentsBeforeRow(snap.cursor.row);

  const caretWidth = snap.mode === "Insert" ? 1 : charWidth;

  const caretY = rowHeight * (segmentsBeforeRow + snap.cursor.segment);

  useEffect(() => {
    vimActions.setMaxCharsPerRow(maxCharsPerRow);

    const handleKeyDown = (e: KeyboardEvent) => {
      vimActions.type(e.key);
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [maxCharsPerRow]);

  // TODO: need to optimize this scrolling behavior
  useEffect(() => {
    const currentSegmentIdx = segmentsBeforeRow + snap.cursor.segment;
    const isVisible =
      currentSegmentIdx >= codeViewStartFromSegment &&
      currentSegmentIdx < codeViewStartFromSegment + maxRowsDisplayed;

    if (!isVisible) {
      setCodeViewStartFromSegment(
        Math.max(currentSegmentIdx - maxRowsDisplayed + 1, 0),
      );
    }
  }, [codeViewStartFromSegment, segmentsBeforeRow, snap.cursor.segment]);

  useEffect(() => {
    setMaxLineNumberDigits(vimState.content.length.toString().length);
  }, [snap.content.length]);

  console.log("--> rerender");

  return (
    <Stage
      width={containerWidth}
      height={containerHeight}
      options={{
        backgroundAlpha: 0,
      }}
      className="with-border p-4"
    >
      <Container y={-codeViewStartFromSegment * rowHeight}>
        {snap.content.map((line, row) => {
          return (
            <Container
              key={row}
              y={vimActions.countSegmentsBeforeRow(row) * rowHeight}
            >
              {(row + 1)
                .toString()
                .split("")
                .reverse()
                .map((digit, idx) => (
                  <Char
                    key={idx}
                    text={digit}
                    width={charWidth}
                    height={charHeight}
                    x={(maxLineNumberDigits - idx - 1) * charWidth}
                    y={(rowHeight - charHeight) / 2}
                  />
                ))}

              {line.map((segment, idx) => {
                return segment
                  .split("")
                  .map((char, col) => (
                    <Char
                      key={col}
                      text={char}
                      x={lineNumberWidth + col * charWidth}
                      y={idx * rowHeight + (rowHeight - charHeight) / 2}
                      width={charWidth}
                      height={charHeight}
                    />
                  ));
              })}
            </Container>
          );
        })}

        <Caret
          x={lineNumberWidth + snap.cursor.col * charWidth}
          y={caretY}
          width={caretWidth}
          height={rowHeight}
        />
      </Container>

      <StatusLine
        x={0}
        y={containerHeight - statusLineHeight}
        width={containerWidth}
        height={statusLineHeight}
        mode={snap.mode}
        cursor={snap.cursor}
      />
    </Stage>
  );
};

export default VimEditor;
