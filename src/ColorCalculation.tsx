import { Rgb, Hsv } from "./App.tsx";
import { useAppState } from "./hooks.tsx";

//HSVからRGBに変換する関数.
export const HSV2RGB = (hsv: Hsv) => {
  const H = hsv.h / 60;
  const C = hsv.v * hsv.s; // 彩度と明度から色の強度を計算
  const X = C * (1 - Math.abs((H % 2) - 1));
  const m = hsv.v - C;

  let rgbColor = { r: 0, g: 0, b: 0 };

  if (0 <= H && H < 1) {
    rgbColor = { r: C, g: X, b: 0 };
  } else if (1 <= H && H < 2) {
    rgbColor = { r: X, g: C, b: 0 };
  } else if (2 <= H && H < 3) {
    rgbColor = { r: 0, g: C, b: X };
  } else if (3 <= H && H < 4) {
    rgbColor = { r: 0, g: X, b: C };
  } else if (4 <= H && H < 5) {
    rgbColor = { r: X, g: 0, b: C };
  } else if (5 <= H && H <= 6) {
    rgbColor = { r: C, g: 0, b: X };
  }

  // 全成分にmを加えて最終的なRGB値を0-255の範囲に調整
  rgbColor.r = Math.round((rgbColor.r + m) * 255);
  rgbColor.g = Math.round((rgbColor.g + m) * 255);
  rgbColor.b = Math.round((rgbColor.b + m) * 255);

  return rgbColor;
};

export const RGB2HSV = (rgb: Rgb) => {
  const { r, g, b } = rgb;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);

  const hsvColor: Hsv = { h: 0, s: 0, v: 0 };

  if (max === min) {
    hsvColor.h = 0; //max-min = 0のときは色相は関係ないので適当に
  } else if (min == r) {
    hsvColor.h = ((60 * (b - g)) / (max - min) + 180) % 360;
  } else if (min == g) {
    hsvColor.h = ((60 * (r - b)) / (max - min) + 300) % 360;
  } else if (min == b) {
    hsvColor.h = ((60 * (g - r)) / (max - min) + 60) % 360;
  }

  hsvColor.s = max - min;
  hsvColor.v = max;

  return hsvColor;
}

export const returnH = (rgb: Rgb) => {
  const { r, g, b } = rgb;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);

  let h = 0;

  if (max === min) {
    h = 0; //max-min = 0のときは色相は関係ないので適当に
  } else if (min == r) {
    h = ((60 * (b - g)) / (max - min) + 180) % 360;
  } else if (min == g) {
    h = ((60 * (r - b)) / (max - min) + 300) % 360;
  } else if (min == b) {
    h = ((60 * (g - r)) / (max - min) + 60) % 360;
  }

  return h;
}

//RGB→HSV→RGBと変換し、明度を1に変換する.
export const RGBValueVar = (rgb: Rgb, value: number[]) => {
  const { q } = useAppState();

  //RGB→HSV
  const hsvColor = RGB2HSV(rgb);

  //0.5,0.5の行列
  const maxValue = new Array(q).fill(0);
  maxValue[0] = 0.5;
  maxValue[1] = 0.5;

  //0.5,0.5までvが1になるように補間
  hsvColor.v =
    Math.max(Math.min(Variance(value) / Variance(maxValue), 1), 0);

  //HSV→RGBして返す
  return HSV2RGB(hsvColor);
};

//色の合成
export const MixRGB = (firstColor: Rgb, secondColor: Rgb) => {
  const mixColor: Rgb = {
    r: ((firstColor.r + secondColor.r) * 0.5) / 255,
    g: ((firstColor.g + secondColor.g) * 0.5) / 255,
    b: ((firstColor.b + secondColor.b) * 0.5) / 255,
  };

  const { q } = useAppState();

  const Value = new Array(q).fill(0);
  Value[0] = 0.5;
  Value[1] = 0.5;

  //合成した色の明度を1に変換して返す
  return RGBValueVar(mixColor, Value);
};

//分散計算
const Variance = (arr: number[]) => {
  if (arr.length === 0) {
    throw new Error("配列が空です。");
  }

  const mean = arr.reduce((sum, value) => sum + value, 0) / arr.length;
  const squaredDiffs = arr.map((value) => (value - mean) ** 2);
  const variance =
    squaredDiffs.reduce((sum, value) => sum + value, 0) / arr.length;

  return variance;
};
