import React, { useRef, useState } from "react";
import { Input, Space, Button } from "antd";
import styles from "./index.module.css";
import { nanoid } from "nanoid";
import { ChatData } from "../../../../../../../redux/chatList/slice";

type propsType = {
  sendIptRef: React.LegacyRef<Input>;
  sendData: (...any: any[]) => void;
  chat: ChatData[];
  talkFrameScrollTag: number;
  setTalkFrameScrollTag: React.Dispatch<React.SetStateAction<number>>;
};

export const TalkFrame = (props: propsType) => {
  const { talkFrameScrollTag, setTalkFrameScrollTag, sendIptRef, chat } = props;
  const contentRef = useRef<HTMLDivElement>(null);
  const contentBottomRef = useRef<HTMLDivElement>(null);

  contentRef.current &&
    (contentRef.current.onscroll = () => {
      setTalkFrameScrollTag(0);
    });

  const returnChatList = () => {
    talkFrameScrollTag && contentBottomRef.current?.scrollIntoView();
    return chat.map((item, index) => {
      return (
        <div
          className={
            item.type ? styles["chat-item-right"] : styles["chat-item-left"]
          }
          key={nanoid()}
        >
          <div className={styles["chat-head"]}>
            <span>
              {item.data[0].userName.slice(item.data[0].userName.length - 2)}
            </span>
          </div>
          <div className={styles["chat-content"]}>
            <span className={styles["chat-content-name"]}>
              {item.data[0].userName}
            </span>
            <span className={styles["chat-content-words"]}>{item.data[1]}</span>
          </div>
        </div>
      );
    });
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles["content"]} ref={contentRef}>
        {returnChatList()}
        <div className={styles["content-bottom"]} ref={contentBottomRef}></div>
      </div>
      <div className={styles["send-input"]}>
        <Space size={"middle"}>
          <Input ref={sendIptRef} placeholder="请输入内容" />
          <Button onClick={props.sendData}>发送</Button>
        </Space>
      </div>
    </div>
  );
};
