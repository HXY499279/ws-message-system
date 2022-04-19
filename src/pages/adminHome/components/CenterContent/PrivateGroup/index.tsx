import { useEffect, useState } from "react";
import { Input, Table, Modal, Button, message, Popconfirm } from "antd";
import GroupCreateForm from "./components/GroupCreateForm";
import httpUtil from "../../../../../utils/httpUtil";
import { useSelector, useDispatch } from "../../../../../redux/hooks";
import styles from "./index.module.css";
import "./clear_ant_css.css";
import { adminCreateGroup } from "../../../../../utils/params";
import {
  GROUP_HALL_LIST,
  NO_GROUP,
  PRIVATE_GROUP_WITHOUT_ADMIN_LIST,
  USER_WITH_ADMIN_LIST,
} from "../../../../../utils/constant";
import {
  getWithAdminGroupListAC,
  getWithoutAdminGroupListAC,
} from "../../../../../redux/actionCreators";

const { Search } = Input;

// 表单获取的数据类型
export interface GroupCreateFormType {
  groupName: string;
  maxCount: number;
}

export default function PublicGroup() {
  // 列表加载
  const withAdminGroupListLoading = useSelector(
    (state) => state.withAdminGroupList.loading
  );
  // 数据列表（总）
  const groupList = useSelector((state) => state.withAdminGroupList.data);
  // 搜索列表（搜索结果）
  const [searchList, setSearchList] = useState<any>(null);
  // 是否创建分组弹出框
  const [isModalVisible, setIsModalVisible] = useState(false);
  // 获取user,group,admin
  const admin = useSelector((state) => state.userInfo.admin);

  // 获取未指定管理员的分组
  const withoutAdminGroupList = useSelector(
    (state) => state.withoutAdminGroupList.data
  );
  const withoutAdminGroupListLoading = useSelector(
    (state) => state.withoutAdminGroupList.loading
  );

  const [isMyManageGroup, setIsMyManageGroup] = useState(true);

  const dispatch = useDispatch();

  const giveUpManage = (groupId: string) => {
    httpUtil.giveUpManagePrivateGroup({ groupId }).then((res) => {
      getGroupList();
      message.success(res.message);
    });
  };

  const choiceManage = (groupId: string) => {
    httpUtil.choiceManagePrivateGroup(+groupId).then((res) => {
      dispatch(getWithoutAdminGroupListAC());
      message.success(res.message);
    });
  };

  const getGroupList = () => {
    dispatch(getWithAdminGroupListAC(admin.adminId));
  };

  const deleteGroup = (groupId: string) => {
    httpUtil.removeGroup(+groupId).then((res) => {
      isMyManageGroup ? getGroupList() : dispatch(getWithoutAdminGroupListAC());
      message.success(res.message);
    });
  };

  const columns = [
    {
      title: "组名",
      dataIndex: "groupName",
      key: "groupName",
    },
    {
      title: "最大人数",
      dataIndex: "maxCount",
      key: "maxCount",
    },
    {
      title: "创建人",
      dataIndex: "creatorName",
      key: "creatorName",
      render: (text: string, record: any) => {
        return record.adminCreated
          ? record.adminName || <span style={{ color: "silver" }}>无</span>
          : text || <span style={{ color: "silver" }}>无</span>;
      },
    },
    {
      title: "操作",
      dataIndex: "groupName",
      key: "groupName",
      width: "300px",
      render: (text: any, record: any) => {
        return (
          <div className="btn-wraper">
            <Popconfirm
              title={
                isMyManageGroup ? "确认放弃管理该分组吗?" : "确认管理该分组吗?"
              }
              onConfirm={
                isMyManageGroup
                  ? giveUpManage.bind(record, record.groupId)
                  : choiceManage.bind(record, record.groupId)
              }
              okText="确认"
              cancelText="取消"
            >
              {isMyManageGroup ? (
                <Button
                  className="abandon-group"
                  style={{
                    marginRight: 20,
                    borderColor: "#e4a826",
                    color: "#FFF",
                    backgroundColor: "#e4a826",
                  }}
                  danger
                >
                  放弃管理
                </Button>
              ) : (
                <Button
                  className="abandon-group"
                  style={{ marginRight: 20 }}
                  type="primary"
                >
                  管理该组
                </Button>
              )}
            </Popconfirm>
            <Popconfirm
              title="确认删除该分组吗?"
              onConfirm={deleteGroup.bind(record, record.groupId)}
              okText="确认"
              cancelText="取消"
            >
              <Button type="primary" danger>
                删除分组
              </Button>
            </Popconfirm>
          </div>
        );
      },
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
    const result = (
      isMyManageGroup ? groupList : withoutAdminGroupList
    )?.filter((item: any) => {
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
    const adminId: string = admin.adminId;
    const data: adminCreateGroup = {
      ...values,
      adminId,
      adminCreated: true,
      creatorId: null,
    };
    httpUtil.adminCreateGroup(data).then((res) => {
      const { status, message: msg } = res;
      if (status === 1) {
        message.warn(msg);
      } else if (status === 0) {
        message.success(msg);
        getGroupList();
        // 关闭创建分组弹窗
        handleCancel();
      }
    });
  };

  const markMyManageGroup = () => {
    setIsMyManageGroup(true);
    getGroupList();
  };
  const markWithoutAdminGroup = () => {
    dispatch(getWithoutAdminGroupListAC());
    setIsMyManageGroup(false);
  };

  useEffect(() => {
    // 获取管理员分组列表
    if (admin) {
      httpUtil.connectSocket({
        groupName: NO_GROUP,
        scene: PRIVATE_GROUP_WITHOUT_ADMIN_LIST,
      });
      httpUtil.connectSocket({
        groupName: NO_GROUP,
        scene: USER_WITH_ADMIN_LIST,
      });
      httpUtil.connectSocket({
        groupName: NO_GROUP,
        scene: GROUP_HALL_LIST,
      });
      getGroupList();
    }
  }, [admin]);

  return (
    <>
      <div className={styles["switch-wraper"]}>
        <div className={styles["switch"]}>
          <span
            className={
              styles[
                `${
                  isMyManageGroup ? "my-create-group-mark" : "my-create-group"
                }`
              ]
            }
            onClick={markMyManageGroup}
          >
            我管理的分组
          </span>
          <span
            className={
              styles[
                `${
                  isMyManageGroup
                    ? "other-create-group"
                    : "other-create-group-mark"
                }`
              ]
            }
            onClick={markWithoutAdminGroup}
          >
            未指定管理员的分组
          </span>
        </div>
      </div>
      <Search placeholder="搜索分组" onSearch={search} onChange={clearSearch} />
      {isMyManageGroup && (
        <Button
          className="create-group-btn"
          style={{ float: "right", marginRight: 20 }}
          onClick={showModal}
        >
          创建分组
        </Button>
      )}
      <div style={{ height: 20 }} />
      <Table
        columns={columns}
        dataSource={
          searchList
            ? searchList
            : isMyManageGroup
            ? groupList
            : withoutAdminGroupList
        }
        loading={
          isMyManageGroup
            ? withAdminGroupListLoading
            : withoutAdminGroupListLoading
        }
        pagination={{
          hideOnSinglePage: true,
          pageSize: 6,
          total: isMyManageGroup
            ? searchList?.length || groupList?.length || 0
            : searchList?.length || withoutAdminGroupList?.length || 0,
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
    </>
  );
}
