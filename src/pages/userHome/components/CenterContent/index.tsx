import React, { useEffect, useState } from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import Hall from "./Hall";
import MyGroup from "./MyGroup";
import { Form, Layout, Modal, Select, Button, message } from "antd";
import PersonalCenter from "./PersonalCenter";
import { nanoid } from "nanoid";
import { useDispatch, useSelector } from "../../../../redux/hooks";
import httpUtil from "../../../../utils/httpUtil";
import {
  getAdminListAC,
  getUserInfoAC,
  setIsChoiceAdminVisibleAC,
} from "../../../../redux/actionCreators";
import {
  GROUP_HALL_LIST,
  NO_GROUP,
  PRIVATE_GROUP_MESSAGE,
  USER_WITHOUT_ADMIN_LIST,
  USER_WITH_ADMIN_LIST,
} from "../../../../utils/constant";
import SocketConnect from "../../../../utils/websocket";

const { Content } = Layout;
const { Option } = Select;

const Routes = [
  {
    path: "/user/hall",
    component: Hall,
  },
  {
    path: "/user/mygroup",
    component: MyGroup,
  },
  {
    path: "/user/personalcenter",
    component: PersonalCenter,
  },
];

export function CenterContent() {
  // 获取dispatch
  const dispatch = useDispatch();

  // 是否显示选择管理员弹出框
  const isChoiceAdminVisible = useSelector(
    (state) => state.choiceAdmin.IsChoiceAdminVisible
  );

  // 管理员列表
  const adminList = useSelector((state) => state.adminList.data);
  // 获取user,group,admin
  const user = useSelector((state) => state.userInfo.user);
  const group = useSelector((state) => state.userInfo.group);
  const admin = useSelector((state) => state.userInfo.admin);

  const confirmChoiceAdmin = (values: any) => {
    httpUtil.choiceAdmin(values).then((res) => {
      const { message: msg } = res;
      message.success(msg);
      dispatch(getUserInfoAC());
      dispatch(setIsChoiceAdminVisibleAC(false));
    });
  };

  useEffect(() => {
    // 如果没有管理员，并且自己是组长，就选择管理员
    if (user?.userId === group?.creatorId) {
      if (admin === null) {
        dispatch(getAdminListAC());
        dispatch(setIsChoiceAdminVisibleAC(true));
      } else {
        // 管理员那边选择了管理本组后，关闭选择管理员弹窗
        dispatch(setIsChoiceAdminVisibleAC(false));
      }
    }
    // 连接websocket
    if (admin) {
      httpUtil.connectSocket({
        groupName: NO_GROUP,
        scene: GROUP_HALL_LIST,
      });
      httpUtil.connectSocket({
        groupName: NO_GROUP,
        scene: USER_WITH_ADMIN_LIST,
      });
      // 如果连接上了USER_WITH_ADMIN_LIST就手动关闭错误连接上的USER_WITHOUT_ADMIN_LIST
      try {
        SocketConnect.getConnectInstance(
          "NoGroup-userWithoutAdminList"
        )?.closeMyself("NoGroup-userWithoutAdminList");
      } catch (error) {
        console.log("关闭失败");
      }
      
      if (group) {
        httpUtil.connectSocket({
          groupName: group.groupName,
          scene: PRIVATE_GROUP_MESSAGE,
        });
      }
    } else {
      httpUtil.connectSocket({
        groupName: NO_GROUP,
        scene: USER_WITHOUT_ADMIN_LIST,
      });
    }
  }, [admin]);

  return (
    <Content
      className="site-layout-background"
      style={{
        margin: "24px 16px",
        padding: "0 10px",
        minHeight: "609px",
        maxHeight: "95vh",
      }}
    >
      <Switch>
        {Routes.map((item) => (
          <Route path={item.path} component={item.component} key={item.path} />
        ))}
        <Redirect path="/user" to="/user/hall" key={nanoid()} />
      </Switch>
      <Modal
        title="选择管理员"
        visible={isChoiceAdminVisible}
        footer={null}
        closable={false}
      >
        <Form onFinish={confirmChoiceAdmin}>
          <Form.Item name="adminId">
            <Select placeholder="请选择你的管理员">
              {adminList?.map((item: any) => {
                return (
                  <Option value={item.adminId} key={nanoid()}>
                    {item.adminName}
                  </Option>
                );
              })}
            </Select>
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              style={{ width: "100%", marginTop: 20 }}
              htmlType="submit"
            >
              确定
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </Content>
  );
}
