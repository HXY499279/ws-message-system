import React, { useEffect, useState } from "react";
import { Form, Input, Button, Checkbox, Skeleton, message } from "antd";
import {
  UserOutlined,
  LockOutlined,
  SafetyCertificateOutlined,
} from "@ant-design/icons";
import httpUtil from "../../../../utils/httpUtil";
import { userLogin } from "../../../../utils/params";
import { useDispatch } from "../../../../redux/hooks";
import { getUserInfoAC } from "../../../../redux/userInfo/slice";
import { useHistory } from "react-router-dom";

export const User: React.FC = () => {
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();

  const history = useHistory()

  const onFinish = (values: userLogin) => {
    setLoading(true);
    httpUtil.userLogin(values).then(
      (res) => {
        setLoading(false);
        message.success(`尊敬的用户${values.loginName}，欢迎您`);
        // 获取个人信息
        dispatch(getUserInfoAC());
        setTimeout(() => {
          history.push("/user")
        }, 500);
      },
      (error) => {
        getServerCode();
        setLoading(false);
      }
    );
  };

  const [serverCode, setServerCode] = useState<string>("");

  useEffect(() => {
    getServerCode();
  }, []);

  const getServerCode = () => {
    httpUtil.getVerifyCode().then((res: Blob) => {
      const imgUrl = window.URL.createObjectURL(res);
      setServerCode(imgUrl);
    });
  };

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
        name="loginName"
        rules={[
          {
            required: true,
            message: "请输入您的账号!",
          },
        ]}
      >
        <Input
          prefix={<UserOutlined className="site-form-item-icon" />}
          placeholder="用户账号"
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
        <Input.Password
          prefix={<LockOutlined className="site-form-item-icon" />}
          type="password"
          placeholder="用户密码"
        />
      </Form.Item>

      <div
        style={{
          position: "relative",
        }}
      >
        <Form.Item
          name="serverCode"
          rules={[
            {
              required: true,
              message: "请输入验证码！",
            },
          ]}
          style={{
            width: "72%",
          }}
        >
          <Input
            prefix={<SafetyCertificateOutlined />}
            type="text"
            placeholder="验证码"
          />
        </Form.Item>
        {serverCode ? (
          <img
            src={serverCode}
            alt=""
            style={{
              width: "28%",
              position: "absolute",
              top: 0,
              right: 0,
              cursor: "pointer",
            }}
            onClick={getServerCode}
          />
        ) : (
          <Skeleton.Button
            active
            style={{
              width: "28%",
              position: "absolute",
              top: 0,
              right: 0,
              cursor: "pointer",
            }}
          />
        )}
      </div>

      <Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          style={{ width: "100%", marginTop: 20 }}
          loading={loading}
        >
          登陆
        </Button>
      </Form.Item>

      <Form.Item>
        <Form.Item valuePropName="checked" noStyle>
          <Checkbox>记住密码</Checkbox>
        </Form.Item>
      </Form.Item>
    </Form>
  );
};
