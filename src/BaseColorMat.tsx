import { Layer, Rect, Stage } from "react-konva";
import { Flex } from "antd";
import { Config } from "./VFCA";
import { useRef } from "react";
import Konva from "konva";
import DLButton from "./DLButton";

type Prop = {
  config: Config;
  cellSize: number;
};

const BaseColorMat = ({ config, cellSize }: Prop) => {
  const { q, cellRender } = config;
  const stageRef = useRef<Konva.Stage>(null);
  const rows = Array.from({ length: q }).flatMap((_, i) =>
    Array.from({ length: q }).map((_, j) => {
      const baseArray = new Array(q).fill(0);
      baseArray[i] += 0.5;
      baseArray[j] += 0.5;
      const color = cellRender(baseArray);
      const colorStyle: string = `rgb(${color.r}, ${color.g}, ${color.b})`;
      return (
        <Rect
          fill={colorStyle}
          x={cellSize / 2 + cellSize * i}
          y={cellSize / 2 + cellSize * j}
          width={cellSize}
          height={cellSize}
          key={`${i}-${j}`}
        />
      );
    })
  );

  return (
    <Flex
      style={{
        width: "100%",
      }}
      justify="space-evenly"
      align="center"
      vertical
    >
      <div>
        <Stage
          width={cellSize * (q + 1)}
          height={cellSize * (q + 1)}
          ref={stageRef}
        >
          <Layer>{rows}</Layer>
        </Stage>
        <DLButton fileName="BaseColor" stageRef={stageRef} />
      </div>
    </Flex>
  );
};

export default BaseColorMat;
