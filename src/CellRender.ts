import { Config } from "./VFCA.tsx";

export type Rgb = {
  r: number;
  g: number;
  b: number;
};

export type Hsv = {
  h: number;
  s: number;
  v: number;
};

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

//RGBからHSVに変換する関数.
//RGBは0~1値.
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
};

//状態値から色を計算する関数
export const CellRender = ({ q, k, baseColor, completionType }: Config) => {
  return (state: number[]) => {
    let rgbColor = { r: 0, g: 0, b: 0 };
    switch (completionType) {
      case 1: {
        rgbColor = state.reduce<Rgb>(
          (acc, u, i) => {
            acc.r += u * baseColor[i].r;
            acc.g += u * baseColor[i].g;
            acc.b += u * baseColor[i].b;
            return acc;
          },
          { r: 0, g: 0, b: 0 }
        );
        break;
      }
      case 2: {
        const tempRgbColor = state.reduce<Rgb>(
          (acc, u, i) => {
            acc.r += u * baseColor[i].r / 255;
            acc.g += u * baseColor[i].g / 255;
            acc.b += u * baseColor[i].b / 255;
            return acc;
          },
          { r: 0, g: 0, b: 0 }
        );
        const hsvColor = RGB2HSV(tempRgbColor);
        const borderArray = Array.from({ length: q }).map((_, i) => {
          return i === 0 ? 0.5 : 0.5 / (q - 1);
        });
        hsvColor.v = Math.max(Math.min(Variance(state) / Variance(borderArray), 1), 0);
        rgbColor = HSV2RGB(hsvColor);
        break;
      }
      case 3: {
        rgbColor = state.reduce<Rgb>(
          (acc, u, i) => {
            acc.r += (Math.exp(k * (u - 1) / u) * baseColor[i].r);
            acc.g += (Math.exp(k * (u - 1) / u) * baseColor[i].g);
            acc.b += (Math.exp(k * (u - 1) / u) * baseColor[i].b);
            return acc;
          },
          { r: 0, g: 0, b: 0 }
        );
        break;
      }
    }
    return rgbColor;
  };
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
