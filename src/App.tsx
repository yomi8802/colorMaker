import { useCallback, useState, useLayoutEffect } from "react";
import { Layout, Slider, Col, Row } from "antd";
import { Content } from "antd/es/layout/layout";
import { Layer, Rect, Stage } from "react-konva";
import ColorButton from "./ColorButton";
import { MixRGB } from "./ColorCalculation";
import { CA } from "./CA.tsx";
import useWindowSize from "./hooks";

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

  const [width, height] = useWindowSize();

  const [cellSize, setCellSize] = useState(0);
  useLayoutEffect(() => {
    if (width < height) {
      setCellSize(Math.min(width / ((cellNum + 1) * 2), 50));
    } else {
      setCellSize(Math.min(height / ((cellNum + 1) * 2), 50));
    }
  }, [width, height, cellNum]);

  const rows = [];
  for (let i = 0; i < cellNum; i++) {
    for (let j = 0; j < cellNum; j++) {
      const color = MixRGB(buttonColors[i], buttonColors[j]);
      const colorStyle: string = `rgb(${color.r}, ${color.g}, ${color.b})`;
      rows.push(
        <Rect
          fill={colorStyle}
          x={cellSize / 2 + cellSize * i}
          y={cellSize / 2 + cellSize * j}
          width={cellSize}
          height={cellSize}
          key={`${i}-${j}`}
        />
      );
    }
  }

  const buttons = [];
  for (let i = 0; i < cellNum; i++) {
    const color = buttonColors[i];
    buttons.push(
      <Col
        key={i}
        span={Math.floor(18 / cellNum)}
        style={{ display: "flex", justifyContent: "center" }}
      >
        <ColorButton
          handleColorChange={handleColorChange}
          cellNum={i}
          cellSize={cellSize}
          color={color}
        />
      </Col>
    );
  }

  return (
    <Layout style={{ minWidth: "100%" }}>
      <Content style={{ minWidth: "100%", overflow: "auto" }}>
        <Row justify={"space-evenly"}>
          <Col span={10}>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                width: "100%",
              }}
            >
              <Slider
                style={{ width: "80%" }}
                min={3}
                max={10}
                onChange={onChange}
                value={cellNum}
              />
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "center",
                width: "100%",
              }}
            >
              <p>基底色</p>
            </div>
            
            <Row justify={"space-evenly"}>{buttons}</Row>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                width: "100%",
              }}
            >
              <Stage
                width={cellSize * (cellNum + 1)}
                height={cellSize * (cellNum + 1)}
              >
                <Layer>{rows}</Layer>
              </Stage>
            </div>
          </Col>
          <Col span={14}>
            <CA q={cellNum} colors={buttonColors} />
          </Col>
        </Row>
      </Content>
    </Layout>
  );
}

export default App;
