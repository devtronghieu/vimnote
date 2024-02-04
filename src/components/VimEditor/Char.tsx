import { Text } from "@pixi/react";
import { TextStyle } from "pixi.js";
import { FC } from "react";

const style = new TextStyle({
  fontFamily: "monospace",
  align: "center",
});

interface Props {
  text: string;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
}

const Char: FC<Props> = ({ text, x = 0, y = 0, width = 12, height = 16 }) => {
  return (
    <Text text={text} x={x} y={y} style={style} width={width} height={height} />
  );
};

export default Char;
