import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "../../../../../../../redux/hooks";
import { getMemberListAC } from "../../../../../../../redux/actionCreators";
import { Avatar, Space, Input, Popconfirm } from "antd";
import { MemberList } from "./components/MemberList";
import { DeleteOutlined, UserOutlined } from "@ant-design/icons";
import { nanoid } from "nanoid";
import styles from "./index.module.css";

const { Search } = Input;

export const MemberFrame = () => {
  const loading = useSelector((state) => state.memberList.loading);
  const members = useSelector((state) => state.memberList.members);
  const creator = useSelector((state) => state.memberList.creator);
  const user = useSelector((state) => state.userInfo.user);
  const group = useSelector((state) => state.userInfo.group);

  // 搜索列表（搜索结果）
  const [searchList, setSearchList] = useState<any>(null);

  const dispatch = useDispatch();

  const ColorList = ["#f56a00", "#7265e6", "#ffbf00", "#00a2ae"];

  const getRandomColor = (len: number) =>
    ColorList[Math.floor(len % ColorList.length)];

  // 搜索
  const search = (value: string) => {
    setSearchList(null);
    const reg = new RegExp(value, "ig");
    const result = members?.filter((item: any) => {
      return item.userName.search(reg) !== -1;
    });
    setSearchList(result);
  };

  // 清楚搜索框内容时
  const clearSearch = (e: any) => {
    const value = e.target.value;
    if (value === "") {
      setSearchList(null);
    }
  };

  const confirm = (userId: string) => {
    console.log(userId);
  };

  const cancel = (e: any) => {
    console.log(e);
  };

  const RightIcon = (props: { item: any }) => {
    if (creator?.userId === user.userId) {
      // 我是房主
      if (props.item.userId !== creator?.userId) {
        return (
          <Popconfirm
            title="确定踢出该成员吗?"
            onConfirm={confirm.bind(this, props.item.userId)}
            onCancel={cancel}
            okText="确认"
            cancelText="取消"
          >
            <span className={`${styles["delete"]} ${styles["icon"]}`}>
              <DeleteOutlined />
            </span>
          </Popconfirm>
        );
      } else {
        return (
          <span className={`${styles["owner"]} ${styles["icon"]}`}>
            <UserOutlined />
          </span>
        );
      }
    } else {
      // 我不是房主
      if (props.item.userId === creator?.userId) {
        return (
          <span className={`${styles["owner"]} ${styles["icon"]}`}>
            <UserOutlined />
          </span>
        );
      } else {
        return <></>;
      }
    }
  };

  useEffect(() => {
    if (group) {
      dispatch(getMemberListAC(group.groupId));
    }
  }, [group]);

  return (
    <div className={styles.wrapper}>
      <div className={styles["search-wrapper"]}>
        <Search
          placeholder="搜索成员"
          onSearch={search}
          onChange={clearSearch}
        />
      </div>
      <MemberList
        className={styles["list"]}
        loading={loading}
        dataSource={searchList ? searchList : members}
        renderItem={(item: any) => (
          <div className={styles["user"]} key={nanoid()}>
            <Space>
              <Avatar
                style={{
                  backgroundColor: getRandomColor(item.userName.length),
                  verticalAlign: "middle",
                }}
                size="large"
              >
                {item.userName.slice(item.userName.length - 2)}
              </Avatar>
              <span title={item.userName} className={styles["userName"]}>
                {item.userName}
              </span>
            </Space>
            <RightIcon item={item} />
          </div>
        )}
      />
    </div>
  );
};
