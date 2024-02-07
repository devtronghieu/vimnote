import { FC, useCallback } from "react";
import { animated, useSpring } from "@react-spring/web";
import { getHexColorNumber } from "@/utils/colors";
import { Graphics } from "@pixi/react";
import { Graphics as GraphicsInterface } from "pixi.js";

interface Props {
  x: number;
  y: number;
  width: number;
  height: number;
  alpha?: number;
}

const AnimatedGraphics = animated(Graphics);

const Caret: FC<Props> = ({ x, y, width, height, alpha = 0.3 }) => {
  const springProps = useSpring({
    to: { x, y },
    config: {
      tension: 800,
      friction: 50,
      mass: 0.05,
      velocity: 8,
    },
  });

  const draw = useCallback(
    (g: GraphicsInterface) => {
      g.clear();
      g.beginFill(getHexColorNumber("#FF0000"), alpha);
      g.drawRect(0, 0, width, height);
    },
    [width, height, alpha],
  );

  return <AnimatedGraphics draw={draw} x={springProps.x} y={springProps.y} />;
};

export default Caret;
