import React, { useEffect } from "react";
import Link from "next/link";
import { Button, message } from "antd";
import authAtom from "../context/authAtom";
import { useRecoilState } from "recoil";


const Home = () => {
  const [userAuth, setUserAuth] = useRecoilState(authAtom);
  const isAuthenticated = userAuth.isAuthenticated;
  const level = userAuth.user && userAuth.user.level;
  const logoutHandler = () => {
    setUserAuth({
      isAuthenticated: false,
      user: null,
    });
    window.localStorage.removeItem("user");
    message.success("Logout successfully");
  };

  return (
    <div
      style={{
        margin: "auto",
        display: "flex",
        flexDirection: "column",
        gap: "15px",
        maxWidth: "500px",
      }}
    >
      {isAuthenticated && level <= 4 && (
        <Link href="/forms/needle-stick">
          <Button size="large" type="dashed" block>
            NEW FORM
          </Button>
        </Link>
      )}

      {isAuthenticated && level <= 1 && (
        <Link href="/dashboard">
          <Button size="large" block>
            Dashboard
          </Button>
        </Link>
      )}
      {isAuthenticated && level <= 0 && (
        <Link href="/admin">
          <Button danger type="ghost" size="large" block>
            Admin
          </Button>
        </Link>
      )}
      {!isAuthenticated ? (
        <>
          <Link href="/login">
            <Button size="large" type="primary" block>
              LOGIN
            </Button>
          </Link>
          <Link href="/login?username=guest&password=guest@pepjnmc">
            <Button size="large" type="dashed" block>
              Guest Login
            </Button>
          </Link>
        </>
      ) : (
        <Button
          onClick={logoutHandler}
          size="large"
          danger
          type="primary"
          block
        >
          LOGOUT
        </Button>
      )}
    </div>
  );
};

export default Home;
