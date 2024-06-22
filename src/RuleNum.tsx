import { useState } from "react";
import { Typography } from "antd";
import { useAppState } from "./hooks";

const RuleNum = () => {
  const { rule } = useAppState();
  const [expanded, setExpanded] = useState(false);

  return rule.length < 30 ? (
    <>
      <a>ルール番号</a>
      <Typography.Paragraph copyable>{rule}</Typography.Paragraph>
    </>
  ) : (
    <>
      <a>ルール番号</a>
      <Typography.Paragraph
        style={{ width: "60%" }}
        ellipsis={{
          rows: 1, // 表示する行数
          expandable: "collapsible",
          expanded: expanded,
          onExpand: (_, info) => setExpanded(info.expanded),
        }}
        copyable
      >
        {rule}
      </Typography.Paragraph>
    </>
  );
};

export default RuleNum;