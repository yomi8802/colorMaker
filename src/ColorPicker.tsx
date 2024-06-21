import { useEffect, useState } from "react";
import type { InputNumberProps } from "antd";
import { InputNumber, Slider } from "antd";
import { Stage, Layer, Rect } from "react-konva";
import { HSV2RGB } from "./ColorCalculation";

//ColorButtonから
type Props = {
  initialValue: number;
  handleSliderChange: (newValue: number) => void; //ColorButtonにスライダーの値を送る関数
};

const ColorPicker = (props: Props) => {
  //テキストからスライダーを操作する用の変数
  const [inputValue, setInputValue] = useState(props.initialValue);
  const [sampleColor, setSampleColor] = useState({ r: 0, g: 0, b: 0 });

  //モーダルキャンセル時のスライダー初期化用
  useEffect(() => {
    setInputValue(props.initialValue);
  }, [props.initialValue]);

  //スライダー操作時
  const onChange: InputNumberProps["onChange"] = (newValue) => {
    setInputValue(newValue as number);
    props.handleSliderChange(newValue as number);
  };

  useEffect(() => {
    setSampleColor(HSV2RGB({ h: inputValue, s: 1, v: 1 }));
  }, [inputValue]);

  const colorStyle = `rgb(${sampleColor.r}, ${sampleColor.g}, ${sampleColor.b})`;

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
        <InputNumber min={0} max={360} value={inputValue} onChange={onChange} />
      </div>
    </div>
  );
};

export default ColorPicker;
