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
  Slider,
  InputNumber,
  Typography,
} from "antd";
import { useAppState } from "./hooks";
import type {
  RadioChangeEvent,
  CollapseProps,
  CheckboxProps,
  InputNumberProps,
} from "antd";
import RuleSetting from "./RuleSetting";

type Prop = {
  handleBChange: (newValue: number[][]) => void;
  setChangeFirstRow: (isChange: boolean) => void;
  setCorrectNum: (correctNum: number) => void;
  setShowDetail: (isShowDetail: boolean) => void;
  resetDetail: () => void;
};

export const Config = ({
  handleBChange,
  setChangeFirstRow,
  setCorrectNum,
  setShowDetail,
  resetDetail,
}: Prop) => {
  const { q, setMinCorrect, rule, setRule } = useAppState();
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
  const [correctRadioValue, setCorrectRadioValue] = useState(1);
  const [inputValue, setInputValue] = useState(0.3);
  const [isCorrect, setCorrect] = useState(false);
  const [isRandom, setIsRandom] = useState(false);
  const [firstRowChangeFlag, setFirstRowChangeFlag] = useState(true);
  const [showDetailFlag, setShowDetailFlag] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const errorMessage = () => {
    messageApi.open({
      type: "error",
      content: "入力値は" + q + "未満の半角数字のみにしてください。",
    });
  };
  const { Text } = Typography;

  const generate = () => {
    // 数字以外の文字が含まれているかどうかをチェック
    if (/\D/.test(rule)) {
      setInputStatus("error"); // Inputのステータスをwarningに設定
      errorMessage();
      return; // 処理を終了
    }

    //数字以外の文字を削除し、numberに変換
    const sanitized = rule.replace(/\D/g, "");
    const numbers = sanitized.split("").map((n) => parseInt(n));

    // 入力された各数字がprops.q未満であるかどうかをチェック
    if (numbers.some((n) => n >= q)) {
      setInputStatus("error"); // Inputのステータスをwarningに設定
      errorMessage();
      return; // 処理を終了
    }

    setInputStatus(undefined); // ステータスをリセット

    //ルール設定
    RuleSetting({ q, numbers, setRule, setB, isRandom });

    //generateされたタイミングで変更
    setChangeFirstRow(firstRowChangeFlag);

    //詳細情報をリセット
    resetDetail();
  };

  //ルール変更ラジオボタン
  const onRuleChange = (e: RadioChangeEvent) => {
    if (e.target.value === 1) {
      setRadioValue(1);
      setIsRandom(false);
    } else if (e.target.value === 2) {
      setRadioValue(2);
      setIsRandom(true);
    }
  };

  //初期値変更チェックボックス
  const onFirstRowChange: CheckboxProps["onChange"] = (e) => {
    setFirstRowChangeFlag(!e.target.checked);
  };

  //補完変更ラジオボタン
  const onCorrectNumChange = (e: RadioChangeEvent) => {
    if (e.target.value === 1) {
      setCorrectRadioValue(1);
      setCorrect(false);
    } else if (e.target.value === 2) {
      setCorrectRadioValue(2);
      setCorrect(true);
    }
  };

  //詳細表示変更チェックボックス
  const handleShowDetailFlagChange: CheckboxProps["onChange"] = (e) => {
    setShowDetailFlag(e.target.checked);
  };

  //スライダー操作時
  const onChange: InputNumberProps["onChange"] = (newValue) => {
    setInputValue(newValue as number);
  };

  //ボタン変更直後だと動かなかったりしたのでuseEffectで管理
  useEffect(() => {
    setPlaceHolder("数字のみ、最大桁数:" + q ** 3);
    setRule("0");
  }, [q, setRule]);

  useEffect(() => {
    handleBChange(B);
  }, [handleBChange, B]);

  useEffect(() => {
    setCorrectNum(correctRadioValue);
  }, [setCorrectNum, correctRadioValue]);

  useEffect(() => {
    setMinCorrect(inputValue);
  }, [inputValue, setMinCorrect]);

  useEffect(() => {
    setShowDetail(showDetailFlag);
  }, [setShowDetail, showDetailFlag]);

  //コラプス内のアイテム
  const items: CollapseProps["items"] = [
    {
      key: "1",
      label: "Config",
      children: (
        <div className="scrollable-content">
          <Divider />
          <Row justify={"space-evenly"}>
            <Col span={8}>
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
                    style={{ marginTop: "1vw" }}
                  />
                )}
              </Radio.Group>
            </Col>
          </Row>
          <Divider />
          <Row justify={"space-evenly"}>
            <Col span={8}>
              <p>初期値</p>
            </Col>
            <Col span={24}>
              <Checkbox onChange={onFirstRowChange}>初期値を固定する</Checkbox>
            </Col>
          </Row>
          <Divider />
          <Row justify={"space-evenly"}>
            <Col span={8}>
              <p>色補正</p>
            </Col>
            <Col span={24}>
              <Radio.Group
                onChange={onCorrectNumChange}
                value={correctRadioValue}
              >
                <Radio value={1}>補正しない</Radio>
                <Radio value={2}>分散で補正する</Radio>
                {isCorrect && (
                  <>
                    <div style={{ marginTop: "1vw" }}>
                      <Text style={{ marginRight: "4%" }}>最低値</Text>
                      <InputNumber
                        min={0.3}
                        max={1}
                        value={inputValue}
                        step={0.01}
                        onChange={onChange}
                      />
                    </div>
                    <Slider
                      min={0.3}
                      max={1}
                      onChange={onChange}
                      value={typeof inputValue === "number" ? inputValue : 0}
                      step={0.01}
                      style={{ marginLeft: "4%" }}
                    />
                  </>
                )}
              </Radio.Group>
            </Col>
          </Row>
          <Divider />
          <Row justify={"space-evenly"}>
            <Col span={8}>
              <p>詳細表示</p>
            </Col>
            <Col span={24}>
              <Checkbox onChange={handleShowDetailFlagChange}>
                セルの詳細情報を表示する
              </Checkbox>
            </Col>
          </Row>
          <Divider />
        </div>
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
    </>
  );
};
