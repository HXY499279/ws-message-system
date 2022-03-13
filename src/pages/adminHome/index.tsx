import React, { useEffect, useState } from "react";
import { Layout } from "antd";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import { CenterContent, SideMenu } from "./components/index";
import styles from "./index.module.css";
import { getUserInfoAC } from "../../redux/userInfo/slice";
import { useSelector, useDispatch } from "../../redux/hooks";
import "./clear_ant_css.css";

const { Header, Sider } = Layout;

export function AdminHome() {
  const [collapsed, setCollapsed] = useState(false);

  const user = useSelector((state) => state.userInfo.user);

  const dispatch = useDispatch();
  
  const toggle = () => {
    setCollapsed(!collapsed);
  };
  
  useEffect(() => {
    // 获取个人信息
    dispatch(getUserInfoAC());
  }, []);


  return (
    <>
      <Layout className={styles["layout"]}>
        <Sider
          trigger={null}
          collapsible
          collapsed={collapsed}
          className={styles["sider"]}
        >
          <div className={styles["logo"]}>WSMS</div>
          <div className={styles["side-menu-wraper"]}>
            <SideMenu />
            {React.createElement(collapsed ? RightOutlined : LeftOutlined, {
              onClick: toggle,
              className: styles["trigger"],
            })}
          </div>
        </Sider>
        <Layout className="site-layout">
          <Header className={`site-layout-background ${styles["header"]}`}>
            <span className={styles["hello-user"]}>
              你好, {user?.userName || "管理员"}
            </span>
          </Header>
          <CenterContent />
        </Layout>
      </Layout>
    </>
  );
}
