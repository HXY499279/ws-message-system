import React from "react";
import { message } from "antd";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import Routes from "./utils/routes";
import { nanoid } from "nanoid";
import "antd/dist/antd.css";

message.config({
  top: 50,
  maxCount: 3,
});

export default function App() {
  return (
    <div>
      <BrowserRouter>
        <Switch>
          {Routes.map((item) => (
            <Route
              exact={item.exact}
              path={item.path}
              component={item.component}
              key={nanoid()}
            />
          ))}
        </Switch>
      </BrowserRouter>
    </div>
  );
}
