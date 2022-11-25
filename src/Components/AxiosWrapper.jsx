import { useRecoilValue } from "recoil";
import axios from "axios";
import authAtom from "../context/authAtom";

const AxiosWrapper = ({ children }) => {
  const auth = useRecoilValue(authAtom);
  axios.defaults.headers.common["Authorization"] = `Bearer ${auth.user?.token}`;
  return children;
};

export default AxiosWrapper;
