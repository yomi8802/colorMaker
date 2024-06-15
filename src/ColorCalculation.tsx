import { Rgb, Hsv } from "./App.tsx";

//HSVからRGBに変換する関数. 
export const HSV2RGB = (hsv: Hsv) => {
  const H: number = hsv.h / 60;
  const X: number = 1 - Math.abs((H % 2) - 1);

  let rgbColor: Rgb = { r: 0, g: 0, b: 0 };

  if (0 <= H && H < 1) {
    rgbColor = {
      r: (hsv.s + 1 - hsv.s) * 255,
      g: (X + 1 - hsv.s) * 255,
      b: (0 + 1 - hsv.s) * 255,
    };
  } else if (1 <= H && H < 2) {
    rgbColor = {
      r: (X + 1 - hsv.s) * 255,
      g: (hsv.s + 1 - hsv.s) * 255,
      b: (0 + 1 - hsv.s) * 255,
    };
  } else if (2 <= H && H < 3) {
    rgbColor = {
      r: (0 + 1 - hsv.s) * 255,
      g: (hsv.s + 1 - hsv.s) * 255,
      b: (X + 1 - hsv.s) * 255,
    };
  } else if (3 <= H && H < 4) {
    rgbColor = {
      r: (0 + 1 - hsv.s) * 255,
      g: (X + 1 - hsv.s) * 255,
      b: (hsv.s + 1 - hsv.s) * 255,
    };
  } else if (4 <= H && H < 5) {
    rgbColor = {
      r: (X + 1 - hsv.s) * 255,
      g: (0 + 1 - hsv.s) * 255,
      b: (hsv.s + 1 - hsv.s) * 255,
    };
  } else if (5 <= H && H <= 6) {
    rgbColor = {
      r: (hsv.s + 1 - hsv.s) * 255,
      g: (0 + 1 - hsv.s) * 255,
      b: (X + 1 - hsv.s) * 255,
    };
  }

  return rgbColor;
};

//RGB→HSV→RGBと変換し、明度を1に変換する. 
export const RGBValueMax = (rgb: Rgb) => {
  const { r, g, b } = rgb;

  //RGB→HSV
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);

  const hsvColor: Hsv = { h: 0, s: 0, v: 1 }; //明度は1

  if (max === min) {
    hsvColor.h = 0; //max-min = 0のときは色相は関係ないので適当に
  } else if (min == r) {
    hsvColor.h = (60 * (b - g)) / (max - min) + 180;
  } else if (min == g) {
    hsvColor.h = (60 * (r - b)) / (max - min) + 300;
  } else if (min == b) {
    hsvColor.h = (60 * (g - r)) / (max - min) + 60;
  }

  hsvColor.s = max - min;

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

  //合成した色の明度を1に変換して返す
  return RGBValueMax(mixColor);
};
