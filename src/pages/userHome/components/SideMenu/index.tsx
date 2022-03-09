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

  const handleMyGroup = () => {
    if (group) {
      return;
    } else {
      message.warn("请先加入分组或创建分组");
    }
  };

  return (
    <Menu
      style={{
        background: "rgb(246, 247, 249)",
        border: "0",
      }}
      mode="inline"
      defaultSelectedKeys={["1"]}
    >
      <Menu.Item key="1" icon={<HomeOutlined />}>
        <Link to="/user/hall">大厅</Link>
      </Menu.Item>
      <Menu.Item key="2" icon={<SolutionOutlined />}>
        <Link
          onClick={handleMyGroup}
          to={group ? "/user/mygroup" : "/user/hall"}
        >
          我的组
        </Link>
      </Menu.Item>
      <Menu.Item key="3" icon={<UserOutlined />}>
        <Link to="/user/personalcenter">个人中心</Link>
      </Menu.Item>
      <Menu.Item key="4" icon={<LogoutOutlined />} onClick={showConfirm}>
        登出
      </Menu.Item>
    </Menu>
  );
}
