import React, { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "../../../../../../../redux/hooks";
import { Draw, Erase } from "../../../../../../../utils/whiteboard";
import SocketConnect from "../../../../../../../utils/websocket";
import {
  CloseOutlined,
  LeftOutlined,
  HighlightOutlined,
  ClearOutlined,
} from "@ant-design/icons";
import styles from "./index.module.css";
import httpUtil from "../../../../../../../utils/httpUtil";
import { Skeleton, Popconfirm, message } from "antd";

type propsType = {
  canvasRef: React.RefObject<HTMLCanvasElement>;
};

export const Whiteboard = (props: propsType) => {
  const group = useSelector((state) => state.userInfo.group);
  const user = useSelector((state) => state.userInfo.user);

  const clearCanvas = () => {
    const { ws } = SocketConnect.getConnectInstance(group.groupName);
    ws.send(JSON.stringify({ type: 10, data: null, message: "clear" }));
  };

  const drawCanvas = () => {
    const { ws } = SocketConnect.getConnectInstance(group.groupName);
    const canvas = props.canvasRef.current;
    let draw = new Draw(canvas, user.userId);
    draw.init(ws);
  };

  const eraseCanvas = () => {
    const { ws } = SocketConnect.getConnectInstance(group.groupName);
    const canvas = props.canvasRef.current;
    let erase = new Erase(canvas, user.userId);
    erase.init(ws);
  };

  const confirmDismissGroup = () => {
    httpUtil.dismissGroup({ groupId: group.groupId }).then((res) => {
      message.success("解散成功");
    });
  };

  const outFromGroup = () => {
    httpUtil.quitGroup({ userId: user.userId });
  };

  return (
    <div className={styles["wraper"]}>
      <div className={styles["top"]}>
        <div className={styles["top-header"]}>
          {group && user ? (
            <>
              <div className={styles["quite-group-button"]}>
                {group.creatorId === user.userId ? (
                  <Popconfirm
                    title="确定解散该分组吗?"
                    onConfirm={confirmDismissGroup}
                    okText="确认"
                    cancelText="取消"
                  >
                    <span className={styles["dismiss-group"]}>解散分组</span>
                  </Popconfirm>
                ) : (
                  <LeftOutlined onClick={outFromGroup} />
                )}
              </div>
              <span className={styles["top-header-group-name"]}>
                {`${group.groupName}小组`}
              </span>
            </>
          ) : (
            <Skeleton.Input
              style={{ width: 200, height: 25, marginLeft: 10 }}
              active
              size="default"
            />
          )}
        </div>
      </div>
      <div className={styles["canvas-wraper"]}>
        <canvas
          ref={props.canvasRef}
          id="whiteBoardCanvas"
          width="880"
          height="530"
          className={styles.canvas}
        />
        <div className={styles["canvas-tool"]}>
          <div
            className={`${styles["tools-item"]} ${styles["tools-item-tool"]}`}
            onClick={clearCanvas}
          >
            <CloseOutlined />
            <span className={styles["tools-item-name"]}>清除</span>
          </div>
          <div
            className={`${styles["tools-item"]} ${styles["tools-item-tool"]}`}
            onClick={drawCanvas}
          >
            <HighlightOutlined />
            <span className={styles["tools-item-name"]}>画笔</span>
          </div>
          <div
            className={`${styles["tools-item"]} ${styles["tools-item-tool"]}`}
            onClick={eraseCanvas}
          >
            <ClearOutlined />
            <span className={styles["tools-item-name"]}>擦子</span>
          </div>
        </div>
      </div>
    </div>
  );
};
