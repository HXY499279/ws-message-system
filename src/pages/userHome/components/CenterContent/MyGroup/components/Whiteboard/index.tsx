import React, { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "../../../../../../../redux/hooks";
import SocketConnect from "../../../../../../../utils/websocket";
import { CloseOutlined, LeftOutlined } from "@ant-design/icons";
import styles from "./index.module.css";
import httpUtil from "../../../../../../../utils/httpUtil";
import { useHistory } from "react-router-dom";
import { getUserInfoAC } from "../../../../../../../redux/actionCreators";

type propsType = {
  canvasRef: React.RefObject<HTMLCanvasElement>;
};

export const Whiteboard = (props: propsType) => {
  const group = useSelector((state) => state.userInfo.group);
  const user = useSelector((state) => state.userInfo.user);

  const dispatch = useDispatch();
  const history = useHistory();

  const clearCanvas = () => {
    const { ws } = SocketConnect.getConnectInstance(group.groupName);
    ws.send(JSON.stringify({ type: 10, data: null, message: "clear" }));
  };

  const outFromGroup = () => {
    httpUtil.quitGroup({ userId: user.userId }).then((res) => {
      console.log(res);
      history.push("/user/hall");
      dispatch(getUserInfoAC());
    });
  };

  return (
    <div className={styles["wraper"]}>
      <div className={styles["top"]}>
        <div className={styles["tools"]}>
          <div className={styles["tools-item"]}>
            <LeftOutlined onClick={outFromGroup} />
          </div>
          <div
            className={`${styles["tools-item"]} ${styles["tools-item-tool"]}`}
            onClick={clearCanvas}
          >
            <CloseOutlined />
            <span className={styles["tools-item-name"]}>清除</span>
          </div>
        </div>
      </div>
      <canvas
        ref={props.canvasRef}
        id="whiteBoardCanvas"
        width="930"
        height="530"
        className={styles.canvas}
      ></canvas>
    </div>
  );
};
