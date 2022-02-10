import React from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import Hall from './Hall';
import MyGroup from './MyGroup';
import { Layout } from "antd";
import PersonalCenter from './PersonalCenter';
import { nanoid } from "nanoid";

const { Content } = Layout;

const Routes = [
  {
    path: "/user/hall",
    component: Hall
  },
  {
    path: "/user/mygroup",
    component: MyGroup
  },
  {
    path: "/user/personalcenter",
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
        <Redirect path="/user" to="/user/hall" key={nanoid} />
      </Switch>
    </Content>
  )
}
