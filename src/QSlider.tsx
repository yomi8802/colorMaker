import { Flex, Slider } from "antd";
import { Config } from "./VFCA";
import { CellRender } from "./CellRender";
import { useState } from "react";

type QSliderProp = {
  config: Config;
  setConfig: (newConfig: Config) => void;
};

const QSlider = ({ config, setConfig }: QSliderProp) => {
  const { q, baseColor } = config;
  const [tempQ, setTempQ] = useState(q);

  const onChange = (newValue: number) => {
    const newConfig = {
      ...config,
      q: newValue,
      cellRender: (state: number[]) => CellRender(newConfig)(state),
    };

    const newFirstRow: number[][] = [];
    for (let i = 0; i < newConfig.n; i++) {
      let cell: number[] = new Array(newConfig.q);

      for (let j = 0; j < newConfig.q; j++) {
        cell[j] = Math.random();
      }

      const totalState = cell.reduce((acc, val) => acc + val, 0);

      cell = cell.map((d) => d / totalState);

      newFirstRow.push(cell);
    }

    const initialColor = { r: 255, g: 0, b: 0 };

    newConfig.firstRow = newFirstRow;

    newConfig.baseColor = baseColor;

    if (newValue <= baseColor.length) {
      newConfig.baseColor = baseColor.slice(0, newValue); // 新しい値が現在の長さより小さい場合、配列を切り詰める
    } else {
      while (newConfig.baseColor.length < newValue) {
        newConfig.baseColor.push(initialColor); // 新しい値が現在の長さより大きい場合、初期色で拡張
      }
    }

    setConfig(newConfig);
    setTempQ(newValue);
  };

  return (
    <>
      <Flex
        style={{
          width: "100%",
        }}
        justify="space-evenly"
        align="center"
      >
        <Slider
          style={{ width: "80%" }}
          min={3}
          max={10}
          onChange={onChange}
          value={tempQ}
        />
      </Flex>
    </>
  );
};

export default QSlider;
