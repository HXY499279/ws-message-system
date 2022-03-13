import React from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import PublicGroup from './PublicGroup';
import PrivateGroup from './PrivateGroup';
import MyGroup from './MyGroup';
import { Layout } from "antd";
import PersonalCenter from './PersonalCenter';
import { nanoid } from "nanoid";

const { Content } = Layout;

const Routes = [
  {
    path: "/admin/publicGroup",
    component: PublicGroup
  },
  {
    path: "/admin/privateGroup",
    component: PrivateGroup
  },
  {
    path: "/admin/userManage",
    component: MyGroup
  },
  {
    path: "/admin/groupList",
    component: MyGroup
  },
  {
    path: "/admin/personalcenter",
    component: PersonalCenter
  }
]

export function CenterContent() {
  return (
    <Content
      className="site-layout-background"
      style={{
        margin: "24px 16px",
        padding: "0 10px",
        minHeight: "609px",
        maxHeight: "95vh"
      }}
    >
      <Switch>
        {Routes.map((item) => (
          <Route path={item.path} component={item.component} key={nanoid} />
        ))}
        <Redirect path="/admin" to="/admin/groupManage" key={nanoid} />
      </Switch>
    </Content>
  )
}
