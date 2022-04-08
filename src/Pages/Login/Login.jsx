import { useContext, useEffect, useState } from "react";
import { Form, Input, Button, Checkbox, notification } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import authContext from "../../context/authContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const { login, auth } = useContext(authContext);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (auth.isAuthenticated) {
      navigate("/");
    }
  }, [auth.isAuthenticated, navigate]);
  const onFinish = async (values) => {
    console.log("Received values of form: ", values);
    try {
      setLoading(true);
      const res = await axios.post(process.env.REACT_APP_BACKEND + "/api/user/login", values);
      console.log(res.data);
      if (res.status === 200) {
        login(res.data.user);
        // save user to local storage
        localStorage.setItem("user", JSON.stringify(res.data.user));
        navigate("/");
      }
      setLoading(false);
    } catch (error) {
      notification.error({
        message: "Login Failed",
        description: "Invalid username or password",
      });
      setLoading(false);
      console.log(error);
    }
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
        name="username"
        rules={[
          {
            required: true,
            message: "Please input your Username!",
          },
        ]}
      >
        <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Username" />
      </Form.Item>
      <Form.Item
        name="password"
        rules={[
          {
            required: true,
            message: "Please input your Password!",
          },
        ]}
      >
        <Input prefix={<LockOutlined className="site-form-item-icon" />} type="password" placeholder="Password" />
      </Form.Item>
      <Form.Item>
        <Form.Item name="remember" valuePropName="checked" noStyle>
          <Checkbox>Remember me</Checkbox>
        </Form.Item>
        {/* link to mail */}

        <a className="login-form-forgot" href="mailto:husainshahidrao@gmail.com?subject=Change Password for ICA-JNMC&body=send your username and the new password to this mail">
          Forgot password
        </a>
      </Form.Item>

      <Form.Item>
        <Button loading={loading} type="primary" htmlType="submit" className="login-form-button">
          Log in
        </Button>
      </Form.Item>
    </Form>
  );
};

export default Login;
