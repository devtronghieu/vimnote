import { FC } from "react";
import { getHexColorNumber } from "@/utils/colors";
import { Graphics, Container, Text } from "@pixi/react";
import { Graphics as GraphicsInterface, TextStyle } from "pixi.js";
import { Mode } from "@/engines/vim/internal";
import { CursorPosition } from "@/engines/vim/editor/types";

interface Props {
  x: number;
  y: number;
  width: number;
  height: number;
  mode: Mode;
  cursor: CursorPosition;
}

const StatusLine: FC<Props> = ({ x, y, width, height, mode, cursor }) => {
  const draw = (g: GraphicsInterface) => {
    g.clear();
    g.beginFill(getHexColorNumber("#EEEEEE"));
    g.drawRect(0, 0, width, height);
  };

  return (
    <Container x={x} y={y}>
      <Graphics draw={draw} />
      <Text
        text={`${mode} - ${cursor.row + 1}:${cursor.segment + 1}:${cursor.col + 1}`}
        style={
          new TextStyle({
            fontSize: 16,
          })
        }
      />
    </Container>
  );
};

export default StatusLine;
