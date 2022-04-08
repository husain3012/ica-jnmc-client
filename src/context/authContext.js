import { createContext } from "react";

const authContext = createContext({
  auth: {
    isAuthenticated: false,
    user: {},
  },
  login: () => {},
  logout: () => {},
});
export default authContext;
