import { useState } from "react";
import { Stage, Rect, Layer } from "react-konva";
import { Rgb } from "./App";
import { Config } from "./Config";

type Prop = {
  q: number; //状態数
  colors: Rgb[]; //基底色
};

export const CA = (props: Prop) => {
  const N = 20; //セルの幅
  const Nmax = 20; //最大時間ステップ

  const [B, setB] = useState<Array<Array<number>>>(Array(props.q).fill(0));

  //ColorPickerが操作するための関数
  const handleBChange = (newValue: number[][]) => {
    setB(newValue);
  };

  //ランダムルール設定
  for (let i = 0; i < props.q ** 3; i++) {
    const temp = new Array(props.q).fill(0); //q成分の配列作成
    temp[Math.round(Math.random() * (props.q - 1))] = 1; //ランダムの１成分のみ1を立てる
    B.push(temp);
  }

  //Uの初期値設定
  const U = [];
  const firstRow = [];
  //各列ごと作成
  for (let i = 0; i < N; i++) {
    let cell = new Array(props.q); //q成分の配列作成

    //全成分に0~1のランダム値を代入
    for (let j = 0; j < props.q; j++) {
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

    firstRow.push(cell);
  }
  U.push(firstRow);

  //時間ステップ
  for (let i = 0; i < Nmax - 1; i++) {
    //列
    const row = [];
    for (let j = 0; j < N; j++) {
      //セル
      const cell = new Array(props.q).fill(0);
      for (let l = 0; l < props.q; l++) {
        let left = j - 1;
        let right = j + 1;
        if (j === 0) {
          left = N - 1;
        } else if (j === N - 1) {
          right = 0;
        }

        for (let a = 0; a < props.q; a++) {
          for (let b = 0; b < props.q; b++) {
            for (let c = 0; c < props.q; c++) {
              const idx = a * props.q ** 2 + b * props.q + c;
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

  const cellSize = 20;
  const cellColor: Rgb = { r: 0, g: 0, b: 0 };
  for (let l = 0; l < props.q; l++) {
    cellColor.r = cellColor.r + U[0][0][l] * props.colors[l].r;
    cellColor.g = cellColor.g + U[0][0][l] * props.colors[l].g;
    cellColor.b = cellColor.b + U[0][0][l] * props.colors[l].b;
  }

  const rows = [];
  for (let i = 0; i < N; i++) {
    for (let j = 0; j < Nmax; j++) {
      const cellColor: Rgb = { r: 0, g: 0, b: 0 };
      for (let l = 0; l < props.q; l++) {
        cellColor.r = cellColor.r + U[i][j][l] * props.colors[l].r;
        cellColor.g = cellColor.g + U[i][j][l] * props.colors[l].g;
        cellColor.b = cellColor.b + U[i][j][l] * props.colors[l].b;
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
      <Config q={props.q} handleBChange={handleBChange} />
      <div style={{ display: "flex", justifyContent: "center" }}>
      <Stage width={cellSize * (N + 1)} height={cellSize * (Nmax + 1)}>
        <Layer>{rows}</Layer>
      </Stage>
      </div>
    </>
  );
};
