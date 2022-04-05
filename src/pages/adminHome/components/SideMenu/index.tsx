import React from "react";
import { Menu, message, Modal } from "antd";
import {
  UsergroupDeleteOutlined,
  SolutionOutlined,
  LogoutOutlined,
  HomeOutlined,
  ExclamationCircleOutlined,
  DeleteOutlined,
  TeamOutlined,
  UserDeleteOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import httpUtil from "../../../../utils/httpUtil";
import { useHistory } from "react-router-dom";
import { useSelector } from "../../../../redux/hooks";
import styles from "./index.module.css";

const { confirm } = Modal;

export function SideMenu() {
  const history = useHistory();

  const group = useSelector((state) => state.userInfo.group);

  const logOut = () => {
    httpUtil.logout();
  };

  const showConfirm = () => {
    confirm({
      title: "您确定退出吗?",
      icon: <ExclamationCircleOutlined />,
      cancelText: "我再想想😐",
      okText: "骗你不成🙄",
      onOk() {
        logOut();
        history.push("/");
      },
      onCancel() {},
    });
  };

  return (
    <Menu
      style={{
        background: "rgb(246, 247, 249)",
        border: "0",
      }}
      mode="inline"
      defaultOpenKeys={["1"]}
      defaultSelectedKeys={["1-sub1"]}
    >
      <Menu.SubMenu
        className={styles["sub-menu"]}
        key="1"
        icon={<TeamOutlined />}
        title="分组管理"
      >
        <Menu.Item key="1-sub1" icon={<TeamOutlined />}>
          <Link to="/admin/groupManage/publicGroup">公共分组</Link>
        </Menu.Item>
        <Menu.Item key="1-sub2" icon={<TeamOutlined />}>
          <Link to="/admin/groupManage/privateGroup">私有分组</Link>
        </Menu.Item>
      </Menu.SubMenu>
      <Menu.SubMenu
        className={styles["sub-menu"]}
        key="2"
        icon={<SolutionOutlined />}
        title="成员管理"
      >
        <Menu.Item key="2-sub1" icon={<TeamOutlined />}>
          <Link to="/admin/userManage/myUser">我的成员</Link>
        </Menu.Item>
        <Menu.Item key="2-sub2" icon={<DeleteOutlined />}>
          <Link to="/admin/userManage/recycleBin">回收站</Link>
        </Menu.Item>
      </Menu.SubMenu>
      <Menu.Item key="3" icon={<UsergroupDeleteOutlined />}>
        <Link to="/admin/adminList">管理员列表</Link>
      </Menu.Item>
      <Menu.Item key="5" icon={<LogoutOutlined />} onClick={showConfirm}>
        登出
      </Menu.Item>
    </Menu>
  );
}
