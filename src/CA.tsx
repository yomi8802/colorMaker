import { useState } from "react";
import { Config } from "./VFCA";
import { Rgb } from "./CellRender";
import { Col, Divider, Flex, Row, Space, Typography } from "antd";
import { Layer, Rect, Stage } from "react-konva";

type CAProp = {
  config: Config;
};

const { Text } = Typography;

export const CA = ({ config }: CAProp) => {
  const { q, n, rule, firstRow, cellRender, showDetail } = config;
  const [expanded, setExpanded] = useState(false);
  const initialCellData = {
    i: 0,
    j: 0,
    u: new Array(q).fill(0),
    color: { r: 0, g: 0, b: 0 },
  };
  const [cellData, setCellData] = useState(initialCellData);
  const ruleNum = Array.from({ length: q ** 3 }).map((_, i) => {
    const num = i >= rule.length ? 0 : Number(rule[i]);
    return num;
  });
  const ruleArray = Array.from({ length: q ** 3 }).map((_, i) => {
    const tempArray = new Array(q).fill(0);
    tempArray[ruleNum[i]] = 1;
    return tempArray;
  });
  const cellSize = 15;

  //Uの初期値設定
  const U: number[][][] = [];
  U.push(firstRow);

  //時間ステップ
  for (let i = 0; i < n - 1; i++) {
    //列
    const row = [];
    for (let j = 0; j < n; j++) {
      //セル
      const cell = new Array(q).fill(0);
      for (let l = 0; l < q; l++) {
        let left = j - 1;
        let right = j + 1;
        if (j === 0) {
          left = n - 1;
        } else if (j === n - 1) {
          right = 0;
        }

        for (let a = 0; a < q; a++) {
          for (let b = 0; b < q; b++) {
            for (let c = 0; c < q; c++) {
              const idx = a * q ** 2 + b * q + c;
              if (ruleArray[idx] !== undefined) {
                cell[l] =
                  cell[l] +
                  ruleArray[idx][l] *
                    U[i][left][a] *
                    U[i][j][b] *
                    U[i][right][c];
              }
            }
          }
        }
      }
      row.push(cell);
    }
    U.push(row);
  }

  //図形作成
  const rects = [];
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      const cellColor = cellRender(U[i][j]);

      const colorStyle = `rgb(${cellColor.r}, ${cellColor.g}, ${cellColor.b})`;
      const formattedU = U[i][j].map((num) => num.toFixed(2)).join(", "); //桁数が多すぎるので小数点以下2桁で丸める
      rects.push({
        id: `${i}-${j}`,
        x: cellSize / 2 + cellSize * j,
        y: cellSize / 2 + cellSize * i,
        width: cellSize,
        height: cellSize,
        color: cellColor,
        fill: colorStyle,
        text: `U: ${formattedU}\nColor: rgb(${cellColor.r.toFixed(2)}, ${cellColor.g.toFixed(2)}, ${cellColor.b.toFixed(2)})`,
      });
    }
  }

  const handleClick = (id: string, color: Rgb) => {
    const parts = id.split("-");
    const i = parseInt(parts[0], 10);
    const j = parseInt(parts[1], 10);

    setCellData({ i: i + 1, j: j + 1, u: U[i][j], color: color });
  };

  return (
    <>
      <Flex justify="center" align="center" vertical>
        <Stage width={cellSize * (n + 1)} height={cellSize * (n + 1)}>
          <Layer>
            {rects.map((rect) => (
              <Rect
                key={rect.id}
                x={rect.x}
                y={rect.y}
                width={rect.width}
                height={rect.height}
                fill={rect.fill}
                onClick={() => handleClick(rect.id, rect.color)}
                onTouchStart={() => handleClick(rect.id, rect.color)}
              />
            ))}
          </Layer>
        </Stage>
        {rule.length < 30 ? (
          <>
            <a>ルール番号</a>
            <Typography.Paragraph copyable>{rule}</Typography.Paragraph>
          </>
        ) : (
          <>
            <a>ルール番号</a>
            <Typography.Paragraph
              style={{ width: "60%" }}
              ellipsis={{
                rows: 1, // 表示する行数
                expandable: "collapsible",
                expanded: expanded,
                onExpand: (_, info) => setExpanded(info.expanded),
              }}
              copyable
            >
              {rule}
            </Typography.Paragraph>
          </>
        )}
      </Flex>
      {showDetail && (
        <>
          <Divider />
          <Row align={"middle"} justify={"center"}>
            <Col span={18}>
              <Space style={{ width: "100%" }} direction="vertical">
                <Text strong>Cell Detail</Text>
                <Text>
                  i : {cellData.i} &nbsp;&nbsp; j : {cellData.j}
                </Text>
                <Text>U : {cellData.u.map((num) => num.toFixed(2)).join(", ")}</Text>
                <Text>
                  RGB :{" "}
                  {`${cellData.color.r.toFixed(2)}, ${cellData.color.g.toFixed(2)}, ${cellData.color.b.toFixed(2)}`}
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
                    fill={`rgb(${cellData.color.r}, ${cellData.color.g}, ${cellData.color.b})`}
                    stroke={"black"}
                  />
                </Layer>
              </Stage>
            </Col>
          </Row>
        </>
      )}
    </>
  );
};
