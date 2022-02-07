import { useEffect, useState } from "react";
import { Layout, Input, Table, Modal, Button, message, Popconfirm } from "antd";
import {
  PlusOutlined,
  CrownTwoTone,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import GroupCreateForm from "./components/GroupCreateForm";
import httpUtil from "../../../../../utils/httpUtil";
import { joinGroup } from "../../../../../utils/params";
import { getGroupListAC } from "../../../../../redux/actionCreators";
import { useSelector, useDispatch } from "../../../../../redux/hooks";
import SocketConnect from "../../../../../utils/websocket";
import "./clear_ant_css.css";

const { Search } = Input;
const { Content } = Layout;
const { confirm } = Modal;

// 表单获取的数据类型
export interface GroupCreateFormType {
  groupName: string;
  maxCount: number;
}

export default function Hall() {
  // 列表加载
  const loading = useSelector((state) => state.groupList.loading);
  // 数据列表（总）
  const data = useSelector((state) => state.groupList.data);
  // 搜索列表（搜索结果）
  const [searchList, setSearchList] = useState<any>(null);
  // 是否创建分组弹出框
  const [isModalVisible, setIsModalVisible] = useState(false);
  // 获取user,group,admin
  const user = useSelector((state) => state.userInfo.user);
  const group = useSelector((state) => state.userInfo.group);
  const admin = useSelector((state) => state.userInfo.admin);

  // 获取dispatch
  const dispatch = useDispatch();

  // 已有分组加入其他分组
  const switchGroup = (item: any) => {
    if (group.groupName !== item.groupName) {
      confirm({
        title: "已有分组",
        icon: <ExclamationCircleOutlined />,
        content: `要加入该组必须先退出${group.groupName}组, 确定退出吗?`,
        onOk() {
          return httpUtil.quitGroup({ userId: user.userId }).then((res) => {
            SocketConnect.socketConnects.get(group.groupName).closeMyself();
            joinGroup(item);
          });
        },
        onCancel() {},
      });
    } else {
      message.warn("已经加入该分组");
    }
  };

  // 加入分组操作
  const joinGroup = (item: any) => {
    const { groupId, groupName } = item;
    const { userId } = user;
    const data: joinGroup = { groupId, userId };
    httpUtil.connectSocket({
      groupName: groupName,
      callBack: () => {
        httpUtil.joinGroup(data).then((res) => {
          const { status, message: msg } = res;
          if (status === 1) {
            message.warn(msg);
          } else if (status === 0) {
            message.success(msg);
          }
        });
      },
    });
  };

  // 页面上点击加入分组
  const handleJoinGroup = (item: any) => {
    if (group) {
      switchGroup(item);
    } else {
      joinGroup(item);
    }
  };

  const columns = [
    {
      title: "组名",
      dataIndex: "groupName",
      key: "groupName",
      render: (text: any, record: any) => {
        return (
          <span>
            {text}
            {group?.groupId === record.groupId ? (
              <CrownTwoTone style={{ fontSize: 20, marginLeft: 5 }} />
            ) : (
              ""
            )}
          </span>
        );
      },
    },
    {
      title: "人数",
      dataIndex: "maxCount",
      key: "maxCount",
    },
    {
      title: "创建人",
      dataIndex: "creatorName",
      key: "creatorName",
    },
    {
      title: "所属管理员",
      key: "adminId",
      dataIndex: "adminId",
    },
    {
      title: "加入分组",
      key: "action",
      render: (text: any, record: any) => (
        <Popconfirm
          title="确认加入该分组吗?"
          onConfirm={handleJoinGroup.bind(text, record, text)}
          okText="确认"
          cancelText="取消"
        >
          <PlusOutlined
            style={{ fontSize: 20, marginLeft: 17, cursor: "pointer" }}
          />
        </Popconfirm>
      ),
    },
  ];

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  // 搜索
  const search = (value: string) => {
    setSearchList(null);
    const reg = new RegExp(value, "ig");
    const result = data?.filter((item: any) => {
      return item.groupName.search(reg) !== -1;
    });
    setSearchList(result);
  };

  // 清楚搜索框内容时
  const clearSearch = (e: any) => {
    const value = e.target.value;
    if (value === "") {
      setSearchList(null);
    }
  };

  const getGroupList = () => {
    dispatch(getGroupListAC());
  };

  // 提交create group表单
  const onFinish = (values: GroupCreateFormType) => {
    const limitCount = 50;
    const { groupName, maxCount } = values;
    if (isNaN(maxCount * 1) || maxCount * 1 < 0 || maxCount * 1 > limitCount) {
      return message.warn(`请输入0-${limitCount}的数字`);
    }
    if (groupName === "NoGroup") {
      return message.warn("不能以NoGroup为小组名");
    }
    const creatorId: number = user.userId;
    const adminId: number = admin.adminId;
    const data = { ...values, creatorId, adminId };
    httpUtil.createGroup(data).then((res) => {
      const { status, message: msg } = res;
      if (status === 1) {
        message.warn(msg);
      } else if (status === 0) {
        message.success(msg);
        // 关闭创建分组弹窗
        handleCancel();
      }
    });
  };

  useEffect(() => {
    // 获取分组列表
    getGroupList();
    // 连接websocket
    if (admin) {
      httpUtil.connectSocket({
        groupName: "NoGroup",
      });
    }
    if (group) {
      httpUtil.connectSocket({
        groupName: group.groupName,
      });
    }
  }, [admin]);

  return (
    <Content
      className="site-layout-background"
      style={{
        margin: "24px 16px",
        padding: 24,
        minHeight: 280,
      }}
    >
      <Button
        onClick={() => {
          httpUtil.getListMembers({ groupId: group.groupId }).then((res) => {
            console.log(res);
          });
        }}
      >
        获取小组成员
      </Button>
      <Button
        onClick={() => {
          httpUtil.quitGroup({ userId: user.userId }).then((res) => {
            console.log(res);
          });
        }}
      >
        退出分组
      </Button>
      <br />
      <Search placeholder="搜索分组" onSearch={search} onChange={clearSearch} />
      <Button
        className="create-group-btn"
        style={{ float: "right" }}
        onClick={showModal}
      >
        创建分组
      </Button>
      <div style={{ height: 20 }} />
      <Table
        columns={columns}
        dataSource={searchList ? searchList : data}
        loading={loading}
        pagination={{
          hideOnSinglePage: true,
          pageSize: 7,
          total: searchList?.length || data?.length || 0,
        }}
      />
      <Modal
        title="创建分组"
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <GroupCreateForm onFinish={onFinish} />
      </Modal>
    </Content>
  );
}
