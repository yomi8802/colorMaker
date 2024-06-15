import { useState, useEffect } from "react";
import { Button, Input, Col, Row, Collapse, Divider, message } from "antd";
import type { CollapseProps } from "antd";

type Prop = {
  q: number;
  handleBChange: (newValue: number[][]) => void;
};

export const Config = (props: Prop) => {
  const [rule, setRule] = useState("0");
  const [placeholder, setPlaceHolder] = useState("数字のみ、最大桁数:");
  const [B, setB] = useState(new Array<number[]>());
  const [inputStatus, setInputStatus] = useState<
    "" | "warning" | "error" | undefined
  >(undefined);
  const [messageApi, contextHolder] = message.useMessage();

  const randomRule = () => {
    //ランダムルール設定
    setInputStatus(undefined);
    const tempB = [];
    let ruleNum = "";
    for (let i = 0; i < props.q ** 3; i++) {
      const temp = new Array(props.q).fill(0); //q成分の配列作成
      const num = Math.round(Math.random() * (props.q - 1));
      temp[num] = 1; //ランダムの１成分のみ1を立てる
      tempB.push(temp);
      ruleNum = ruleNum + num;
    }
    setRule(ruleNum);
    setB(tempB);
  };

  const errorMessage = () => {
    messageApi.open({
      type: "error",
      content: "入力値は" + props.q + "未満の半角数字のみにしてください。",
    });
  };

  const generate = () => {
    // 数字以外の文字が含まれているかどうかをチェック
    if (/\D/.test(rule)) {
      setInputStatus("error"); // Inputのステータスをwarningに設定
      errorMessage();
      return; // 処理を終了
    }

    const sanitized = rule.replace(/\D/g, "");
    const numbers = sanitized.split("").map((n) => parseInt(n));

    // 入力された各数字がprops.q未満であるかどうかをチェック
    if (numbers.some((n) => n >= props.q)) {
      setInputStatus("error"); // Inputのステータスをwarningに設定
      errorMessage();
      return; // 処理を終了
    }

    setInputStatus(undefined); // ステータスをリセット

    const filtered = numbers.join("");
    setRule(filtered.slice(0, props.q ** 3));
    let ruleNum = filtered;
    while (ruleNum.length < props.q ** 3) {
      ruleNum = "0" + ruleNum;
    }

    const tempB = [];
    for (let i = 0; i < props.q ** 3; i++) {
      const temp = new Array(props.q).fill(0); //q成分の配列作成
      temp[Number(ruleNum[i])] = 1; //ランダムの１成分のみ1を立てる
      tempB.push(temp);
    }
    setB(tempB);
    props.handleBChange(B);
  };

  useEffect(() => {
    setPlaceHolder("数字のみ、最大桁数:" + props.q ** 3);
    setRule("0");
  }, [props.q]);

  const items: CollapseProps["items"] = [
    {
      key: "1",
      label: "Config",
      children: (
        <>
          <Row justify={"space-evenly"}>
            <Col span={4}>
              <p>ルール番号</p>
            </Col>
          </Row>
          <Row justify={"space-evenly"}>
            <Col span={4}>
              <Button type="primary" onClick={randomRule}>
                ランダム生成
              </Button>
            </Col>
            <Col span={16}>
              <Input
                value={rule}
                onChange={(e) => {
                  setRule(e.target.value);
                  setInputStatus(undefined);
                }}
                placeholder={placeholder}
                status={inputStatus}
              />
            </Col>
          </Row>
        </>
      ),
    },
  ];

  return (
    <>
      {contextHolder}
      <Divider />
      <Collapse ghost items={items} />
      <Button type="primary" onClick={generate}>
        Generate
      </Button>
      <Divider />
    </>
  );
};
