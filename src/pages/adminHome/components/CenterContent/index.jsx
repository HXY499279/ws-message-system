import { Route, Switch, Redirect } from "react-router-dom";
import PublicGroup from './PublicGroup';
import PrivateGroup from './PrivateGroup';
import AdminList from './AdminList';
import MyUser from './MyUser'
import RecycleBin from './RecycleBin'
import { Layout } from "antd";
import { nanoid } from "nanoid";

const { Content } = Layout;

const Routes = [
  {
    path: "/admin/groupManage/publicGroup",
    component: PublicGroup
  },
  {
    path: "/admin/groupManage/privateGroup",
    component: PrivateGroup
  },
  {
    path: "/admin/userManage/myUser",
    component: MyUser
  },
  {
    path: "/admin/userManage/recycleBin",
    component: RecycleBin
  },
  {
    path: "/admin/adminList",
    component: AdminList
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
        <Redirect path="/admin" to="/admin/groupManage/publicGroup" key={nanoid} />
      </Switch>
    </Content>
  )
}
