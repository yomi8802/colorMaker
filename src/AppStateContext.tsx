import React, { createContext, useState, ReactNode, useCallback } from 'react';
import { Rgb } from './App';

// 異なる型を持つデータを管理するための Context の型定義
interface AppStateContextType {
  n: number;
  setN: (num: number) => void;
  nMax: number;
  setNMax: (num: number) => void;
  q: number;
  setQ: (num: number) => void;
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
  const [n, setN] = useState<number>(20);
  const [nMax, setNMax] = useState<number>(20);
  const [q, setQ] = useState<number>(3);

  const initialColor: Rgb = { r: 255, g: 0, b: 0 };

  const [buttonColors, setButtonColorsArray] = useState<Array<Rgb>>(
    Array(q).fill(initialColor)
  );

  const setButtonColors = useCallback((i: number, color: Rgb) => {
    setButtonColorsArray(prev => {
      const newColors = [...prev];
      newColors[i] = color;
      return newColors;
    });
  },[]);

  const setButtonColorsWhole = (newColors: Rgb[]) => {
    setButtonColorsArray(newColors);
  }

  return (
    <AppStateContext.Provider value={{ n, setN, nMax, setNMax, q, setQ, buttonColors, setButtonColors, setButtonColorsWhole }}>
      {children}
    </AppStateContext.Provider>
  );
};
