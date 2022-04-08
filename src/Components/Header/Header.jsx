import { Layout, Menu, Breadcrumb } from "antd";
import { useContext } from "react";
import authContext from "../../context/authContext";
import { Link } from "react-router-dom";
const { Header, Content, Footer } = Layout;
const AppHeader = () => {
  const { auth } = useContext(authContext);
  const level = auth.user?.level || Infinity;

  return (
    <Header>
      <div className="logo" />
      <Menu  theme="dark" mode="horizontal">
        <Menu.Item key="1">
          <Link to="/">Home</Link>
        </Menu.Item>
        {level <= 2 ? (
          <Menu.Item key="2">
            <Link to="/forms/needle-stick">Needle Stick</Link>
          </Menu.Item>
        ) : null}
        {level <= 1 ? (
          <Menu.Item key="3">
            <Link to="/dashboard">Dashboard</Link>
          </Menu.Item>
        ) : null}
        {level <= 0 ? (
          <Menu.Item key="4">
            <Link to="/admin">Admin</Link>
          </Menu.Item>
        ) : null}
      </Menu>
    </Header>
  );
};

export default AppHeader;
