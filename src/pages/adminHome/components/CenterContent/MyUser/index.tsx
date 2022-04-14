import { useEffect, useState } from "react";
import { Input, Table, Modal, Button, message, Popconfirm } from "antd";
import httpUtil from "../../../../../utils/httpUtil";
import { useSelector, useDispatch } from "../../../../../redux/hooks";
import styles from "./index.module.css";
import "./clear_ant_css.css";
import {
  GROUP_HALL_LIST,
  NO_GROUP,
  PRIVATE_GROUP_WITHOUT_ADMIN_LIST,
  USER_WITHOUT_ADMIN_LIST,
  USER_WITH_ADMIN_LIST,
} from "../../../../../utils/constant";
import {
  getWithoutAdminUserListAC,
  getWithAdminUserListAC,
} from "../../../../../redux/actionCreators";

const { Search } = Input;

export default function MyUser() {
  // 列表加载
  const witAdminNoDeleteUserListLoading = useSelector(
    (state) => state.withAdminUserList.loading
  );
  // 数据列表（总）
  const withAdminNoDeleteUserList = useSelector(
    (state) => state.withAdminUserList.nodeleteResult
  );
  // 搜索列表（搜索结果）
  const [searchList, setSearchList] = useState<any>(null);
  // 获取user,group,admin
  const admin = useSelector((state) => state.userInfo.admin);

  // 获取未指定管理员的用户
  const withoutAdminNoDeleteUserList = useSelector(
    (state) => state.withoutAdminUserList.nodeleteResult
  );
  const withoutAdminNoDeleteUserListLoading = useSelector(
    (state) => state.withoutAdminUserList.loading
  );

  const [isMyManageGroup, setIsMyManageGroup] = useState(true);

  const dispatch = useDispatch();

  const giveUpManage = (userId: string, groupId: string) => {
    httpUtil.giveUpManageUser({ userId, groupId }).then((res) => {
      getUserList();
      message.success(res.message);
    });
  };

  const choiceManage = (userId: string, groupId: string) => {
    // setLoading(true);
    httpUtil.choiceUserToManage({ userId, groupId }).then((res) => {
      dispatch(getWithoutAdminUserListAC());
      // setLoading(false);
      message.success(res.message);
    });
  };

  const getUserList = () => {
    dispatch(getWithAdminUserListAC(admin.adminId));
  };

  const deleteGroup = (userId: string) => {
    httpUtil.logicalDeleteUser({ userId }).then((res) => {
      isMyManageGroup ? getUserList() : dispatch(getWithoutAdminUserListAC());
      message.success(res.message);
    });
  };

  const columns = [
    {
      title: "用户名",
      dataIndex: "userName",
      key: "userName",
    },
    {
      title: "密码",
      dataIndex: "password",
      key: "password",
    },
    {
      title: "组",
      dataIndex: "groupName",
      key: "groupName",
      render: (text: string) => {
        return text || <span style={{ color: "silver" }}>暂无分组</span>;
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
                isMyManageGroup ? "确认放弃管理该用户吗?" : "确认管理该用户吗?"
              }
              onConfirm={
                isMyManageGroup
                  ? giveUpManage.bind(record, record?.userId, record?.groupId)
                  : choiceManage.bind(record, record?.userId, record?.groupId)
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
                  纳入管理
                </Button>
              )}
            </Popconfirm>
            <Popconfirm
              title="确认删除该用户吗?"
              onConfirm={deleteGroup.bind(record, record?.userId)}
              okText="确认"
              cancelText="取消"
            >
              <Button type="primary" danger>
                删除用户
              </Button>
            </Popconfirm>
          </div>
        );
      },
    },
  ];

  // 搜索
  const search = (value: string) => {
    setSearchList(null);
    const reg = new RegExp(value, "ig");
    const result = (
      isMyManageGroup ? withAdminNoDeleteUserList : withoutAdminNoDeleteUserList
    )?.filter((item: any) => {
      return item.userName.search(reg) !== -1;
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

  const markMyManageGroup = () => {
    setIsMyManageGroup(true);
    getUserList();
  };
  const markWithoutAdminGroup = () => {
    setIsMyManageGroup(false);
    dispatch(getWithoutAdminUserListAC());
  };

  useEffect(() => {
    if (admin) {
      httpUtil.connectSocket({
        groupName: NO_GROUP,
        scene: PRIVATE_GROUP_WITHOUT_ADMIN_LIST,
      });
      httpUtil.connectSocket({
        groupName: NO_GROUP,
        scene: GROUP_HALL_LIST,
      });
      httpUtil.connectSocket({
        groupName: NO_GROUP,
        scene: USER_WITHOUT_ADMIN_LIST,
      });
      httpUtil.connectSocket({
        groupName: NO_GROUP,
        scene: USER_WITH_ADMIN_LIST,
      });
      getUserList();
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
            我管理的用户
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
            未指定管理员的用户
          </span>
        </div>
      </div>
      <Search placeholder="搜索用户" onSearch={search} onChange={clearSearch} />
      <div style={{ height: 20 }} />
      <Table
        columns={columns}
        dataSource={
          searchList
            ? searchList
            : isMyManageGroup
            ? withAdminNoDeleteUserList
            : withoutAdminNoDeleteUserList
        }
        loading={
          isMyManageGroup ? witAdminNoDeleteUserListLoading : withoutAdminNoDeleteUserListLoading
        }
        pagination={{
          hideOnSinglePage: true,
          pageSize: 6,
          total: isMyManageGroup
            ? searchList?.length || withAdminNoDeleteUserList?.length || 0
            : searchList?.length || withoutAdminNoDeleteUserList?.length || 0,
        }}
      />
    </>
  );
}
