import React, { useEffect, useRef, useState } from "react";
import { MemberFrame, TalkFrame, Whiteboard } from "./components";
import { Row, Col, Input } from "antd";
import styles from "./index.module.css";
import { useSelector, useDispatch } from "../../../../../redux/hooks";
import Draw from "../../../../../utils/Draw";
import httpUtil from "../../../../../utils/httpUtil";
import { PRIVATEGROUPMESSAGE } from "../../../../../utils/constant";
import SocketConnect from "../../../../../utils/websocket";
import { updateChatListAC } from "../../../../../redux/actionCreators";

type whiteBoardDataType = {
  type: number;
  data: number[];
  message: string;
  userId: string;
};

type TalkFrameDataType = {
  type: number;
  data: any[];
  message: string;
};

export default function MyGroup() {
  const dispatch = useDispatch();

  const chat = useSelector((state) => state.chatList.data);
  const group = useSelector((state) => state.userInfo.group);
  const user = useSelector((state) => state.userInfo.user);

  const [talkFrameScrollTag, setTalkFrameScrollTag] = useState(1);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sendIptRef = useRef<Input>(null);
  const sendIpt = sendIptRef.current;
  const canvas = canvasRef.current;

  const sendData = () => {
    if (sendIpt) {
      const { ws } = SocketConnect.getConnectInstance(group.groupName);

      const value = sendIpt?.state.value;
      const talkFrameData: TalkFrameDataType = {
        type: 9,
        data: [user, value],
        message: "",
      };
      dispatch(updateChatListAC({ type: 1, data: [user, value] }));
      ws.send(JSON.stringify(talkFrameData));
      setTalkFrameScrollTag(1);
      sendIpt.setState({
        value: "",
      });
    }
  };

  sendIpt &&
    (sendIpt.handleKeyDown = (e) => {
      // 兼容FF和IE和Opera
      var theEvent = e || window.event;
      var code = theEvent.keyCode || theEvent.which || theEvent.charCode;
      if (code === 13) {
        sendData();
      }
    });

  useEffect(() => {
    if (group) {
      if (!canvas) {
        return window.location.reload();
      }
      let draw = new Draw(canvas, user.userId);
      const cxt = canvas.getContext("2d")!;
      let moveToSwitch = 1;
      let ws = httpUtil.connectSocket({
        groupName: group.groupName,
        scene: PRIVATEGROUPMESSAGE,
        callBack(e: any) {
          if (!e) return;
          const Data: whiteBoardDataType & TalkFrameDataType = JSON.parse(
            e.data
          );
          const { type, data, message, userId = null } = Data;

          // 当为接收白板内容时
          if (type === 10 && user.userId !== userId) {
            let pathObj: number[] = data;
            cxt.strokeStyle = "#000";
            if (moveToSwitch && message !== "stop" && message !== "clear") {
              cxt.beginPath();
              cxt.moveTo(pathObj[0], pathObj[1]);
              moveToSwitch = 0;
            } else if (!moveToSwitch && message === "stop") {
              cxt.beginPath();
              cxt.moveTo(pathObj[0], pathObj[1]);
              moveToSwitch = 1;
            } else if (message === "clear") {
              cxt.clearRect(0, 0, 930, 530);
            }
            cxt.lineTo(pathObj[2], pathObj[3]);
            cxt.stroke();
          } else if (type === 9 && data[0].userId !== user.userId) {
            dispatch(updateChatListAC({ type: 0, data }));
          }
        },
      }).ws;

      ws.onopen = () => {
        ws.status = "open";
        draw.init(ws);
      };
    }
  }, [group]);

  return (
    <Row className={styles["wrapper"]}>
      <Col span={18}>
        <Whiteboard canvasRef={canvasRef} />
      </Col>
      <Col span={6}>
        <div className={styles["right-wrapper"]}>
          <MemberFrame />
          <TalkFrame
            sendIptRef={sendIptRef}
            sendData={sendData}
            chat={chat}
            talkFrameScrollTag={talkFrameScrollTag}
            setTalkFrameScrollTag={setTalkFrameScrollTag}
          />
        </div>
      </Col>
    </Row>
  );
}
