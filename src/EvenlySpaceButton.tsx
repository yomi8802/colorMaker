import { useAppState } from "./hooks";
import { Button } from "antd";
import { HSV2RGB } from "./ColorCalculation";

const EvenlySpaceButton = () => {
  const { q, setButtonColorsWhole } = useAppState();
  const autoSetting = () => {
    const space = Math.round(360 / q);
    const newButtonColor = new Array(q);
    for (let i = 0; i < q; i++) {
      newButtonColor[i] = HSV2RGB({ h: space * i, s: 1, v: 1 });
    }
    setButtonColorsWhole(newButtonColor);
  };

  return (
    <Button type="primary" size="small" onClick={autoSetting}>
      Auto Setup
    </Button>
  );
};

export default EvenlySpaceButton;
