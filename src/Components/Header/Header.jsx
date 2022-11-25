import { Layout, Menu, Breadcrumb } from "antd";
import { useContext } from "react";
import authAtom from "../../context/authAtom";
import Link from "next/link";
import { useRecoilValue } from "recoil";
const { Header } = Layout;
const AppHeader = () => {
  const auth = useRecoilValue(authAtom);
  
  const level = auth.user?.level || Infinity;

  const menuItems = [
    {
      key: "1",
      label: <Link href="/">Home</Link>,
    }
  ]
  if(level <= 2) {
    menuItems.push({
      key: "2",
      label:  <Link href="/forms/needle-stick">Needle Stick</Link>,
    })
  }
  if(level <= 1) {
    menuItems.push({
      key: "3",
      label:  <Link href="/dashboard">Dashboard</Link>,
      // path: "/dashboard",
    })
  }
  if(level <= 0) {
    menuItems.push({
      key: "4",
      label:  <Link href="/admin">Admin</Link>,
      // path: "/admin",
    })
  }

  return (
    <Header>
      <div className="logo" />
      <Menu  theme="dark" mode="horizontal" items={menuItems}  />
    </Header>
  );
};

export default AppHeader;
