import { useEffect, useState } from "react";
import { Form, Input, Button, Checkbox, notification } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import authAtom from "../../context/authAtom";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";
import { useRecoilState } from "recoil";

const Login = () => {
  const router = useRouter();
  const [userAuth, setUserAuth] = useRecoilState(authAtom);
  const [loading, setLoading] = useState(false);
  const [initialValues, setInitialValues] = useState({
    username: "",
    password: "",
  });

  const { query } = router;

  useEffect(() => {
    if (query?.email) {
      setInitialValues({
        username: query.username,
        password: query.password,
      });
    }
  }, [query]);

  useEffect(() => {
    if (userAuth.isAuthenticated) {
      router.replace(query?.redirect || "/");
    }
    return () => {
      setLoading(false);
    };
  }, [query?.redirect, router, userAuth.isAuthenticated]);
  const onFinish = async (values) => {
    const { remember, password } = values;
    const username = values.username.trim();
    try {
      setLoading(true);
      const res = await axios.post("/api/user/login", {
        username,
        password,
      });

      if (res.status === 200) {
        // save user to local storage
        if (remember && username !== "guest") {
          window?.localStorage?.setItem("user", JSON.stringify(res.data.user));
        } else {
          window?.localStorage?.removeItem("user");
        }
        setUserAuth({
          isAuthenticated: true,
          user: res.data.user,
        });
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
      style={{
        maxWidth: "400px",
        margin: "auto",
      }}
      name="normal_login"
      className="login-form"
      initialValues={initialValues}
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
        <Input
          prefix={<UserOutlined className="site-form-item-icon" />}
          placeholder="User ID Or Email"
        />
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
        <Input
          prefix={<LockOutlined className="site-form-item-icon" />}
          type="password"
          placeholder="Password"
        />
      </Form.Item>
      {query?.password ? null : (
        <Form.Item>
          <Form.Item name="remember" valuePropName="checked" noStyle>
            <Checkbox>Remember me</Checkbox>
          </Form.Item>
          {/* Link href mail */}

          <a
            className="login-form-forgot"
            href="mailto:husainshahidrao@gmail.com?subject=Change Password for ICA-JNMC&body=send your username and the new password to this mail"
          >
            Forgot password
          </a>
        </Form.Item>
      )}

      <Form.Item>
        <Button
          loading={loading}
          type="primary"
          htmlType="submit"
          className="login-form-button"
        >
          Log in
        </Button>
        <Link href="/" style={{ marginLeft: "10px" }}>
          <Button htmlType="button" className="login-form-button">
            Go Back
          </Button>
        </Link>
      </Form.Item>
    </Form>
  );
};

export default Login;
