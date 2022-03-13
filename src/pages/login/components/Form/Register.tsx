import React, { useEffect, useState } from "react";
import { Form, Input, Button, message, Select } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { nanoid } from "nanoid";
import httpUtil from "../../../../utils/httpUtil";
import { registerUser } from "../../../../utils/params";

const { Option } = Select;

interface FinishedData extends registerUser {
  confirm: string;
}

export const Register: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [adminList, setAdminList] = useState<any[]>([]);

  const onFinish = (values: FinishedData) => {
    setLoading(true);
    const { userName, password, adminId } = values;
    const data: registerUser = { userName, password, adminId };

    httpUtil.registerUser(data).then(
      (res) => {
        const { status, message: msg } = res;
        if (status === 1) {
          message.warn(msg);
        } else if (status === 0) {
          message.success("注册成功");
        }
        setLoading(false);
      },
      (error) => {
        setLoading(false);
      }
    );
  };

  useEffect(() => {
    httpUtil.getAdminList().then((res) => {
      const { data } = res;
      setAdminList(data);
    });
  }, []);

  return (
    <Form
      name="normal_login"
      className="login-form"
      initialValues={{
        remember: true,
      }}
      onFinish={onFinish}
    >
      <Form.Item
        name="userName"
        rules={[
          {
            required: true,
            message: "请输入您的账号!",
          },
        ]}
      >
        <Input
          prefix={<UserOutlined className="site-form-item-icon" />}
          placeholder="账号"
        />
      </Form.Item>

      <Form.Item
        name="password"
        rules={[
          {
            required: true,
            message: "请输入您的密码!",
          },
        ]}
      >
        <Input
          prefix={<LockOutlined className="site-form-item-icon" />}
          type="password"
          placeholder="密码"
        />
      </Form.Item>

      <Form.Item
        name="confirm"
        dependencies={["password"]}
        hasFeedback
        rules={[
          {
            required: true,
            message: "请确认您的密码!",
          },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue("password") === value) {
                return Promise.resolve();
              }
              return Promise.reject(new Error("您输入的两次密码不匹配!"));
            },
          }),
        ]}
      >
        <Input.Password
          prefix={<LockOutlined className="site-form-item-icon" />}
          type="password"
          placeholder="确认密码"
        />
      </Form.Item>

      <Form.Item
        name="adminId"
        rules={[
          {
            required: true,
            message: "请输入您的账号!",
          },
        ]}
      >
        <Select placeholder="请选择你的管理员">
          {adminList.map((item: any) => {
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
          htmlType="submit"
          style={{ width: "100%", marginTop: 20 }}
          loading={loading}
        >
          注册
        </Button>
      </Form.Item>
      <div
        className="marked"
        style={{
          width: "80%",
          margin: "0 auto 28",
          height: 12,
          borderBottom: "1px solid #ddd",
          textAlign: "center",
        }}
      >
        <span
          className="words"
          style={{
            background: "white",
            paddingLeft: 8,
            paddingRight: 8,
            display: "inline-block",
          }}
        >
          请记住您的账号和密码
        </span>
      </div>
    </Form>
  );
};
