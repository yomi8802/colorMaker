import { useState } from "react";
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
import type {
  RadioChangeEvent,
  CollapseProps,
  CheckboxProps,
  InputNumberProps,
} from "antd";
import { Config } from "./VFCA";
import { CellRender } from "./CellRender";

type ConfigProp = {
  config: Config;
  setConfig: (newConfig: Config) => void;
};

const EditConfig = ({ config, setConfig }: ConfigProp) => {
  const { q, n, rule, minV, k, firstRow } = config;
  const [radioValue, setRadioValue] = useState(1);
  const [completionType, setCompletionType] = useState(1);
  const [changeFirstRow, setChangeFirstRow] = useState(true);
  const [showDetail, setShowDetail] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const [inputRule, setInputRule] = useState(rule);
  const [inputMinV, setInputMinV] = useState(minV);
  const [inputK, setInputK] = useState(k);
  const errorMessage = () => {
    messageApi.open({
      type: "error",
      content: "入力値の各桁は" + q + "未満の半角数字のみにしてください。",
    });
  };
  const placeholder = "数字のみ、最大桁数:" + q ** 3;
  const { Text } = Typography;

  //ルール変更ラジオボタン
  const onRuleChange = (e: RadioChangeEvent) => {
    switch (e.target.value) {
      case 1: {
        setRadioValue(1);
        setInputRule(rule);
        break;
      }
      case 2: {
        setRadioValue(2);
        break;
      }
    }
  };

  //初期値変更チェックボックス
  const handleChangeFirstRow: CheckboxProps["onChange"] = (e) => {
    setChangeFirstRow(!e.target.checked);
  };

  //ランダム初期値生成
  const makeFirstRow = () => {
    const firstRow: number[][] = [];
    for (let i = 0; i < n; i++) {
      let cell: number[] = new Array(q);

      for (let j = 0; j < q; j++) {
        cell[j] = Math.random();
      }

      const totalState = cell.reduce((acc, val) => acc + val, 0);

      cell = cell.map((d) => d / totalState);

      firstRow.push(cell);
    }

    return firstRow;
  };

  //補完変更ラジオボタン
  const onCompletionTypeChange = (e: RadioChangeEvent) => {
    if (e.target.value === 1) {
      setCompletionType(1);
      const newConfig = {
        ...config,
        completionType: 1,
        cellRender: (state: number[]) => CellRender(newConfig)(state),
      };
      setConfig(newConfig);
    } else if (e.target.value === 2) {
      setCompletionType(2);
      const newConfig = {
        ...config,
        completionType: 2,
        cellRender: (state: number[]) => CellRender(newConfig)(state),
      };
      setConfig(newConfig);
    }
  };

  //詳細表示変更チェックボックス
  const handleShowDetail: CheckboxProps["onChange"] = (e) => {
    setShowDetail(e.target.checked);
    const newConfig = {
      ...config,
      showDetail: e.target.checked,
      cellRender: (state: number[]) => CellRender(newConfig)(state),
    };
    setConfig(newConfig);
    console.log(newConfig);
  };

  //最小値スライダー操作時
  const onMinVChange: InputNumberProps["onChange"] = (newValue) => {
    setInputMinV(newValue as number);
    const newConfig = {
      ...config,
      minV: newValue as number,
      cellRender: (state: number[]) => CellRender(newConfig)(state),
    };
    setConfig(newConfig);
  };

  //係数スライダー操作時
  const onKChange: InputNumberProps["onChange"] = (newValue) => {
    setInputK(newValue as number);
    const newConfig = {
      ...config,
      k: newValue as number,
      cellRender: (state: number[]) => CellRender(newConfig)(state),
    };
    setConfig(newConfig);
  }

  //生成
  const generate = () => {
    let tempRule = inputRule;
    
    if (radioValue === 2) {
      tempRule = Array.from({ length: q ** 3 })
        .map(() => {
          return Math.round(Math.random() * (q - 1));
        })
        .join("");
      setInputRule(tempRule);
    }

    const numbers = inputRule.split("").map((num) => parseInt(num));
    // 入力値が不正であればエラーを出す
    if (numbers.some((num) => num >= q) || /\D/g.test(tempRule)) {
      errorMessage();
      return;
    }

    let newFirstRow = firstRow;
    if (changeFirstRow) {
      newFirstRow = makeFirstRow();
    }

    const newConfig = {
      ...config,
      rule: tempRule,
      firstRow: newFirstRow,
      cellRender: (state: number[]) => CellRender(newConfig)(state),
    };
    setConfig(newConfig);
  };

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
                {radioValue === 1 && (
                  <Input
                    value={inputRule}
                    placeholder={placeholder}
                    style={{ marginTop: "1vw" }}
                    onChange={(e) => setInputRule(e.target.value)}
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
              <Checkbox
                checked={!changeFirstRow}
                onChange={handleChangeFirstRow}
              >
                初期値を固定する
              </Checkbox>
            </Col>
          </Row>
          <Divider />
          <Row justify={"space-evenly"}>
            <Col span={8}>
              <p>色補正</p>
            </Col>
            <Col span={24}>
              <Radio.Group
                onChange={onCompletionTypeChange}
                value={completionType}
              >
                <Radio value={1}>補正しない</Radio>
                <Radio value={2}>分散で補正する</Radio>
                {completionType == 2 && (
                  <>
                    <div style={{ marginTop: "1vw" }}>
                      <Text style={{ marginRight: "4%" }}>最低値: </Text>
                      <InputNumber
                        min={0}
                        max={1}
                        value={inputMinV}
                        step={0.01}
                        onChange={onMinVChange}
                      />
                    </div>
                    <Slider
                      min={0}
                      max={1}
                      onChange={onMinVChange}
                      value={typeof inputMinV === "number" ? inputMinV : 0}
                      step={0.01}
                      style={{ marginLeft: "4%" }}
                    />
                    <div style={{ marginTop: "1vw" }}>
                      <Text style={{ marginRight: "4%" }}>k: </Text>
                      <InputNumber
                        min={0.5}
                        max={10}
                        value={inputK}
                        step={0.01}
                        onChange={onKChange}
                      />
                    </div>
                    <Slider
                      min={0.5}
                      max={10}
                      onChange={onKChange}
                      value={inputK}
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
              <Checkbox checked={showDetail} onChange={handleShowDetail}>
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

export default EditConfig;
