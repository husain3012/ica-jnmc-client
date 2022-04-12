import React from "react";
import { Link } from "react-router-dom";
import { Layout, Space } from "antd";
const { Footer } = Layout;

const AppFooter = () => {
  return (
    <Footer style={{ textAlign: "center", backgroundColor: "#EEEEEE", borderTop: "1px solid #DDDDDD" }}>
      <Space size="middle">
        <a style={{ fontSize: "16px", color: "#06113C" }} href="mailto:husainshahidrao@gmail.com">
          Feedback
        </a>
        <Link style={{ fontSize: "16px", color: "#06113C" }} to="/about">
          About
        </Link>
      </Space>
    </Footer>
  );
};

export default AppFooter;
