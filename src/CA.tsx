import { useState } from "react";
import { Stage, Rect, Layer, Text, Group } from "react-konva";
import { KonvaEventObject } from "konva/lib/Node";
import { Rgb } from "./App";
import { Config } from "./Config";
import { RGBValueVar } from "./ColorCalculation";
import { useAppState } from "./hooks";

interface Tooltip {
  visible: boolean;
  x: number;
  y: number;
  text: string;
}

export const CA = () => {
  const { n, nMax, q, buttonColors } = useAppState();
  const [B, setB] = useState<Array<Array<number>>>(Array(q).fill(0));
  const [isChangeFirstRow, setChangeFirstRow] = useState(true);
  const [correctNum, setCorrectNum] = useState(1);
  const [firstRow, setFirstRow] = useState(() => {
    const initialArray = new Array(n)
      .fill(null)
      .map(() => new Array(q).fill(0));
    return initialArray;
  });
  const [tooltip, setTooltip] = useState<Tooltip>({
    visible: false,
    x: 0,
    y: 0,
    text: "",
  });
  const cellSize = 15;

  //ColorPickerが操作するための関数
  const handleBChange = (newValue: number[][]) => {
    setB(newValue);
  };

  if (isChangeFirstRow) {
    const tempFirstRow: number[][] = [];
    //各列ごと作成
    for (let i = 0; i < n; i++) {
      let cell: number[] = new Array(q); //q成分の配列作成

      //全成分に0~1のランダム値を代入
      for (let j = 0; j < q; j++) {
        cell[j] = Math.random();
      }

      //全成分の合計値を計算
      const totalState = cell.reduce((acc: number, val: number): number => {
        return acc + val;
      }, 0);

      //各成分を合計値で割って成分の和が1になるように調整
      cell = cell.map((d: number): number => {
        return d / totalState;
      });

      tempFirstRow.push(cell);
    }
    setFirstRow(tempFirstRow);
    setChangeFirstRow(false);
  }

  //ランダムルール設定
  for (let i = 0; i < q ** 3; i++) {
    const temp = new Array(q).fill(0); //q成分の配列作成
    temp[Math.round(Math.random() * (q - 1))] = 1; //ランダムの１成分のみ1を立てる
    B.push(temp);
  }

  //ツールチップ用
  const handleMouseEnter = (e: KonvaEventObject<MouseEvent>, text: string) => {
    const shape = e.target;
    const stage = shape.getStage();
    if (stage) {
      const mousePos = stage.getPointerPosition();
      if (mousePos) {
        const tooltipX = mousePos.x + 10;
        const tooltipY = mousePos.y + 10;
        const stageWidth = stage.width();
        const stageHeight = stage.height();
        const tooltipWidth =
          Math.max(...text.split("\n").map((line) => line.length)) * 10;
        const tooltipHeight = text.split("\n").length * 20;

        // stage内に収まるように座標設定
        const adjustedX =
          tooltipX + tooltipWidth > stageWidth
            ? stageWidth - tooltipWidth - 10
            : tooltipX;
        const adjustedY =
          tooltipY + tooltipHeight > stageHeight
            ? stageHeight - tooltipHeight - 10
            : tooltipY;

        setTooltip({
          visible: true,
          x: adjustedX,
          y: adjustedY,
          text,
        });
      }
    }
  };

  const handleMouseLeave = () => {
    setTooltip({
      visible: false,
      x: 0,
      y: 0,
      text: "",
    });
  };

  //Uの初期値設定
  const U: number[][][] = [];
  U.push(firstRow);
  //console.log(U);

  //時間ステップ
  for (let i = 0; i < nMax - 1; i++) {
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
              cell[l] =
                cell[l] +
                B[idx][l] * U[i][left][a] * U[i][j][b] * U[i][right][c];
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
    for (let j = 0; j < nMax; j++) {
      let cellColor: Rgb = { r: 0, g: 0, b: 0 };
      for (let l = 0; l < q; l++) {
        cellColor.r += (U[i][j][l] * buttonColors[l].r);
        cellColor.g += (U[i][j][l] * buttonColors[l].g);
        cellColor.b += (U[i][j][l] * buttonColors[l].b);
      }

      //分散で補間
      if (correctNum === 2) {
        cellColor.r /= 255;
        cellColor.g /= 255;
        cellColor.b /= 255;
        cellColor = RGBValueVar(cellColor, U[i][j]);
      }

      const colorStyle = `rgb(${cellColor.r}, ${cellColor.g}, ${cellColor.b})`;
      const formattedU = U[i][j].map((num) => num.toFixed(2)).join(", "); //桁数が多すぎるので小数点以下2桁で丸める
      rects.push({
        id: `${i}-${j}`,
        x: cellSize / 2 + cellSize * j,
        y: cellSize / 2 + cellSize * i,
        width: cellSize,
        height: cellSize,
        fill: colorStyle,
        text: `U: ${formattedU}\nColor: rgb(${cellColor.r.toFixed(2)}, ${cellColor.g.toFixed(2)}, ${cellColor.b.toFixed(2)})`,
      });
    }
  }

  return (
    <>
      <Config
        handleBChange={handleBChange}
        setChangeFirstRow={setChangeFirstRow}
        setCorrectNum={setCorrectNum}
      />
      <div style={{ display: "flex", justifyContent: "center" }}>
        <Stage width={cellSize * (n + 1)} height={cellSize * (nMax + 1)}>
          <Layer>
            {rects.map((rect) => (
              <Rect
                key={rect.id}
                x={rect.x}
                y={rect.y}
                width={rect.width}
                height={rect.height}
                fill={rect.fill}
                onMouseEnter={(e) => handleMouseEnter(e, rect.text)}
                onMouseLeave={handleMouseLeave}
              />
            ))}
            {tooltip.visible && (
              <Group x={tooltip.x + 50} y={tooltip.y}>
                <Rect
                  width={
                    Math.max(
                      ...tooltip.text.split("\n").map((line) => line.length)
                    ) * 10
                  }
                  height={tooltip.text.split("\n").length * 20}
                  fill="white"
                  cornerRadius={5}
                />
                <Text
                  text={tooltip.text}
                  fontSize={15}
                  fill="black"
                  padding={5}
                />
              </Group>
            )}
          </Layer>
        </Stage>
      </div>
    </>
  );
};
