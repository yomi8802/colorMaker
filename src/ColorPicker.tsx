import { useEffect, useState } from "react";
import type { InputNumberProps } from "antd";
import { InputNumber, Slider } from "antd";

//ColorButtonから
type Props = {
  initialValue: number
  handleSliderChange: (newValue: number) => void //ColorButtonにスライダーの値を送る関数
};

const ColorPicker = (props: Props) => {
  //テキストからスライダーを操作する用の変数
  const [inputValue, setInputValue] = useState(props.initialValue);

  //モーダルキャンセル時のスライダー初期化用
  useEffect(() => {
    setInputValue(props.initialValue);
  }, [props.initialValue]);

  //スライダー操作時
  const onChange: InputNumberProps["onChange"] = (newValue) => {
    setInputValue(newValue as number);
    props.handleSliderChange(newValue as number);
  };

  return (
    <div id="overlay">
      <div id="modalcontent">
        <p>Modal</p>
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
