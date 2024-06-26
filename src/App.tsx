import { useState, useLayoutEffect } from "react";
import { Layout, Slider, Col, Row, Grid, Divider, Flex } from "antd";
import { Content } from "antd/es/layout/layout";
import { Layer, Rect, Stage } from "react-konva";
import ColorButton from "./ColorButton";
import EvenlySpaceButton from "./EvenlySpaceButton.tsx";
import { MixRGB } from "./ColorCalculation";
import { CA } from "./CA.tsx";
import { useWindowSize, useAppState } from "./hooks";

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

const { useBreakpoint } = Grid;

const App = () => {
  const { q, setQ, buttonColors, setButtonColorsWhole } = useAppState();

  const initialColor: Rgb = { r: 255, g: 0, b: 0 };

  const screen = useBreakpoint();

  const onChange = (newValue: number) => {
    setQ(newValue);
    let newColors = [...buttonColors]; // 現在の色配列のコピーを作成

    if (newValue < buttonColors.length) {
      newColors = newColors.slice(0, newValue); // 新しい値が現在の長さより小さい場合、配列を切り詰める
    } else {
      while (newColors.length < newValue) {
        newColors.push(initialColor); // 新しい値が現在の長さより大きい場合、初期色で拡張
      }
    }

    setButtonColorsWhole(newColors); // 更新された配列を setButtonColorsWhole に渡す
  };

  const [width, height] = useWindowSize();

  const [cellSize, setCellSize] = useState(0);
  useLayoutEffect(() => {
    if (width < height) {
      setCellSize(Math.min(width / ((q + 1) * 2), 50));
    } else {
      setCellSize(Math.min(height / ((q + 1) * 2), 50));
    }
  }, [width, height, q]);

  const rows = [];
  for (let i = 0; i < q; i++) {
    for (let j = 0; j < q; j++) {
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
  for (let i = 0; i < q; i++) {
    buttons.push(
      <Col
        key={i}
        span={Math.round(18 / q)}
        style={{ display: "flex", justifyContent: "center" }}
      >
        <ColorButton cellNum={i} cellSize={cellSize} />
      </Col>
    );
  }

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Content style={{ padding: "24px", minHeight: "280px", width: "100%" }}>
        {screen.md ? (
          <Row justify={"space-evenly"}>
            <Col span={12}>
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
                  value={q}
                />
              </Flex>

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
                    <EvenlySpaceButton />
                  </Flex>
                </Col>
              </Row>

              <Row justify={"center"}>{buttons}</Row>
              <Flex
                style={{
                  width: "100%",
                }}
                justify="space-evenly"
                align="center"
              >
                <Stage width={cellSize * (q + 1)} height={cellSize * (q + 1)}>
                  <Layer>{rows}</Layer>
                </Stage>
              </Flex>
            </Col>
            <Col span={11}>
              <CA />
            </Col>
          </Row>
        ) : (
          <Row justify={"space-evenly"}>
            <Col span={24}>
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
                  value={q}
                />
              </Flex>

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
                    <EvenlySpaceButton />
                  </Flex>
                </Col>
              </Row>

              <Row justify={"space-evenly"}>{buttons}</Row>
              <Flex
                style={{
                  width: "100%",
                }}
                justify="space-evenly"
                align="center"
              >
                <Stage width={cellSize * (q + 1)} height={cellSize * (q + 1)}>
                  <Layer>{rows}</Layer>
                </Stage>
              </Flex>
            </Col>
            <Divider />
            <Col span={24}>
              <CA />
            </Col>
          </Row>
        )}
      </Content>
    </Layout>
  );
};

export default App;
