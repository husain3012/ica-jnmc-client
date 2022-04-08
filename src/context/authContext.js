import { createContext } from "react";

const authContext = createContext({
  auth: {
    isAuthenticated: false,
    user: {},
  },
  login: () => {},
  logout: () => {},
  setAuth: () => {},
});
export default authContext;
