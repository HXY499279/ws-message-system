import React from "react";
import { Form, Input, Button } from "antd";
import { UserOutlined, EditOutlined } from "@ant-design/icons";
import { GroupCreateFormType } from "../../index";

interface propsType {
  onFinish: (values: GroupCreateFormType) => void;
}

const GroupCreateForm: React.FC<propsType> = (props) => {
  const { onFinish } = props;

  return (
    <Form
      name="normal_login"
      className="login-form"
      initialValues={{
        remember: true,
      }}
      onFinish={onFinish}
    >
      <div style={{height:"20px"}} />
      <Form.Item
        name="groupName"
        rules={[
          {
            required: true,
            message: "请输入组名",
          },
        ]}
      >
        <Input
          prefix={<EditOutlined className="site-form-item-icon" />}
          placeholder="分组名"
        />
      </Form.Item>

      <Form.Item
        name="maxCount"
        rules={[
          {
            required: true,
            message: "请输入最大人数",
          },
        ]}
      >
        <Input
          prefix={<UserOutlined className="site-form-item-icon" />}
          placeholder="最大人数"
        />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" className="login-form-button" style={{float:"right"}}>
          创建
        </Button>
      </Form.Item>
    </Form>
  );
};

export default GroupCreateForm;
