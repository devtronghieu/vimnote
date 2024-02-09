import { vimActions, vimState } from "@/engines/vim";
import { Container, Stage } from "@pixi/react";
import { FC, useEffect, useMemo, useState } from "react";
import { useSnapshot } from "valtio";
import Char from "./Char";
import Caret from "./Caret";
import StatusLine from "./StatusLine";
import Line from "./Line";

interface Props {
  containerWidth?: number;
  containerHeight?: number;
  statusLineHeight?: number;
  charWidth?: number;
  charHeight?: number;
  rowHeight?: number;
  gapBetweenLineNumberAndTextArea?: number;
}

const VimEditor: FC<Props> = ({
  containerWidth = 400,
  containerHeight = 200,
  statusLineHeight = 20,
  charWidth = 10,
  charHeight = 18,
  rowHeight = 22,
  gapBetweenLineNumberAndTextArea = 10,
}) => {
  const { content, mode, cursor } = useSnapshot(vimState);

  const [codeViewStartFromSegment, setCodeViewStartFromSegment] = useState(0);

  const maxRowsDisplayed = useMemo(() => {
    const codeHeight = containerHeight - statusLineHeight;
    return Math.floor(codeHeight / rowHeight);
  }, [containerHeight, rowHeight, statusLineHeight]);

  const maxLineNumberDigits = useMemo(
    () => content.length.toString().length,
    [content.length],
  );

  const lineNumberWidth = useMemo(
    () => maxLineNumberDigits * charWidth + gapBetweenLineNumberAndTextArea,
    [charWidth, gapBetweenLineNumberAndTextArea, maxLineNumberDigits],
  );

  const textWidth = useMemo(
    () => containerWidth - lineNumberWidth,
    [containerWidth, lineNumberWidth],
  );

  const maxCharsPerRow = useMemo(
    () => Math.floor(textWidth / charWidth),
    [charWidth, textWidth],
  );

  const segmentsBeforeRow = useMemo(
    () => vimActions.countSegmentsBeforeRow(cursor.row),
    [cursor.row],
  );

  const caretWidth = useMemo(
    () => (mode === "Insert" ? 1 : charWidth),
    [charWidth, mode],
  );

  const caretY = useMemo(
    () => rowHeight * (segmentsBeforeRow + cursor.segment),
    [rowHeight, segmentsBeforeRow, cursor.segment],
  );

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
    const currentSegmentIdx = segmentsBeforeRow + vimState.cursor.segment;
    const codeViewEndInSegment =
      codeViewStartFromSegment + maxRowsDisplayed - 1;

    const isAbove = currentSegmentIdx < codeViewStartFromSegment;
    const isUnder = currentSegmentIdx > codeViewEndInSegment;

    if (isAbove) {
      setCodeViewStartFromSegment(currentSegmentIdx);
    } else if (isUnder) {
      setCodeViewStartFromSegment(
        codeViewStartFromSegment + (currentSegmentIdx - codeViewEndInSegment),
      );
    }
  }, [
    codeViewStartFromSegment,
    segmentsBeforeRow,
    cursor.segment,
    maxRowsDisplayed,
  ]);

  return (
    <Stage
      width={containerWidth}
      height={containerHeight}
      options={{ backgroundAlpha: 0 }}
      className="with-border p-4"
    >
      <Container y={-codeViewStartFromSegment * rowHeight}>
        {content.map((line, row) => {
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

              <Line
                x={lineNumberWidth}
                y={0}
                segments={line as string[]}
                rowHeight={rowHeight}
                charHeight={charHeight}
                charWidth={charWidth}
              />
            </Container>
          );
        })}

        <Caret
          x={lineNumberWidth + cursor.col * charWidth}
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
        mode={mode}
        cursor={cursor}
      />
    </Stage>
  );
};

export default VimEditor;
