import { useState, useEffect } from "react";
import {
  Button,
  Input,
  Col,
  Row,
  Collapse,
  Divider,
  message,
  Radio,
  Checkbox,
} from "antd";
import { useAppState } from "./hooks";
import type { RadioChangeEvent, CollapseProps, CheckboxProps } from "antd";

type Prop = {
  handleBChange: (newValue: number[][]) => void;
  setChangeFirstRow: (isChange: boolean) => void;
};

export const Config = ({ handleBChange, setChangeFirstRow }: Prop) => {
  const { q } = useAppState();
  const [rule, setRule] = useState("0");
  const [placeholder, setPlaceHolder] = useState("数字のみ、最大桁数:");
  const [B, setB] = useState(
    Array(q ** 3)
      .fill(null)
      .map(() => new Array(q).fill(0))
  );
  const [inputStatus, setInputStatus] = useState<
    "" | "warning" | "error" | undefined
  >(undefined);
  const [radioValue, setRadioValue] = useState(1);
  const [isRandom, setIsRandom] = useState(false);
  const [changeFlag, setChangeFlag] = useState(true);
  const [messageApi, contextHolder] = message.useMessage();

  const errorMessage = () => {
    messageApi.open({
      type: "error",
      content: "入力値は" + q + "未満の半角数字のみにしてください。",
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
    if (numbers.some((n) => n >= q)) {
      setInputStatus("error"); // Inputのステータスをwarningに設定
      errorMessage();
      return; // 処理を終了
    }

    setInputStatus(undefined); // ステータスをリセット

    if (isRandom) {
      //ランダムルール設定
      setInputStatus(undefined);
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

    setChangeFirstRow(changeFlag);
  };

  const onRuleChange = (e: RadioChangeEvent) => {
    if (e.target.value === 1) {
      setRadioValue(1);
      setIsRandom(false);
    } else if (e.target.value === 2) {
      setRadioValue(2);
      setIsRandom(true);
    }
  };

  const onFirstRowChange: CheckboxProps["onChange"] = (e) => {
    setChangeFlag(!e.target.checked);
  };

  useEffect(() => {
    setPlaceHolder("数字のみ、最大桁数:" + q ** 3);
    setRule("0");
  }, [q]);

  useEffect(() => {
    handleBChange(B);
  }, [handleBChange, B]);

  const items: CollapseProps["items"] = [
    {
      key: "1",
      label: "Config",
      children: (
        <>
          <Divider />
          <Row justify={"space-evenly"}>
            <Col span={4}>
              <p>ルール番号</p>
            </Col>
          </Row>
          <Row justify={"space-evenly"}>
            <Col span={24}>
              <Radio.Group onChange={onRuleChange} value={radioValue}>
                <Radio value={1}>指定する</Radio>
                <Radio value={2}>ランダム生成する</Radio>
                {!isRandom && (
                  <Input
                    value={rule}
                    onChange={(e) => {
                      setRule(e.target.value);
                      setInputStatus(undefined);
                    }}
                    placeholder={placeholder}
                    status={inputStatus}
                  />
                )}
              </Radio.Group>
            </Col>
          </Row>
          <Divider />
          <Row justify={"space-evenly"}>
            <Col span={24}>
              <Checkbox onChange={onFirstRowChange}>初期値を固定する</Checkbox>
            </Col>
          </Row>
        </>
      ),
    },
  ];

  return (
    <>
      {contextHolder}
      <Collapse ghost items={items} />
      <Button type="primary" onClick={generate}>
        Generate
      </Button>
      <Divider />
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          width: "100%",
        }}
      >
        <p style={{ width: "60%", wordWrap: "break-word" }}>
          ルール番号: {rule}
        </p>
      </div>
    </>
  );
};
