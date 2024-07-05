import { useLayoutEffect, useState } from "react";
import { Layout, Col, Row, Grid, Divider } from "antd";
import { Content } from "antd/es/layout/layout";
import ColorButtons from "./ColorButtons";
import { CA } from "./CA.tsx";
import { useWindowSize } from "./hooks";
import BaseColorMat from "./BaseColorMat.tsx";
import { CellRender, Rgb } from "./CellRender.ts";
import EditConfig from "./EditConfig.tsx";
import QSlider from "./QSlider.tsx";

export type Config = {
  q: number;
  n: number;
  rule: string;
  firstRow: number[][];
  baseColor: Rgb[];
  showDetail: boolean;
  minV: number;
  k: number;
  completionType: number;
  cellRender: (state: number[]) => Rgb;
};

const { useBreakpoint } = Grid;

export const VFCA = () => {
  const initialConfig = {
    q: 3,
    n: 20,
    rule: "0",
    firstRow: [] as number[][],
    baseColor: [] as Rgb[],
    showDetail: false,
    minV: 0,
    k: 1,
    completionType: 1,
    cellRender: (state: number[]) => CellRender(initialConfig)(state),
  };

  const initialFirstRow: number[][] = [];
  for (let i = 0; i < initialConfig.n; i++) {
    let cell: number[] = new Array(initialConfig.q);

    for (let j = 0; j < initialConfig.q; j++) {
      cell[j] = Math.random();
    }

    const totalState = cell.reduce((acc, val) => acc + val, 0);

    cell = cell.map((d) => d / totalState);

    initialFirstRow.push(cell);
  }

  const initialColor = { r: 255, g: 0, b: 0 };

  initialConfig.firstRow = initialFirstRow;
  initialConfig.baseColor = new Array(initialConfig.q).fill(initialColor);

  const [config, setConfig] = useState(initialConfig);
  const screen = useBreakpoint();
  const [width, height] = useWindowSize();
  const [cellSize, setCellSize] = useState(0);

  useLayoutEffect(() => {
    const newSize =
      width < height
        ? Math.min(width / ((config.q + 1) * 2), 50)
        : Math.min(height / ((config.q + 1) * 2), 50);

    if (cellSize !== newSize) {
      setCellSize(newSize);
    }
  }, [width, height, config.q, cellSize]);

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Content style={{ padding: "24px", minHeight: "280px", width: "100%" }}>
        {screen.md ? (
          <Row justify={"space-evenly"}>
            <Col span={12}>
              <QSlider config={config} setConfig={setConfig} />
              <ColorButtons
                config={config}
                cellSize={cellSize}
                setConfig={setConfig}
              />
              <BaseColorMat config={config} cellSize={cellSize} />
            </Col>

            <Col span={11}>
              <EditConfig config={config} setConfig={setConfig} />
              <CA config={config} />
            </Col>
          </Row>
        ) : (
          <Row justify={"space-evenly"}>
            <Col span={24}>
              <QSlider config={config} setConfig={setConfig} />
              <ColorButtons
                config={config}
                cellSize={cellSize}
                setConfig={setConfig}
              />
              <BaseColorMat config={config} cellSize={cellSize} />
            </Col>

            <Divider />

            <Col span={24}>
              <EditConfig config={config} setConfig={setConfig} />
              <CA config={config} />
            </Col>
          </Row>
        )}
      </Content>
    </Layout>
  );
};
