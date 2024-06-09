import { useCallback, useState } from "react";
import { Layout, Slider, Col, Row } from "antd";
import { Content } from "antd/es/layout/layout";
import { Layer, Rect, Stage } from "react-konva";
import ColorButton from "./ColorButton";
import { MixRGB } from "./ColorCalculation";

export type Rgb = {
  r: number;
  g: number;
  b: number;
};

export type Hsv = {
  h: number;
  s: number;
  v: number;
};

function App() {
  const [cellNum, setCellNum] = useState(3);
  const initialColor: Rgb = { r: 255, g: 0, b: 0 };

  const [buttonColors, setButtonColors] = useState<Array<Rgb>>(
    Array(cellNum).fill(initialColor)
  );

  //ColorButtonが操作するための関数
  const handleColorChange = useCallback((i: number, color: Rgb) => {
    setButtonColors((prevColors) => {
      const newColors = [...prevColors];
      newColors[i] = color;
      return newColors;
    });
  }, []);

  const onChange = (newValue: number) => {
    setCellNum(newValue);
    setButtonColors((prevColors) => {
      let newColors = prevColors;
      if (newValue < cellNum) {
        newColors = prevColors.slice(0, newValue);
      } else {
        while (newColors.length < newValue) newColors.push(initialColor);
      }
      return newColors;
    });
  };

  const rows = [];
  for (let i = 0; i < cellNum; i++) {
    for (let j = 0; j < cellNum; j++) {
      const color = MixRGB(buttonColors[i], buttonColors[j]);
      const colorStyle: string = `rgb(${color.r}, ${color.g}, ${color.b})`;
      rows.push(
        <Rect
          fill={colorStyle}
          x={50 + 100 * i}
          y={50 + 100 * j}
          width={100}
          height={100}
          key={`${i}-${j}`}
        />
      );
    }
    {
      rows;
    }
  }

  const buttons = [];
  for (let i = 0; i < cellNum; i++) {
    const color = buttonColors[i];
    const colorStyle = {
      backgroundColor: `rgb(${color.r}, ${color.g}, ${color.b})`,
    };
    buttons.push(
      <Col
        key={i}
        span={Math.floor(18 / cellNum)}
        style={{ display: "flex", justifyContent: "center" }}
      >
        <ColorButton
          handleColorChange={handleColorChange}
          cellNum={i}
          colorStyle={colorStyle}
        />
      </Col>
    );
  }

  return (
    <Layout>
      <Content>
        <div
          style={{ display: "flex", justifyContent: "center", width: "100%" }}
        >
          <Slider
            style={{ width: "300px" }}
            min={3}
            max={10}
            onChange={onChange}
            value={cellNum}
          />
        </div>
        <Row justify={"space-evenly"}>{buttons}</Row>
        <div
          style={{ display: "flex", justifyContent: "center", width: "100%" }}
        >
          <Stage width={100 + 100 * cellNum} height={100 + 100 * cellNum}>
            <Layer>{rows}</Layer>
          </Stage>
        </div>
      </Content>
    </Layout>
  );
}

export default App;
