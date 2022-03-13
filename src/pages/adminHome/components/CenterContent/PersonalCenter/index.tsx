import React, { useEffect, useRef, useState } from "react";
import { Spin, Input, message } from "antd";
import styles from "./index.module.css";
import { useDispatch, useSelector } from "../../../../../redux/hooks";
import {
  getMemberListAC,
  getUserInfoAC,
} from "../../../../../redux/actionCreators";
import httpUtil from "../../../../../utils/httpUtil";

export default function PersonalCenter() {
  const dispatch = useDispatch();
  // 数据
  const user = useSelector((state) => state.userInfo.user);
  const admin = useSelector((state) => state.userInfo.admin);
  const group = useSelector((state) => state.userInfo.group);
  const creator = useSelector((state) => state.memberList.creator);
  // 加载
  const [loading, setLoading] = useState(true);
  // 编辑状态
  const [isEditUserName, setIsEditUserName] = useState(false);
  const [isEditPassword, setIsEditPassword] = useState(false);
  // 用户名，密码
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (user) {
      setUserName(user.userName);
      setPassword(user.password);
      setLoading(false);
    }
    if (group) {
      dispatch(getMemberListAC(group.groupId));
    }else{
    }
  }, [user, group]);

  // 改变编辑状态为可编辑
  const setIsEditUserNameTrue = () => {
    setIsEditUserName(true);
  };

  const setIsEditPasswordTrue = () => {
    setIsEditPassword(true);
  };

  // 改变编辑状态为不可编辑
  const setIsEditUserNameFalse = () => {
    setIsEditUserName(false);
  };

  const setIsEditPasswordFalse = () => {
    setIsEditPassword(false);
  };

  // 修改信息
  const changeUserName = (e: any) => {
    const { value } = e.target;
    setUserName(value);
  };
  const changePassword = (e: any) => {
    const { value } = e.target;
    setPassword(value);
  };

  // 保存信息
  const saveUserName = () => {
    if (!userName) {
      return message.warn("用户名不能为空");
    }
    httpUtil
      .updateNameAndPassword({ userId: user.userId, password, userName })
      .then(
        (res) => {
          dispatch(getUserInfoAC());
          setIsEditUserName(false);
          message.success("修改成功");
        },
        (err) => {
          message.warn("用户名重复");
        }
      );
  };
  const savePassword = () => {
    if (!password) {
      return message.warn("密码不能为空");
    }
    httpUtil
      .updateNameAndPassword({ userId: user.userId, password, userName })
      .then(
        (res) => {
          dispatch(getUserInfoAC());
          setIsEditPassword(false);
          message.success("修改成功");
        },
        (err) => {
          message.error("修改失败");
        }
      );
  };

  if (loading) {
    return (
      <div className={styles["loading-wraper"]}>
        <Spin size="large" />
      </div>
    );
  } else {
    return (
      <div className={styles["wraper"]}>
        <div className={styles["content"]}>
          <div className={styles["title"]}>个人信息</div>
          <div className={styles["box"]}>
            <div className={styles["item"]}>
              <div className={styles["item-header"]}>
                <span>{user?.userName.slice(user.userName.length - 2)}</span>
              </div>
              <div className={styles["item-change-bgcolor"]}></div>
            </div>
            <div className={styles["item"]}>
              {isEditUserName ? (
                <Input
                  bordered={false}
                  type="text"
                  className={styles["item-ipt"]}
                  defaultValue={userName}
                  onChange={changeUserName}
                  autoFocus={true}
                />
              ) : (
                <div className={styles["item-text"]}>{user?.userName}</div>
              )}
              {isEditUserName ? (
                <div className={styles["item-other"]}>
                  <span
                    className={styles["item-cancel"]}
                    onClick={setIsEditUserNameFalse}
                  >
                    取消
                  </span>
                  <span className={styles["item-save"]} onClick={saveUserName}>
                    保存
                  </span>
                </div>
              ) : (
                <span
                  className={styles["item-edit"]}
                  onClick={setIsEditUserNameTrue}
                >
                  编辑
                </span>
              )}
            </div>
            <div className={styles["item"]}>
              {isEditPassword ? (
                <Input.Password
                  bordered={false}
                  className={styles["item-ipt"]}
                  defaultValue={password}
                  onChange={changePassword}
                  autoFocus={true}
                />
              ) : (
                <div className={styles["item-text"]}>******</div>
              )}
              {isEditPassword ? (
                <div className={styles["item-other"]}>
                  <span
                    className={styles["item-cancel"]}
                    onClick={setIsEditPasswordFalse}
                  >
                    取消
                  </span>
                  <span className={styles["item-save"]} onClick={savePassword}>
                    保存
                  </span>
                </div>
              ) : (
                <span
                  className={styles["item-edit"]}
                  onClick={setIsEditPasswordTrue}
                >
                  编辑
                </span>
              )}
            </div>
          </div>
          <div className={styles["title"]}>所属信息</div>
          <div className={styles["box"]}>
            <div className={styles["item"]}>
              <div className={styles["item-title"]}>组名</div>
              <div className={styles["item-text"]}>
                {group?.groupName || "暂无"}
              </div>
            </div>
            <div className={styles["item"]}>
              <div className={styles["item-title"]}>组长</div>
              <div className={styles["item-text"]}>
                {creator?.userName || "暂无"}
              </div>
            </div>
            <div className={styles["item"]}>
              <div className={styles["item-title"]}>管理员</div>
              <div className={styles["item-text"]}>
                {admin?.adminName || "暂无"}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
