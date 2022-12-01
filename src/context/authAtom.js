import { atom } from "recoil";

const localUser =
  typeof window !== "undefined" && window?.localStorage?.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : null;

const authAtom = atom({
  key: "Auth",
  default: {
    isAuthenticated: !!localUser,
    user: localUser?.user,
    showContent: false,
    token: localUser?.token,
  },
});
export default authAtom;
