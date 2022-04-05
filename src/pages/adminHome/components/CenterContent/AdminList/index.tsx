import { useEffect, useState } from "react";
import { Table, Button, Modal, Input, message, Space, Form } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { useSelector, useDispatch } from "../../../../../redux/hooks";
import { getAdminListAC } from "../../../../../redux/actionCreators";
import { useHistory } from "react-router-dom";
import httpUtil from "../../../../../utils/httpUtil";
import styles from "./index.module.css";
import { ADMIN_LIST, NO_GROUP } from "../../../../../utils/constant";

const { confirm } = Modal;

export default function AdminList() {
  const history = useHistory();
  const dispatch = useDispatch();

  const admin = useSelector((state) => state.userInfo.admin);
  const adminList = useSelector((state) => state.adminList.data);
  // 管理员列表的loading
  const pageLoading = useSelector((state) => state.adminList.loading);
  // 修改账号密码时所选中的管理员
  const [curAdmin, setCurAdmin] = useState<any>({});
  // 管理员修改账号密码的modal框的可见状态
  const [changeAdminVisible, setChangeAdminVisible] = useState(false);
  // 新增管理员账号的modal框的可见状态
  const [addAdminVisible, setAddAdminVisible] = useState(false);
  // 新增管理员账户的loading
  const [addAdminLoading, setAddAdminLoading] = useState(false);
  // 编辑状态
  const [isEditUserName, setIsEditUserName] = useState(false);
  const [isEditPassword, setIsEditPassword] = useState(false);
  // 用户名，密码
  const [adminName, setAdminName] = useState<string | null>(null);
  const [password, setPassword] = useState<string | null>(null);
  // 改变编辑状态为可编辑
  const setIsEditUserNameTrue = () => {
    setIsEditUserName(true);
  };

  const setIsEditPasswordTrue = () => {
    setIsEditPassword(true);
  };

  // 改变编辑状态为不可编辑
  const setIsEditUserNameFalse = () => {
    setAdminName(null);
    setIsEditUserName(false);
  };

  const setIsEditPasswordFalse = () => {
    setPassword(null);
    setIsEditPassword(false);
  };

  // 修改信息
  const changeUserName = (e: any) => {
    const { value } = e.target;
    setAdminName(value);
  };
  const changePassword = (e: any) => {
    const { value } = e.target;
    setPassword(value);
  };

  const getAdminList = () => {
    dispatch(getAdminListAC());
  };

  // 保存信息
  const saveUserName = () => {
    if (!adminName) {
      setAdminName(null);
      return message.warn("用户名不能为空");
    }
    httpUtil
      .updateAdminNameAndPassword({
        adminId: curAdmin.adminId,
        password: password || curAdmin.password,
        adminName,
      })
      .then(
        (res) => {
          setIsEditUserName(false);
          getAdminList();
          message.success("修改成功");
        },
        (err) => {
          message.warn(err.errInfo);
        }
      );
  };
  const savePassword = () => {
    if (!password) {
      setPassword(null);
      return message.warn("密码不能为空");
    }
    httpUtil
      .updateAdminNameAndPassword({
        adminId: curAdmin.adminId,
        password,
        adminName: adminName || curAdmin.adminName,
      })
      .then(
        (res) => {
          setIsEditPassword(false);
          getAdminList();
          message.success("修改成功");
        },
        (err) => {
          message.warn(err.errInfo);
        }
      );
  };

  const showChangeAdminModal = (record: any) => {
    setCurAdmin(record);
    setAdminName(record.adminName);
    setPassword(record.password);
    setChangeAdminVisible(true);
  };

  const cancleChangeAdminVisible = () => {
    setChangeAdminVisible(false);
    setIsEditUserName(false);
    setIsEditPassword(false);
  };

  const columns = [
    {
      title: "管理员名",
      dataIndex: "adminName",
      key: "adminName",
    },
    {
      title: "管理员密码",
      dataIndex: "password",
      key: "password",
    },
    {
      title: "操作",
      dataIndex: "adminId",
      key: "adminId",
      render(text: string, record: any) {
        return (
          <Button
            type="primary"
            onClick={showChangeAdminModal.bind(record, record)}
          >
            修改密码
          </Button>
        );
      },
    },
  ];

  const deleteMyAccount = () => {
    const { adminId } = admin;
    confirm({
      title: "您想要注销您的管理员账号吗？",
      icon: <ExclamationCircleOutlined />,
      content: "该操作不可逆！",
      onOk() {
        httpUtil.deleteAdmin({ adminId }).then((res) => {
          console.log(res);
          const { status, message: msg, data } = res;
          if (!status) {
            message.success(msg);
            setTimeout(() => {
              history.push("/");
            }, 500);
          } else {
            message.warning(data);
          }
        });
      },
      okText: "确认",
      cancelText: "取消",
    });
  };

  const showAddAdminModal = () => {
    setAddAdminVisible(true);
  };

  const cancleAdminVisible = () => {
    setAddAdminVisible(false);
  };

  const onAddAdminFinish = (values: any) => {
    setAddAdminLoading(true);
    httpUtil.registerAdmin(values).then(
      (res) => {
        setAddAdminLoading(false);
        message.success(res.message);
        // getAdminList();
        setAddAdminVisible(false);
      },
      (err) => {
        setAddAdminLoading(false);
      }
    );
  };

  useEffect(() => {
    getAdminList();
    if (admin) {
      httpUtil.connectSocket({
        groupName: NO_GROUP,
        scene: ADMIN_LIST,
      });
    }
  }, [admin]);

  return (
    <>
      <Table
        columns={columns}
        dataSource={adminList}
        loading={pageLoading}
        pagination={{
          pageSize: 7,
        }}
      />
      <div className={styles["btn-wraper"]}>
        <Space>
          <Button type="primary" danger onClick={deleteMyAccount}>
            注销我的账号
          </Button>
          <Button type="primary" onClick={showAddAdminModal}>
            新增管理员账号
          </Button>
        </Space>
      </div>
      <Modal
        title="更改账号密码"
        visible={changeAdminVisible}
        onCancel={cancleChangeAdminVisible}
        footer={null}
      >
        <div className={styles["item"]}>
          {isEditUserName ? (
            <Input
              bordered={false}
              type="text"
              className={styles["item-ipt"]}
              defaultValue={adminName || curAdmin?.adminName}
              onChange={changeUserName}
              autoFocus={true}
            />
          ) : (
            <div className={styles["item-text"]}>
              {adminName || curAdmin?.adminName}
            </div>
          )}
          {isEditUserName ? (
            <div className={styles["item-other"]}>
              <span
                className={styles["item-cancel"]}
                onClick={setIsEditUserNameFalse}
              >
                取消
              </span>
              <span className={styles["item-save"]} onClick={saveUserName}>
                保存
              </span>
            </div>
          ) : (
            <span
              className={styles["item-edit"]}
              onClick={setIsEditUserNameTrue}
            >
              编辑
            </span>
          )}
        </div>
        <div className={styles["item"]}>
          {isEditPassword ? (
            <Input.Password
              bordered={false}
              className={styles["item-ipt"]}
              defaultValue={password || curAdmin.password}
              onChange={changePassword}
              autoFocus={true}
            />
          ) : (
            <div className={styles["item-text"]}>******</div>
          )}
          {isEditPassword ? (
            <div className={styles["item-other"]}>
              <span
                className={styles["item-cancel"]}
                onClick={setIsEditPasswordFalse}
              >
                取消
              </span>
              <span className={styles["item-save"]} onClick={savePassword}>
                保存
              </span>
            </div>
          ) : (
            <span
              className={styles["item-edit"]}
              onClick={setIsEditPasswordTrue}
            >
              编辑
            </span>
          )}
        </div>
      </Modal>
      <Modal
        title="新增管理员账号"
        visible={addAdminVisible}
        onCancel={cancleAdminVisible}
        footer={null}
      >
        <Form
          name="basic"
          labelCol={{ span: 5, offset: 1 }}
          wrapperCol={{ span: 16 }}
          initialValues={{ remember: true }}
          onFinish={onAddAdminFinish}
          autoComplete="off"
          labelAlign={"left"}
        >
          <Form.Item
            label="管理员名"
            name="adminName"
            rules={[{ required: true, message: "请输入管理员名！" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="管理密码"
            name="password"
            rules={[{ required: true, message: "请输入管理密码！" }]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 6, span: 16 }}>
            <Button loading={addAdminLoading} type="primary" htmlType="submit">
              提交
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
