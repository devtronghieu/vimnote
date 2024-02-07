import { vimActions, vimState } from "@/engines/vim";
import { Container, Stage, Text } from "@pixi/react";
import { FC, useEffect, useState } from "react";
import { useSnapshot } from "valtio";
import Char from "./Char";
import { getHexColorNumber } from "@/utils/colors";
import Caret from "./Caret";

interface Props {}

const charWidth = 10;
const charHeight = 18;
const rowHeight = 22;
const width = 400;
const height = 200;
const gapBetweenLineNumberAndTextArea = 10;

const VimEditor: FC<Props> = ({}) => {
  const snap = useSnapshot(vimState);
  const [maxLineNumberDigits, setMaxLineNumberDigits] = useState(
    vimState.editor.content.length.toString().length,
  );

  const caretWidth = snap.editor.mode === "Insert" ? 1 : charWidth;
  const lineNumberWidth =
    maxLineNumberDigits * charWidth + gapBetweenLineNumberAndTextArea;
  const textWidth = width - lineNumberWidth;
  const maxCharsPerRow = Math.floor(textWidth / charWidth);

  useEffect(() => {
    console.log("--> maxCharsPerRow", maxCharsPerRow);
    vimState.editor.setMaxCharsPerRow(maxCharsPerRow);

    const handleKeyDown = (e: KeyboardEvent) => {
      vimActions.type(e.key);
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [maxCharsPerRow]);

  useEffect(() => {
    setMaxLineNumberDigits(vimState.editor.content.length.toString().length);
  }, [snap.editor.content.length]);

  return (
    <Stage
      width={width}
      height={height}
      options={{
        backgroundColor: getHexColorNumber("#ffffff"),
      }}
      className="with-border p-4"
    >
      {snap.editor.content.map((line, row) => {
        return (
          <Container key={row} y={row * rowHeight}>
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
        x={lineNumberWidth + snap.editor.cursor.col * charWidth}
        y={snap.editor.cursor.row * rowHeight}
        width={caretWidth}
        height={rowHeight}
      />

      <Container y={height - charHeight}>
        <Text text={snap.editor.mode} height={charHeight} />
      </Container>
    </Stage>
  );
};

export default VimEditor;
