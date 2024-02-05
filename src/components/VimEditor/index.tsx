import { vimState } from "@/engines/vim";
import { Container, Stage, Text } from "@pixi/react";
import { FC, useEffect } from "react";
import { useSnapshot } from "valtio";
import Char from "./Char";
import { getHexColorNumber } from "@/utils/colors";
import Caret from "./Caret";

interface Props {}

const VimEditor: FC<Props> = ({}) => {
  const snap = useSnapshot(vimState);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      vimState.editor.type(e.key);
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  const charWidth = 10;
  const charHeight = 18;
  const width = 400;
  const height = 200;
  const caretWidth = snap.editor.mode === "Insert" ? 1 : charWidth;

  console.log("-->", snap.editor.cursor.row, snap.editor.cursor.col);

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
          <Container key={row} y={row * charHeight}>
            {line.split("").map((char, col) => (
              <Char
                key={col}
                text={char}
                x={col * charWidth}
                width={charWidth}
                height={charHeight}
              />
            ))}
          </Container>
        );
      })}

      <Caret
        x={snap.editor.cursor.col * charWidth}
        y={snap.editor.cursor.row * charHeight}
        width={caretWidth}
        height={charHeight}
      />

      <Container y={height - charHeight}>
        <Text text={snap.editor.mode} height={charHeight} />
      </Container>
    </Stage>
  );
};

export default VimEditor;
