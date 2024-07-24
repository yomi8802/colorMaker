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
  const rows = Array.from({ length: q + 1 }).flatMap((_, i) =>
    Array.from({ length: q + 1 }).map((_, j) => {
      const baseArray = new Array(q).fill(0);
      if (i === 0) {
        if (j === 0) return;
        baseArray[j - 1] = 1;
      } else if (j === 0) {
        baseArray[i - 1] = 1;
      } else {
        baseArray[i - 1] += 0.5;
        baseArray[j - 1] += 0.5;
      }
      const color = cellRender(baseArray);
      const colorStyle: string = `rgb(${color.r}, ${color.g}, ${color.b})`;
      const xPos = i === 0 ? cellSize / 2 + cellSize * i : cellSize / 2 + cellSize * i + cellSize / 10;
      const yPos = j === 0 ? cellSize / 2 + cellSize * j : cellSize / 2 + cellSize * j + cellSize / 10;
      return (
        <Rect
          fill={colorStyle}
          x={xPos}
          y={yPos}
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
          width={cellSize * (q + 2)}
          height={cellSize * (q + 2)}
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
