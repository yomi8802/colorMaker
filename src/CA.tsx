import { useState } from "react";
import { Flex } from "antd";
import { Stage, Rect, Layer } from "react-konva";
import { Config } from "./Config";
import { RGBValueVar } from "./ColorCalculation";
import { useAppState } from "./hooks";
import CellDetail from "./cellDetail";
import { Rgb } from "./App";
import RuleNum from "./RuleNum";

export const CA = () => {
  const { n, nMax, q, buttonColors } = useAppState();
  const [B, setB] = useState<Array<Array<number>>>(Array(q).fill(0));
  const [isChangeFirstRow, setChangeFirstRow] = useState(true);
  const [showDetail, setShowDetail] = useState(false);
  const [cellData, setCellData] = useState({
    i: 0,
    j: 0,
    u: new Array(q).fill(0),
    color: { r: 0, g: 0, b: 0 },
  });
  const [correctNum, setCorrectNum] = useState(1);
  const [firstRow, setFirstRow] = useState(() => {
    const initialArray = new Array(n)
      .fill(null)
      .map(() => new Array(q).fill(0));
    return initialArray;
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
      let cellColor = { r: 0, g: 0, b: 0 };
      for (let l = 0; l < q; l++) {
        cellColor.r += U[i][j][l] * buttonColors[l].r;
        cellColor.g += U[i][j][l] * buttonColors[l].g;
        cellColor.b += U[i][j][l] * buttonColors[l].b;
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

  const resetDetail = () => {
    const defaultU = new Array(q).fill(0);
    const defaultColor = { r: 0, g: 0, b: 0 };
    setCellData({ i: 0, j: 0, u: defaultU, color: defaultColor });
  };

  return (
    <>
      <Config
        handleBChange={handleBChange}
        setChangeFirstRow={setChangeFirstRow}
        setCorrectNum={setCorrectNum}
        setShowDetail={setShowDetail}
        resetDetail={resetDetail}
      />
      <Flex justify="center" align="center" vertical>
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
                onClick={() => handleClick(rect.id, rect.color)}
                onTouchStart={() => handleClick(rect.id, rect.color)} // モバイルデバイス用
              />
            ))}
          </Layer>
        </Stage>
        <RuleNum />
      </Flex>
      {showDetail && <CellDetail {...cellData} />}
    </>
  );
};
