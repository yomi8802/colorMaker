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
import { makeExtremeFirstRow, makeFirstRow } from "./MakeFirstRow";

type ConfigProp = {
  config: Config;
  setConfig: (newConfig: Config) => void;
};

const EditConfig = ({ config, setConfig }: ConfigProp) => {
  const { q, n, rule, minV, k, firstRow } = config;
  const [CAMode, setCAMode] = useState(1);
  const [ruleMode, setRuleMode] = useState(1);
  const [completionType, setCompletionType] = useState(1);
  const [changeFirstRow, setChangeFirstRow] = useState(true);
  const [extremeFirstRow, setExtremeFirstRow] = useState(false);
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

  //CAモード変更ラジオボタン
  const onCAChange = (e: RadioChangeEvent) => {
    switch (e.target.value) {
      case 1: {
        setCAMode(1);
        break;
      }
      case 2: {
        setCAMode(2);
        break;
      }
    }
    const newConfig = {
      ...config,
      caMode: e.target.value,
    };
    setConfig(newConfig);
  };

  //ルール変更ラジオボタン
  const onRuleChange = (e: RadioChangeEvent) => {
    switch (e.target.value) {
      case 1: {
        setRuleMode(1);
        setInputRule(rule);
        break;
      }
      case 2: {
        setRuleMode(2);
        break;
      }
    }
  };

  //初期値変更チェックボックス
  const handleChangeFirstRow: CheckboxProps["onChange"] = (e) => {
    setChangeFirstRow(!e.target.checked);
  };

  //極端初期値チェックボックス
  const handleExtremeFirstRow: CheckboxProps["onChange"] = (e) => {
    setExtremeFirstRow(e.target.checked);
  };

  //補完変更ラジオボタン
  const onCompletionTypeChange = (e: RadioChangeEvent) => {
    setCompletionType(e.target.value);
    const newConfig = {
      ...config,
      completionType: e.target.value,
      cellRender: (state: number[]) => CellRender(newConfig)(state),
    };
    setConfig(newConfig);
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
  };

  //生成
  const generate = () => {
    let tempRule = inputRule;

    if (ruleMode === 2) {
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
      if (extremeFirstRow) {
        newFirstRow = makeExtremeFirstRow(n, q);
      } else {
        newFirstRow = makeFirstRow(n, q);
      }
    }

    const newConfig = {
      ...config,
      rule: tempRule,
      firstRow: newFirstRow,
      caMode: CAMode,
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
              <p>モード</p>
            </Col>
          </Row>
          <Row justify={"space-evenly"}>
            <Col span={24}>
              <Radio.Group onChange={onCAChange} value={CAMode}>
                <Radio value={1}>VFCA</Radio>
                <Radio value={2}>VCA</Radio>
              </Radio.Group>
            </Col>
          </Row>
          <Divider />
          <Row justify={"space-evenly"}>
            <Col span={8}>
              <p>ルール番号</p>
            </Col>
          </Row>
          <Row justify={"space-evenly"}>
            <Col span={24}>
              <Radio.Group onChange={onRuleChange} value={ruleMode}>
                <Radio value={1}>指定</Radio>
                <Radio value={2}>ランダム生成</Radio>
                {ruleMode === 1 && (
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
                固定する
              </Checkbox>
              <Checkbox
                checked={extremeFirstRow}
                onChange={handleExtremeFirstRow}
              >
                極端に割り振る
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
                <Radio value={2}>分散</Radio>
                <Radio value={3}>指数関数</Radio>
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
                  </>
                )}
                {completionType == 3 && (
                  <>
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
                表示
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
