import { useState } from "react";
import { Stage, Rect, Layer } from "react-konva";
import { Rgb } from "./App";
import { Config } from "./Config";
import { useAppState } from "./hooks";

export const CA = () => {
  const { n, nMax, q, buttonColors } = useAppState();
  const [B, setB] = useState<Array<Array<number>>>(Array(q).fill(0));
  const [isChangeFirstRow, setChangeFirstRow] = useState(true);
  const [firstRow, setFirstRow] = useState(() => {
    const initialArray = new Array(n).fill(null).map(() => new Array(q).fill(0));
    return initialArray;
  });

  //ColorPickerが操作するための関数
  const handleBChange = (newValue: number[][]) => {
    setB(newValue);
  };

  if (isChangeFirstRow) {
    console.log(isChangeFirstRow);
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
    console.log(isChangeFirstRow);
    console.log(tempFirstRow);
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

  const cellSize = 15;
  const cellColor: Rgb = { r: 0, g: 0, b: 0 };
  for (let l = 0; l < q; l++) {
    cellColor.r = cellColor.r + U[0][0][l] * buttonColors[l].r;
    cellColor.g = cellColor.g + U[0][0][l] * buttonColors[l].g;
    cellColor.b = cellColor.b + U[0][0][l] * buttonColors[l].b;
  }

  const rows = [];
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < nMax; j++) {
      const cellColor: Rgb = { r: 0, g: 0, b: 0 };
      for (let l = 0; l < q; l++) {
        cellColor.r = cellColor.r + U[i][j][l] * buttonColors[l].r;
        cellColor.g = cellColor.g + U[i][j][l] * buttonColors[l].g;
        cellColor.b = cellColor.b + U[i][j][l] * buttonColors[l].b;
      }
      const colorStyle: string = `rgb(${cellColor.r}, ${cellColor.g}, ${cellColor.b})`;
      rows.push(
        <Rect
          fill={colorStyle}
          x={cellSize / 2 + cellSize * j}
          y={cellSize / 2 + cellSize * i}
          width={cellSize}
          height={cellSize}
          key={`${i}-${j}`}
        />
      );
    }
  }

  return (
    <>
      <Config
        handleBChange={handleBChange}
        setChangeFirstRow={setChangeFirstRow}
      />
      <div style={{ display: "flex", justifyContent: "center" }}>
        <Stage width={cellSize * (n + 1)} height={cellSize * (nMax + 1)}>
          <Layer>{rows}</Layer>
        </Stage>
      </div>
    </>
  );
};
