import { useEffect, useState } from "react";
import { Layout, Input, Table, Modal, Button, message, Popconfirm } from "antd";
import ClipboardJS from "clipboard";
import GroupCreateForm from "./components/GroupCreateForm";
import httpUtil from "../../../../../utils/httpUtil";
import { useSelector, useDispatch } from "../../../../../redux/hooks";
import { PRIVATE_GROUP_MESSAGE } from "../../../../../utils/constant";
import styles from "./index.module.css";
import "./clear_ant_css.css";
import { adminCreatePublicGroup } from "../../../../../utils/params";

const { Search } = Input;
const { confirm } = Modal;

// 表单获取的数据类型
export interface GroupCreateFormType {
  groupName: string;
  maxCount: number;
}

export default function PrivateGroup() {
  // 列表加载
  const [loading, setLoading] = useState(true);
  // 数据列表（总）
  const [groupList, setGroupList] = useState<any[]>([]);
  // 搜索列表（搜索结果）
  const [searchList, setSearchList] = useState<any>(null);
  // 是否创建分组弹出框
  const [isModalVisible, setIsModalVisible] = useState(false);
  // 获取user,group,admin
  const admin = useSelector((state) => state.userInfo.admin);

  const [isMyCreateGroup, setIsMyCreateGroup] = useState(true);

  // 获取dispatch
  const dispatch = useDispatch();

  const clickCopy = () => {
    message.success("复制成功");
  };

  const getGroupList = () => {
    setLoading(true);
    httpUtil.getMyPublicGroupList({ adminId: admin.adminId }).then((res) => {
      setGroupList(res.data);
      setLoading(false);
    });
  };

  const deleteGroup = (groupId: string) => {
    httpUtil.dismissPublicGroup({ groupId: `${groupId}` }).then((res) => {
      getGroupList();
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
      title: "最大连接",
      dataIndex: "maxCount",
      key: "maxCount",
    },
    {
      title: "websocket地址",
      dataIndex: "groupName",
      key: "groupName",
      render: (text: any, record: any) => {
        const { adminId, groupName } = record;
        return (
          <span
            id={`webscoketPath_${record.groupName}`}
          >{`ws://47.108.139.22:8888/websocket?groupName=${groupName}&adminId=${adminId}&scene=${PRIVATE_GROUP_MESSAGE}`}</span>
        );
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
            <Button
              className="copy-websocket-path"
              style={{ marginRight: 20 }}
              type="primary"
              data-clipboard-target={`#webscoketPath_${record.groupName}`}
              onClick={clickCopy}
            >
              复制地址
            </Button>
            <Popconfirm
              title="确认删除该分组吗?"
              onConfirm={deleteGroup.bind(record, record.groupId)}
              okText="确认"
              cancelText="取消"
            >
              <Button danger>删除分组</Button>
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
    const result = groupList?.filter((item: any) => {
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
    const adminId: number = admin.adminId;
    const data: adminCreatePublicGroup = { ...values, adminId };
    httpUtil.adminCreatePublicGroup(data).then((res) => {
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

  const markMyCreateGroup = () => {
    setIsMyCreateGroup(true);
    getGroupList();
  };
  
  const markOtherCreateGroup = () => {
    setLoading(true);
    setIsMyCreateGroup(false);
    httpUtil.getOutsidePublicGroupList().then((res) => {
      const { data } = res;
      setGroupList(data);
      setLoading(false);
    });
  };

  useEffect(() => {
    // 获取管理员分组列表
    new ClipboardJS(".copy-websocket-path");
    if (admin) {
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
                  isMyCreateGroup ? "my-create-group-mark" : "my-create-group"
                }`
              ]
            }
            onClick={markMyCreateGroup}
          >
            我创建的组
          </span>
          <span
            className={
              styles[
                `${
                  isMyCreateGroup
                    ? "other-create-group"
                    : "other-create-group-mark"
                }`
              ]
            }
            onClick={markOtherCreateGroup}
          >
            外部创建的组
          </span>
        </div>
      </div>
      <Search placeholder="搜索分组" onSearch={search} onChange={clearSearch} />
      {isMyCreateGroup && (
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
        dataSource={searchList ? searchList : groupList}
        loading={loading}
        pagination={{
          hideOnSinglePage: true,
          pageSize: 6,
          total: searchList?.length || groupList?.length || 0,
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
