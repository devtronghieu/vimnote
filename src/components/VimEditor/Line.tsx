import { FC } from "react";
import Char from "./Char";
import { Container } from "@pixi/react";

interface Props {
  x: number;
  y: number;
  segments: string[];
  charHeight: number;
  charWidth: number;
  rowHeight: number;
}

const Line: FC<Props> = ({
  x,
  y,
  segments,
  charHeight,
  charWidth,
  rowHeight,
}) => {
  return (
    <Container x={x} y={y}>
      {segments.map((segment, idx) => {
        return segment
          .split("")
          .map((char, col) => (
            <Char
              key={col}
              text={char}
              x={col * charWidth}
              y={idx * rowHeight + (rowHeight - charHeight) / 2}
              width={charWidth}
              height={charHeight}
            />
          ));
      })}
    </Container>
  );
};

export default Line;
