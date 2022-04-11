import React, { useState, useEffect } from "react";
import axios from "axios";
import { Form, Input, Button, Checkbox, notification, Divider, Select, Table, message } from "antd";
import dayjs from "dayjs";
const { Option } = Select;
const columns = [
  {
    title: "Email",
    dataIndex: "email",
    key: "email",
    responsive: ["md"],
    
  },
  {
    title: "User ID",
    dataIndex: "user_id",
    key: "user_id",
  },
  {
    title: "Access Level",
    dataIndex: "level",
    key: "level",
  },
  {
    title: "Created At",
    dataIndex: "createdAt",
    key: "createdAt",
    render: (text, record) => <span>{dayjs(text).format("DD-MMM-YYYY, hh:mm a")}</span>,
    responsive: ["md"],

  },
];

const Admin = () => {
  const [createUserForm] = Form.useForm();
  const [isLoadingCreate, setIsLoadingCreate] = useState(false);
  const [isLoadingUses, setIsLoadingUsers] = useState(false);
  const [usersData, setUsersData] = useState([]);
  const fetchUsers = async () => {
    try {
      setIsLoadingUsers(true);
      const res = await axios.get(process.env.REACT_APP_BACKEND + "/api/user/all");
      if (res.status === 200) {
        const mappedData = res.data.map((item) => {
          return {
            ...item,
            key: item.id,
          };
        });
        setUsersData(mappedData);
        message.success("Users fetched successfully");
      }
    } catch (error) {
      console.log(error);
      message.error("Error fetching users");
    } finally {
      setIsLoadingUsers(false);
    }
  };
  useEffect(() => {
    fetchUsers();
  }, []);

  const createUserSubmitHandler = async (values) => {
    setIsLoadingCreate(true);
    try {
      const res = await axios.post(process.env.REACT_APP_BACKEND + "/api/user/signup", values);
      if (res.status === 201) {
        notification.success({
          message: "User Created",
          description: "User created successfully",
        });
        fetchUsers();
      }
    } catch (error) {
      notification.error({
        message: "User Creation Failed",
        description: "User creation failed",
      });
      console.log(error);
    }
    setIsLoadingCreate(false);
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
            <Button loading={isLoadingCreate} type="primary" htmlType="submit" className="login-form-button">
              Create User
            </Button>
          </Form.Item>
        </Form>
      </div>
      <Divider />
      <h2>Registered Users</h2>
      <Table columns={columns} dataSource={usersData} loading={isLoadingUses} />
    </div>
  );
};

export default Admin;
