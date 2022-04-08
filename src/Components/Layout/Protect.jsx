import React, { useContext, useEffect } from "react";
import authContext from "../../context/authContext";
import { useNavigate } from "react-router-dom";
const Protect = ({ level, children }) => {
  const navigate = useNavigate();
  const { auth } = useContext(authContext);
  const userLevel = auth.user?.level || Infinity;
  useEffect(() => {
    if (userLevel > level) {
      navigate("/");
    }
  }, [level, navigate, userLevel]);
  if (userLevel <= level) {
    return children;
  }

  return <h1>Unauthorized, redirecting...</h1>;
};

export default Protect;
