import { useState, useEffect } from "react";
import { Modal } from "antd";
import { Stage, Layer, Rect } from "react-konva";
import { Rgb } from "./App";
import ColorPicker from "./ColorPicker";
import { HSV2RGB } from "./ColorCalculation";

type Prop = {
  handleColorChange: (i: number, color: Rgb) => void;
  cellNum: number;
  cellSize: number;
  color: Rgb;
};

const ColorButton = (props: Prop) => {
  const [isModalOpen, setIsModalOpen] = useState(false); //モーダル操作用
  const [colorHue, setColorHue] = useState(0); //決定した色情報
  const [tempColorHue, setTempColorHue] = useState(0); //仮の色情報

  const { handleColorChange, cellNum } = props;

  const showModal = () => {
    setTempColorHue(colorHue); //仮数値を現状の値に初期化. スライダー初期化用.
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setColorHue(tempColorHue); //決定したときだけ色情報を更新
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setTempColorHue(colorHue);
    setIsModalOpen(false);
  };

  useEffect(() => {
    handleColorChange(cellNum, HSV2RGB({ h: colorHue, s: 1, v: 1 }));
  }, [colorHue, handleColorChange, cellNum]);

  //ColorPickerが操作するための関数
  const handleSliderChange = (newValue: number) => {
    setTempColorHue(newValue);
  };

  const handleClick = () => {
    showModal();
  };

  const colorStyle: string = `rgb(${props.color.r}, ${props.color.g}, ${props.color.b})`;

  return (
    <div>
      <Stage width={50} height={50}>
        <Layer>
          <Rect
            x={0}
            y={0}
            width={props.cellSize}
            height={props.cellSize}
            fill={colorStyle}
            stroke={'black'}       // 縁取りの色を設定
            strokeWidth={2}
            onClick={handleClick}
            onTouchStart={handleClick} // モバイルデバイスのためにタッチイベントも追加
          />
        </Layer>
      </Stage>

      <Modal
        title="ColorPicker"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <ColorPicker
          handleSliderChange={handleSliderChange}
          initialValue={tempColorHue}
        />
      </Modal>
    </div>
  );
};

export default ColorButton;
