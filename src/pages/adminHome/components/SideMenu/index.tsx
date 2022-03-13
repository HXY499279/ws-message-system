import React from "react";
import { Menu, message, Modal } from "antd";
import {
  UserOutlined,
  SolutionOutlined,
  LogoutOutlined,
  HomeOutlined,
  ExclamationCircleOutlined,
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
      defaultSelectedKeys={["sub1"]}
    >
      <Menu.SubMenu
        className={styles["sub-menu"]}
        key="1"
        icon={<HomeOutlined />}
        title="分组管理"
      >
        <Menu.Item key="sub1" icon={<HomeOutlined />}>
          <Link to="/admin/publicGroup">公共分组</Link>
        </Menu.Item>
        <Menu.Item key="sub2" icon={<HomeOutlined />}>
          <Link to="/admin/privateGroup">私有分组</Link>
        </Menu.Item>
      </Menu.SubMenu>
      <Menu.Item key="2" icon={<SolutionOutlined />}>
        <Link to="/admin/userManage">用户管理</Link>
      </Menu.Item>
      <Menu.Item key="3" icon={<UserOutlined />}>
        <Link to="/admin/adminList">管理员列表</Link>
      </Menu.Item>
      <Menu.Item key="4" icon={<UserOutlined />}>
        <Link to="/admin/personalcenter">个人信息</Link>
      </Menu.Item>
      <Menu.Item key="5" icon={<LogoutOutlined />} onClick={showConfirm}>
        登出
      </Menu.Item>
    </Menu>
  );
}
