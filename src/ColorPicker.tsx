import { useState } from "react";
import type { InputNumberProps } from "antd";
import { InputNumber, Slider } from "antd";
import { Stage, Layer, Rect } from "react-konva";
import { HSV2RGB } from "./CellRender";
import { Hsv } from "./CellRender";

//ColorButtonから
type Props = {
  handleSliderChange: (newValue: number) => void; //ColorButtonにスライダーの値を送る関数
  baseColor: Hsv;
};

const ColorPicker = (props: Props) => {
  const [inputValue, setInputValue] = useState(props.baseColor.h);
  const [sampleRGBColor, setSampleColor] = useState(
    HSV2RGB({ h: props.baseColor.h, s: 1, v: 1 })
  );

  //スライダー操作時
  const onChange: InputNumberProps["onChange"] = (newValue) => {
    setInputValue(newValue as number);
    props.handleSliderChange(newValue as number);
    setSampleColor(HSV2RGB({ h: newValue as number, s: 1, v: 1 }));
  };

  const colorStyle = `rgb(${sampleRGBColor.r}, ${sampleRGBColor.g}, ${sampleRGBColor.b})`;

  return (
    <div id="overlay">
      <Stage width={50} height={50}>
        <Layer>
          <Rect
            x={0}
            y={0}
            width={50}
            height={50}
            fill={colorStyle}
            stroke={"black"}
          />
        </Layer>
      </Stage>
      <div id="modalcontent">
        <Slider
          min={0}
          max={360}
          onChange={onChange}
          value={typeof inputValue === "number" ? inputValue : 0}
        />
        <a style={{ paddingRight: "0.3vw" }}>H:</a>
        <InputNumber
          min={0}
          max={360}
          value={Math.round(inputValue)}
          onChange={onChange}
        />
        <a>{props.baseColor.h}</a>
      </div>
    </div>
  );
};

export default ColorPicker;
