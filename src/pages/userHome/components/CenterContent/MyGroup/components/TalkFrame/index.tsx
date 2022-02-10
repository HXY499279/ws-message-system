import React from "react";
import { Input, Space, Button } from "antd";
import styles from "./index.module.css";

export const TalkFrame = () => {
  return (
    <div className={styles.wrapper}>
      <div className={styles["content"]}>
        
      </div>
      <div className={styles["send-input"]}>
        <Space size={"middle"}>
          <Input placeholder="请输入内容" />
          <Button>发送</Button>
        </Space>
      </div>
    </div>
  );
};
