import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { Button, notification } from "antd";
import authContext from "../context/authContext";

const Home = () => {
  const { auth, logout } = useContext(authContext);
  const isAuthenticated = auth.isAuthenticated;
  const level = auth.user && auth.user.level;
  const logoutHandler = () => {
    logout();
    notification.success({
      message: "Logout Success",
      description: "You have been logged out",
    });
  };

  return (
    <div style={{ margin: "auto", display: "flex", flexDirection: "column", gap: "15px", maxWidth: "600px" }}>
      {isAuthenticated && level <= 4 && (
        <Link to="/forms/needle-stick">
          <Button size="large" type="dashed" block>
            NEW FORM
          </Button>
        </Link>
      )}

      {isAuthenticated && level <= 1 && (
        <Link to="/dashboard">
          <Button size="large" block>
            Dashboard
          </Button>
        </Link>
      )}
      {isAuthenticated && level <= 0 && (
        <Link to="/admin">
          <Button size="large" block>
            Admin
          </Button>
        </Link>
      )}
      {!isAuthenticated ? (
        <>
          <Link to="/login">
            <Button size="large" type="primary" block>
              LOGIN
            </Button>
          </Link>
          <Link to="/login?username=guest&password=guest">
            <Button size="large" type="dashed" block>
              Guest Login
            </Button>
          </Link>
        </>
      ) : (
        <Button onClick={logoutHandler} size="large" color="warning" type="primary" block>
          LOGOUT
        </Button>
      )}
    </div>
  );
};

export default Home;
