import React from "react";
import BG from "../../utils/BG";
import styles from "./index.module.css";
import { User, Admin, Register } from "./components/Form/index";
import { Tabs } from "antd";

const { TabPane } = Tabs;

function callback(key: any) {
  console.log(key);
}

export function Login() {
  return (
    <div>
      <div className={styles["login-wrap"]}>
        <div className={styles["login-top"]}>WSMS</div>
        <Tabs
          className={styles["login-select-form"]}
          defaultActiveKey="1"
          onChange={callback}
          centered={true}
          tabBarGutter={80}
        >
          <TabPane
            className={styles["login-select-form-content"]}
            tab="用户"
            key="1"
          >
            <User />
          </TabPane>
          <TabPane
            className={styles["login-select-form-content"]}
            tab="管理员"
            key="2"
          >
            <Admin />
          </TabPane>
          <TabPane
            className={styles["login-select-form-content"]}
            tab="注册"
            key="3"
          >
            <Register />
          </TabPane>
        </Tabs>
        <div className={styles["login-text"]}>
          Copyright &copy; {new Date().getFullYear()} 王瀚林 版权所有
          <br />
          designed by HXY
        </div>
      </div>
      <BG />
    </div>
  );
}
