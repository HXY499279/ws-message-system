import React, { useEffect, useRef, useState } from "react";
import { MemberFrame, TalkFrame, Whiteboard } from "./components";
import { Row, Col, Input } from "antd";
import styles from "./index.module.css";
import { useSelector, useDispatch } from "../../../../../redux/hooks";
import { Draw } from "../../../../../utils/whiteboard";
import httpUtil from "../../../../../utils/httpUtil";
import { PRIVATE_GROUP_MESSAGE } from "../../../../../utils/constant";
import SocketConnect from "../../../../../utils/websocket";
import {
  getUserInfoAC,
  updateChatListAC,
} from "../../../../../redux/actionCreators";

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

  useEffect(() => {
    sendIpt &&
    (sendIpt.handleKeyDown = (e) => {
      // 兼容FF和IE和Opera
      var theEvent = e || window.event;
      var code = theEvent.keyCode || theEvent.which || theEvent.charCode;
      if (code === 13) {
        sendData();
      }
    });
  },[sendIpt])


  useEffect(() => {
    if (group) {
      if (!canvas) {
        return window.location.reload();
      }
      let draw = new Draw(canvas, user.userId);
      const ctx = canvas.getContext("2d")!;
      let moveToSwitch = 1;
      let ws = httpUtil.connectSocket({
        groupName: group.groupName,
        scene: PRIVATE_GROUP_MESSAGE,
        callBack(e: any) {
          if (!e) return;
          const Data: whiteBoardDataType & TalkFrameDataType = JSON.parse(
            e.data
          );
          const { type, data, message, userId = null } = Data;
          try {
            // 当为接收白板画笔内容时
            if (type === 10 && user.userId !== userId) {
              let pathObj: number[] = data;
              ctx.strokeStyle = "#000";
              if (moveToSwitch && message !== "stop" && message !== "clear") {
                ctx.beginPath();
                ctx.moveTo(pathObj[0], pathObj[1]);
                moveToSwitch = 0;
              } else if (!moveToSwitch && message === "stop") {
                ctx.beginPath();
                ctx.moveTo(pathObj[0], pathObj[1]);
                moveToSwitch = 1;
              } else if (message === "clear") {
                ctx.clearRect(0, 0, 930, 530);
              }
              ctx.lineTo(pathObj[2], pathObj[3]);
              ctx.stroke();
            } else if (type === 11 && user.userId !== userId) {
              moveToSwitch = 1;
              // 当为接收白板擦子内容时
              let pathObj: number[] = data;
              ctx.fillStyle = "white";
              if (moveToSwitch && message !== "stop" && message !== "clear") {
                ctx.beginPath();
                ctx.arc(
                  pathObj[0],
                  pathObj[1],
                  pathObj[4],
                  0,
                  Math.PI * pathObj[4]
                );
                ctx.fill();
                moveToSwitch = 0;
              } else if (!moveToSwitch && message === "stop") {
                ctx.beginPath();
                ctx.arc(
                  pathObj[0],
                  pathObj[1],
                  pathObj[4],
                  0,
                  Math.PI * pathObj[4]
                );
                ctx.fill();
                moveToSwitch = 1;
              } else if (message === "clear") {
                ctx.clearRect(0, 0, 880, 550);
              }
              ctx.beginPath();
              ctx.arc(
                pathObj[2],
                pathObj[3],
                pathObj[4],
                0,
                Math.PI * pathObj[4]
              );
              ctx.fill();
            } else if (type === 9 && data[0].userId != user.userId) {
              dispatch(updateChatListAC({ type: 0, data }));
            }
          } catch (error) {}
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
