import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./Pages/Login/Login";
import NeedleStick from "./Pages/Forms/NeedleStick";
import AuthContext from "./context/authContext";
import Home from "./Pages/Home";
import NotFound from "./Pages/404";
import axios from "axios";
import { Layout } from "antd";
import AppHeader from "./Components/Header/Header";
import Dashboard from "./Pages/Dashboard/Dashboard";
import Protect from "./Components/Layout/Protect";
function App() {
  // get user from local storage
  const localUser = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null;

  const [auth, setAuth] = useState({
    isAuthenticated: localUser ? true : false,
    user: localUser,
  });

  axios.defaults.headers.common["Authorization"] = `Bearer ${auth.user?.token}`;



  


  return (
    <AuthContext.Provider
      value={{
        auth,
        login: (user) => {
          setAuth({
            isAuthenticated: true,
            user,
          });
        },
        logout: () => {
          setAuth({
            isAuthenticated: false,
            user: {},
          });
        },
      }}
    >
      <Layout>
        <BrowserRouter>
          <AppHeader />
          <Layout.Content style={{ padding: "50px" }}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route
                path="/forms/needle-stick"
                element={
                  <Protect level={2}>
                    <NeedleStick />
                  </Protect>
                }
              />
              <Route
                path="/forms/needle-stick/:id"
                element={
                  <Protect level={2}>
                    <NeedleStick />
                  </Protect>
                }
              />
              <Route
                path="/dashboard"
                element={
                  <Protect level={1}>
                    <Dashboard />
                  </Protect>
                }
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Layout.Content>
        </BrowserRouter>
      </Layout>
    </AuthContext.Provider>
  );
}

export default App;
