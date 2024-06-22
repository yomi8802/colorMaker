import { Rgb } from "./App";
import { Divider, Space, Typography } from "antd";

type CellData = {
    i: number;
    j: number;
    u: number[];
    color: Rgb;
  }

const {Text} = Typography;

const CellDetail = ({i, j, u, color}: CellData) => {
    return (
      <Space style={{width: "100%"}} direction="vertical">
        <Divider />
        <Text strong>Cell Detail</Text>
        <Text>i : {i} &nbsp;&nbsp; j : {j}</Text>
        <Text>U : {u.map((num) => num.toFixed(2)).join(", ")}</Text>
        <Text>RGB : {`${color.r.toFixed(2)}, ${color.g.toFixed(2)}, ${color.b.toFixed(2)}`}</Text>
      </Space>
    );
  };

export default CellDetail;