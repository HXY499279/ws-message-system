import React from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import Hall from './Hall';
import MyGroup from './MyGroup';
import PersonalCenter from './PersonalCenter';
import { nanoid } from "nanoid";


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
    <Switch>
      {Routes.map((item) => (
        <Route path={item.path} component={item.component} key={nanoid} />
      ))}
      <Redirect path="/user" to="/user/hall" key={nanoid} />
    </Switch>
  );
}
