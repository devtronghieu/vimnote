import { getHexColorNumber } from "@/utils/colors";
import { Graphics } from "@pixi/react";
import { Graphics as GraphicsInterface } from "pixi.js";
import { FC, useCallback } from "react";

interface Props {
  x: number;
  y: number;
  width: number;
  height: number;
  alpha?: number;
}

const Caret: FC<Props> = ({ x, y, width, height, alpha = 0.3 }) => {
  const draw = useCallback(
    (g: GraphicsInterface) => {
      g.clear();
      g.beginFill(getHexColorNumber("#FF0000"), alpha);
      g.drawRect(x, y, width, height);
    },
    [x, y, width, height, alpha],
  );

  return <Graphics draw={draw} />;
};

export default Caret;
