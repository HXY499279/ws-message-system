import { useEffect, useState } from "react";
import {
  Form,
  Select,
  Input,
  Table,
  Modal,
  Button,
  message,
  Popconfirm,
  Space,
} from "antd";
import {
  PlusOutlined,
  CrownTwoTone,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import GroupCreateForm from "./components/GroupCreateForm";
import httpUtil from "../../../../../utils/httpUtil";
import { joinGroup } from "../../../../../utils/params";
import {
  getWithAdminGroupListAC,
  getUserInfoAC,
  getAdminListAC,
} from "../../../../../redux/actionCreators";
import { useSelector, useDispatch } from "../../../../../redux/hooks";
import SocketConnect from "../../../../../utils/websocket";
import "./clear_ant_css.css";
import { useHistory } from "react-router-dom";
import {
  NO_GROUP,
  GROUP_HALL_LIST,
  PRIVATE_GROUP_MESSAGE,
} from "../../../../../utils/constant";
import { nanoid } from "nanoid";

const { Search } = Input;
const { confirm } = Modal;
const { Option } = Select;

// 表单获取的数据类型
export interface GroupCreateFormType {
  groupName: string;
  maxCount: number;
}

export default function Hall() {
  // 获取history
  const history = useHistory();
  // 获取dispatch
  const dispatch = useDispatch();

  // 列表加载
  const loading = useSelector((state) => state.withAdminGroupList.loading);
  // 数据列表（总）
  const data = useSelector((state) => state.withAdminGroupList.data);
  // 搜索列表（搜索结果）
  const [searchList, setSearchList] = useState<any>(null);
  // 是否显示创建分组弹出框
  const [isModalVisible, setIsModalVisible] = useState(false);
  // 是否显示选择管理员弹出框
  const [isChoiceAdminVisible, setIsChoiceAdminVisible] = useState(false);
  // 管理员列表
  const adminList = useSelector((state) => state.adminList.data);

  // 获取user,group,admin
  const user = useSelector((state) => state.userInfo.user);
  const group = useSelector((state) => state.userInfo.group);
  const admin = useSelector((state) => state.userInfo.admin);

  // 已有分组切换到其他分组
  const switchGroup = (item: any) => {
    if (group.groupId === item.groupId) {
      message.warn("已在该组内");
    } else if (user.userId === group.creatorId) {
      message.warn("创建了分组后, 不能加入其他分组");
    } else if (group.groupId !== item.groupId) {
      confirm({
        title: "已有分组",
        icon: <ExclamationCircleOutlined />,
        content: `要加入该组必须先退出${group.groupName}组, 确定退出吗?`,
        onOk() {
          return httpUtil.quitGroup({ userId: user.userId }).then((res) => {
            // 加入新分组前先断开旧分组连接
            SocketConnect.socketConnects.get(group.groupName).closeMyself();
            joinGroup(item);
          });
        },
        onCancel() {},
      });
    }
  };

  // 加入分组操作
  const joinGroup = (item: any) => {
    const { groupId, groupName } = item;
    const { userId } = user;
    const data: joinGroup = { groupId, userId };

    httpUtil.joinGroup(data).then((res) => {
      const { status, message: msg } = res;
      if (status === 1) {
        message.warn(msg);
      } else if (status === 0) {
        message.success(msg);
        dispatch(getUserInfoAC());
        history.push("/user/mygroup");
      }
    });
  };

  // 页面上点击加入分组
  const handleJoinGroup = (item: any) => {
    if (group) {
      switchGroup(item);
    } else {
      joinGroup(item);
    }
    dispatch(getUserInfoAC());
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
    admin && dispatch(getWithAdminGroupListAC(admin.adminId));
  };

  // 提交create group表单
  const onFinish = (values: GroupCreateFormType) => {
    if (group) {
      return message.warn(
        `您已加入分组${group.groupName}, 若要创建分组, 请先退出分组`
      );
    }
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
    const data = { ...values, creatorId, adminId, adminCreated: false };
    httpUtil.createGroup(data).then((res) => {
      const { status, message: msg } = res;
      if (status === 1) {
        message.warn(msg);
      } else if (status === 0) {
        message.success(msg);
        history.push("/user/mygroup");
        // 关闭创建分组弹窗
        handleCancel();
      }
    });
  };

  const confirmChoiceAdmin = (values: any) => {
    httpUtil.choiceAdmin(values).then((res) => {
      const { message: msg } = res;
      message.success(msg);
      dispatch(getUserInfoAC());
      setIsChoiceAdminVisible(false);
    });
  };

  useEffect(() => {
    // 如果没有管理员，就选择管理员
    if (admin === null) {
      dispatch(getAdminListAC());
      setIsChoiceAdminVisible(true);
    }

    // 获取分组列表
    getGroupList();
    // 连接websocket
    if (admin) {
      httpUtil.connectSocket({
        groupName: NO_GROUP,
        scene: GROUP_HALL_LIST,
      });
    }
    if (group && admin) {
      httpUtil.connectSocket({
        groupName: group.groupName,
        scene: PRIVATE_GROUP_MESSAGE,
      });
    }
  }, [admin]);

  return (
    <>
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
    </>
  );
}
