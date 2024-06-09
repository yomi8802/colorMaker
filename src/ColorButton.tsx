import { useState, useEffect } from "react";
import { Button, Modal } from "antd";
import { Rgb } from "./App";
import ColorPicker from "./ColorPicker";
import { HSV2RGB } from "./ColorCalculation";

type Prop = {
  handleColorChange: (i: number, color: Rgb) => void;
  cellNum: number;
  colorStyle: React.CSSProperties;
};

const ColorButton = (props: Prop) => {
  const [isModalOpen, setIsModalOpen] = useState(false); //モーダル操作用
  const [colorHue, setColorHue] = useState(0); //決定した色情報
  const [tempColorHue, setTempColorHue] = useState(0); //仮の色情報

  const { handleColorChange, cellNum } = props;

  const showModal = () => {
    setTempColorHue(colorHue); //仮数値を現状の値に初期化。スライダー初期化用。
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
    handleColorChange(cellNum, HSV2RGB({h: colorHue, s: 1, v: 1}));
  }, [colorHue, handleColorChange, cellNum]);

  //ColorPickerが操作するための関数
  const handleSliderChange = (newValue: number) => {
    setTempColorHue(newValue);
  };

  return (
    <div>
      <Button type="primary" onClick={showModal} style={props.colorStyle}>
        基底色
      </Button>
      <h3>Hue: {colorHue}</h3>

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
