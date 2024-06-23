import { useState, useEffect } from "react";
import { Modal } from "antd";
import { Stage, Layer, Rect } from "react-konva";
import ColorPicker from "./ColorPicker";
import { HSV2RGB, RGB2HSV } from "./ColorCalculation";
import { useAppState } from "./hooks";

type Prop = {
  cellNum: number;
  cellSize: number;
};

const ColorButton = ({ cellNum, cellSize }: Prop) => {
  const { buttonColors, setButtonColors } = useAppState();

  const [isModalOpen, setIsModalOpen] = useState(false); //モーダル操作用
  const [colorHue, setColorHue] = useState(0); //決定した色情報
  const [tempColorHue, setTempColorHue] = useState(0); //仮の色情報

  const showModal = () => {
    setTempColorHue(RGB2HSV(buttonColors[cellNum]).h); //仮数値を現状の値に初期化. スライダー初期化用.
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setColorHue(tempColorHue); //決定したときだけ色情報を更新
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setTempColorHue(RGB2HSV(buttonColors[cellNum]).h);
    setIsModalOpen(false);
  };

  useEffect(() => {
    setButtonColors(cellNum, HSV2RGB({ h: colorHue, s: 1, v: 1 }));
  }, [colorHue, setButtonColors, cellNum]);

  //ColorPickerが操作するための関数
  const handleSliderChange = (newValue: number) => {
    setTempColorHue(newValue);
  };

  const handleClick = () => {
    showModal();
  };

  const colorStyle: string = `rgb(${buttonColors[cellNum].r}, ${buttonColors[cellNum].g}, ${buttonColors[cellNum].b})`;

  return (
    <div>
      <Stage width={cellSize} height={cellSize}>
        <Layer>
          <Rect
            x={0}
            y={0}
            width={cellSize}
            height={cellSize}
            fill={colorStyle}
            stroke={"black"}
            strokeWidth={2}
            onClick={handleClick}
            onTouchStart={handleClick} // モバイルデバイス用
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
