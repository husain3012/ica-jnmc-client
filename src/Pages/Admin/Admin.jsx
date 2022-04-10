import React from "react";
import axios from "axios";
import { Form, Input, Button, Checkbox, notification, Divider, Select } from "antd";
const { Option } = Select;
const Admin = () => {
  const [createUserForm] = Form.useForm();

  const createUserSubmitHandler = async (values) => {
    try {
      const res = await axios.post(process.env.REACT_APP_BACKEND + "/api/user/signup", values);
      console.log(res.data);
      if (res.status === 200) {
        notification.success({
          message: "User Created",
          description: "User created successfully",
        });
      }
    } catch (error) {
      notification.error({
        message: "User Creation Failed",
        description: "User creation failed",
      });
      console.log(error);
    }
  };
  return (
    <div>
      <h1>Admin</h1>
      <Divider />
      <div style={{ maxWidth: 400 }}>
        <h2>Create User</h2>
        <Form form={createUserForm} onFinish={createUserSubmitHandler} name="createUser" className="login-form">
          <Form.Item
            name="email"
            rules={[
              {
                required: true,
                message: "Please input your email!",
              },
            ]}
          >
            <Input placeholder="Email" />
          </Form.Item>
          <Form.Item
            name="user_id"
            rules={[
              {
                required: true,
                message: "Please input user id!",
              },
            ]}
          >
            <Input placeholder="User ID" />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[
              {
                required: true,
                message: "Please input your password!",
              },
            ]}
          >
            <Input type="password" placeholder="Password" />
          </Form.Item>

          <Form.Item
            name="level"
            rules={[
              {
                required: true,
                message: "Please input user level!",
              },
            ]}
          >
            <Select placeholder="User Level">
              <Option value={0}>Admin </Option>
              <Option value={1}>HICC</Option>
              <Option value={1}>Lab </Option>
              <Option value={2}>Medical Officer</Option>
            </Select>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" className="login-form-button">
              Create User
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default Admin;
