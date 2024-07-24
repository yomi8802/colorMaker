//ランダム初期値生成
export const makeFirstRow = (n: number, q: number) => {
  const firstRow: number[][] = [];
  for (let i = 0; i < n; i++) {
    const cell = Array.from({ length: q }).map(() => Math.random());
    const totalState = cell.reduce((acc, val) => acc + val, 0);
    const nomalizationCell = cell.map((d) => d / totalState);
    firstRow.push(nomalizationCell);
  }
  return firstRow;
};

export const makeExtremeFirstRow = (n: number, q: number) => {
  const firstRow: number[][] = [];
  for (let i = 0; i < n; i++) {
    const indexForStrong = Math.floor(Math.random() * q);
    const cell = Array.from({ length: q }).map((_, index) => {
      const randomValue = Math.random();
      return index === indexForStrong ? 0.9 : randomValue;
    });
    const totalState =
      10 *
      cell
        .filter((_, index) => index !== indexForStrong)
        .reduce((acc, val) => acc + val, 0);
    const nomalizationCell = cell.map((d, index) =>
      index === indexForStrong ? d : d / totalState
    );
    firstRow.push(nomalizationCell);
  }
  return firstRow;
};
