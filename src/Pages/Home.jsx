import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { Button } from "antd";
import authContext from "../context/authContext";

const Home = () => {
  const { auth } = useContext(authContext);
  const isAuthenticated = auth.isAuthenticated;
  const level = auth.user && auth.user.level;
  return (
    <div style={{margin:"auto"}}>
      {isAuthenticated && level <= 2 && (
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
          <Button size="large" type="link" block>
            Admin
          </Button>
        </Link>
      )}
      {!isAuthenticated ? (
        <Link to="/login">
          <Button size="large" type="primary" block>
            LOGIN
          </Button>
        </Link>
      ) : (
        <Button size="large" color="warning" type="primary" block>
          LOGOUT
        </Button>
      )}
    </div>
  );
};

export default Home;
