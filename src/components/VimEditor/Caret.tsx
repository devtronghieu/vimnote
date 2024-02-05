import { getHexColorNumber } from "@/utils/colors";
import { Graphics } from "@pixi/react";
import { Graphics as GraphicsInterface } from "pixi.js";
import { FC, useCallback } from "react";

interface Props {
  x: number;
  y: number;
  width: number;
  height: number;
}

const Caret: FC<Props> = ({ x, y, width, height }) => {
  const draw = useCallback(
    (g: GraphicsInterface) => {
      g.clear();
      g.lineStyle(width, getHexColorNumber("#FF0000"));
      g.drawRect(x, y, width, height);
    },
    [x, y, width, height],
  );

  return <Graphics draw={draw} />;
};

export default Caret;
