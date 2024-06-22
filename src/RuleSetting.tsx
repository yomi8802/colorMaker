type Prop = {
  q: number;
  numbers: number[];
  setRule: (rule: string) => void;
  setB: (B: number[][]) => void;
  isRandom: boolean;
};

const RuleSetting = ({ q, numbers, setRule, setB, isRandom }: Prop) => {
  if (isRandom) {
    //ランダムルール設定
    const tempB = [];
    let ruleNum = "";
    for (let i = 0; i < q ** 3; i++) {
      const temp = new Array(q).fill(0); //q成分の配列作成
      const num = Math.round(Math.random() * (q - 1));
      temp[num] = 1; //ランダムの１成分のみ1を立てる
      tempB.push(temp);
      ruleNum = ruleNum + num;
    }
    setRule(ruleNum);
    setB(tempB);
  } else {
    //入力値でルール設定
    const filtered = numbers.join("");
    setRule(filtered.slice(0, q ** 3));
    let ruleNum = filtered;
    while (ruleNum.length < q ** 3) {
      ruleNum = "0" + ruleNum;
    }

    const tempB = [];
    for (let i = 0; i < q ** 3; i++) {
      const temp = new Array(q).fill(0); //q成分の配列作成
      temp[Number(ruleNum[i])] = 1; //ランダムの１成分のみ1を立てる
      tempB.push(temp);
    }
    setB(tempB);
  }
};

export default RuleSetting;
