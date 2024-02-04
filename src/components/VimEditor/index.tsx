import { vimState } from "@/engines/vim";
import { Container, Stage, Text } from "@pixi/react";
import { FC, useEffect } from "react";
import { useSnapshot } from "valtio";
import Char from "./Char";
import { getHexColorNumber } from "@/utils/colors";

interface Props {}

const VimEditor: FC<Props> = ({}) => {
  const snap = useSnapshot(vimState);
  const charWidth = 10;
  const charHeight = 18;
  const width = 400;
  const height = 200;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      vimState.editor.type(e.key);
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <Stage
      width={width}
      height={height}
      options={{
        backgroundColor: getHexColorNumber("#ffffff"),
      }}
      className="with-border p-4"
    >
      {snap.editor.content.mapToArray((line, row) => {
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

      <Container y={height - charHeight}>
        <Text text={snap.editor.mode} height={charHeight} />
      </Container>
    </Stage>
  );
};

export default VimEditor;
