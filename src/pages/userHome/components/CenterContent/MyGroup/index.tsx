import React from "react";
import { MemberFrame, TalkFrame, Whiteboard } from "./components";
import { Row, Col } from "antd";
import styles from "./index.module.css";

export default function MyGroup() {
  return (
    <Row className={styles["wrapper"]}>
      <Col span={18}>
        <Whiteboard />
      </Col>
      <Col span={6}>
        <div className={styles["right-wrapper"]}>
          <MemberFrame />
          <TalkFrame />
        </div>
      </Col>
    </Row>
  );
}
