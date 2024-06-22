import React, { createContext, useState, ReactNode, useCallback } from 'react';
import { Rgb } from './App';

// アプリ全体からアクセスできる変数群
interface AppStateContextType {
  n: number;
  setN: (num: number) => void;
  nMax: number;
  setNMax: (num: number) => void;
  q: number;
  setQ: (num: number) => void;
  rule: string;
  setRule: (text: string) => void;
  minCorrect: number;
  setMinCorrect: (num: number) => void;
  buttonColors: Array<Rgb>;
  setButtonColors: (i: number, color: Rgb) => void;
  setButtonColorsWhole: (colors: Rgb[]) => void;
}

export const AppStateContext = createContext<AppStateContextType | undefined>(undefined);

// Provider コンポーネントの作成
interface AppStateProviderProps {
  children: ReactNode;
}

export const AppStateProvider: React.FC<AppStateProviderProps> = ({ children }) => {
  const [n, setN] = useState(20);
  const [nMax, setNMax] = useState(20);
  const [q, setQ] = useState(3);
  const [rule, setRule] = useState("0");
  const [minCorrect, setMinCorrect] = useState(0.3);

  const initialColor: Rgb = { r: 255, g: 0, b: 0 };

  const [buttonColors, setButtonColorsArray] = useState<Array<Rgb>>(
    Array(q).fill(initialColor)
  );

  //各ボタンごとに色を設定
  const setButtonColors = useCallback((i: number, color: Rgb) => {
    setButtonColorsArray(prev => {
      const newColors = [...prev];
      newColors[i] = color;
      return newColors;
    });
  },[]);

  //ボタン全体の色を設定
  const setButtonColorsWhole = (newColors: Rgb[]) => {
    setButtonColorsArray(newColors);
  }

  //valueの内容はアプリ全体からアクセス可能
  return (
    <AppStateContext.Provider value={{ n, setN, nMax, setNMax, q, setQ, rule, setRule, minCorrect, setMinCorrect, buttonColors, setButtonColors, setButtonColorsWhole }}>
      {children}
    </AppStateContext.Provider>
  );
};
