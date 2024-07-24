import { DownloadOutlined } from "@ant-design/icons";
import Konva from "konva";
import { Button, Tooltip } from "antd";

type DLButtonProp = {
  fileName: string;
  stageRef: React.RefObject<Konva.Stage>;
};

const DLButton = ({ fileName, stageRef }: DLButtonProp) => {
  const handleExport = () => {
    if (stageRef.current) {
      const uri = stageRef.current.toDataURL();
      const link = document.createElement("a");
      link.href = uri;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      console.error("Stage reference is null");
    }
  };

  return (
    <div style={{ textAlign: "right" }}>
      <Tooltip title="Download">
        <Button
          type="default"
          shape="circle"
          icon={<DownloadOutlined />}
          onClick={handleExport}
        />
      </Tooltip>
    </div>
  );
};

export default DLButton;
