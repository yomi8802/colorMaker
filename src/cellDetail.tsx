import { Rgb } from "./App";
import { Divider, Space, Typography, Row, Col } from "antd";
import { Stage, Layer, Rect } from "react-konva";

type CellData = {
  i: number;
  j: number;
  u: number[];
  color: Rgb;
};

const { Text } = Typography;

const CellDetail = ({ i, j, u, color }: CellData) => {
  return (
    <>
      <Divider />
      <Row align={"middle"} justify={"center"}>
        <Col span={18}>
          <Space style={{ width: "100%" }} direction="vertical">
            <Text strong>Cell Detail</Text>
            <Text>
              i : {i} &nbsp;&nbsp; j : {j}
            </Text>
            <Text>U : {u.map((num) => num.toFixed(2)).join(", ")}</Text>
            <Text>
              RGB :{" "}
              {`${color.r.toFixed(2)}, ${color.g.toFixed(2)}, ${color.b.toFixed(2)}`}
            </Text>
          </Space>
        </Col>
        <Col span={4}>
          <Stage width={50} height={50}>
            <Layer>
              <Rect
                x={0}
                y={0}
                width={50}
                height={50}
                fill={`rgb(${color.r}, ${color.g}, ${color.b})`}
                stroke={"black"}
              />
            </Layer>
          </Stage>
        </Col>
      </Row>
    </>
  );
};

export default CellDetail;
