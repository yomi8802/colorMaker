import React, { createContext, useState, ReactNode } from 'react';
import { Rgb } from './App';

// アプリ全体からアクセスできる変数群
interface AppStateContextType {
  n: number;
  setN: (num: number) => void;
  nMax: number;
  setNMax: (num: number) => void;
  q: number;
  setQ: (num: number) => void;
  buttonColors: Array<Rgb>;
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

  const initialColor: Rgb = { r: 255, g: 0, b: 0 };

  const [buttonColors, setButtonColorsArray] = useState<Array<Rgb>>(
    Array(q).fill(initialColor)
  );

  const setButtonColorsWhole = (newColors: Rgb[]) => {
    setButtonColorsArray(newColors);
  }

  return (
    <AppStateContext.Provider value={{ n, setN, nMax, setNMax, q, setQ, buttonColors, setButtonColorsWhole }}>
      {children}
    </AppStateContext.Provider>
  );
};
