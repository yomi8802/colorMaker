import { useState } from "react";
import { HSV2RGB, RGB2HSV } from "./CellRender";
import { Layer, Rect, Stage } from "react-konva";
import {
  Button,
  Col,
  Flex,
  InputNumber,
  InputNumberProps,
  Modal,
  Row,
  Slider,
} from "antd";
import { Config } from "./VFCA";
import { CellRender } from "./CellRender";

type Prop = {
  config: Config;
  cellSize: number;
  setConfig: (newConfig: Config) => void;
};

const ColorButtons = ({ config, cellSize, setConfig }: Prop) => {
  const { q, baseColor } = config;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(0);
  const [inputValue, setInputValue] = useState(0);
  const [HSVBaseColor, setHsvBaseColor] = useState(
    baseColor.map((color) => {
      const rgbColor = { r: color.r / 255, g: color.g / 255, b: color.b / 255 };
      return RGB2HSV(rgbColor);
    })
  );
  const [tempColor, setTempColor] = useState(baseColor[0]);

  const showModal = (id: number) => {
    setInputValue(HSVBaseColor[id].h);
    setTempColor(baseColor[id]);
    setSelectedId(id);
    setIsModalOpen(true);
  };

  const handleOk = () => {
    const newHSVColor = HSVBaseColor;
    newHSVColor[selectedId].h = RGB2HSV(tempColor).h;
    setHsvBaseColor(newHSVColor);
    const newBaseColor = newHSVColor.map((color) => {
      return HSV2RGB(color);
    });
    const newConfig = {
      ...config,
      baseColor: newBaseColor,
      cellRender: (state: number[]) => CellRender(newConfig)(state),
    };
    setConfig(newConfig); //決定したときだけ色情報を更新
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  //スライダー操作時
  const onChange: InputNumberProps["onChange"] = (newValue) => {
    setInputValue(newValue as number);
    setTempColor(HSV2RGB({ h: newValue as number, s: 1, v: 1 }));
  };

  const makeRGBBaseColor = () => {
    let tempHSVBaseColor = HSVBaseColor;
    if (q < HSVBaseColor.length) {
      tempHSVBaseColor = tempHSVBaseColor.slice(0, q); // 新しい値が現在の長さより小さい場合、配列を切り詰める
    } else if (HSVBaseColor.length < q) {
      tempHSVBaseColor = baseColor.map((color) => {
        const rgbColor = {
          r: color.r / 255,
          g: color.g / 255,
          b: color.b / 255,
        };
        return RGB2HSV(rgbColor);
      });
      setHsvBaseColor(tempHSVBaseColor);
    }
    return tempHSVBaseColor.map((color) => {
      return HSV2RGB(color);
    });
  };

  const buttons = Array.from({ length: q }).map((_, i) => {
    const RGBBaseColor = makeRGBBaseColor();
    const colorStyle = `rgb(${RGBBaseColor[i].r}, ${RGBBaseColor[i].g}, ${RGBBaseColor[i].b})`;
    const modalColorStyle = `rgb(${tempColor.r}, ${tempColor.g}, ${tempColor.b})`;
    return (
      <Col
        key={i}
        span={Math.round(18 / q)}
        style={{ display: "flex", justifyContent: "center" }}
      >
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
              onClick={() => showModal(i)}
              onTouchStart={() => showModal(i)}
            />
          </Layer>
        </Stage>

        <Modal
          title="ColorPicker"
          open={isModalOpen}
          onOk={handleOk}
          onCancel={handleCancel}
        >
          <div id="overlay">
            <Stage width={50} height={50}>
              <Layer>
                <Rect
                  x={0}
                  y={0}
                  width={50}
                  height={50}
                  fill={modalColorStyle}
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
            </div>
          </div>
        </Modal>
      </Col>
    );
  });

  const autoSetting = () => {
    for (let i = 0; i < q; i++) {
      const newHSVColor = HSVBaseColor.map((color, i) => {
        color.h = Math.round(360 / q) * i;
        return color;
      });
      setHsvBaseColor(newHSVColor);
      const newBaseColor = newHSVColor.map((color) => {
        return HSV2RGB(color);
      });
      const newConfig = {
        ...config,
        baseColor: newBaseColor,
        cellRender: (state: number[]) => CellRender(newConfig)(state),
      };
      setConfig(newConfig);
    }
  };

  return (
    <>
      <Row justify={"space-evenly"}>
        <Col span={8} offset={6}>
          <Flex
            style={{
              height: "100%",
            }}
            justify="space-evenly"
            align="center"
          >
            <p>Base Colors</p>
          </Flex>
        </Col>
        <Col span={4}>
          <Flex
            style={{
              height: "100%",
            }}
            justify="space-evenly"
            align="center"
          >
            <Button type="primary" size="small" onClick={autoSetting}>
              Auto Setup
            </Button>
          </Flex>
        </Col>
      </Row>
      <Row justify={"center"}>{buttons}</Row>
    </>
  );
};

export default ColorButtons;
