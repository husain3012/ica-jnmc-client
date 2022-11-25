import React, { useEffect } from "react";
import authAtom from "../../context/authAtom";
import { useRouter } from "next/router";
import { useRecoilState, useRecoilValue } from "recoil";
import { Spin } from "antd";

const publicPaths = ["/", "/login"];
const Protect = ({ level, children }) => {
  level = level || Infinity;
  const router = useRouter();
  const [auth, setAuthState] = useRecoilState(authAtom);
  const userLevel = auth.user?.level || Infinity;
  useEffect(() => {
    const currentUrl = router.asPath.split("?")[0];
    setAuthState((prev) => ({
      ...prev,
      showContent: false,
    }));

    if (!auth.isAuthenticated && !publicPaths.includes(currentUrl)) {
      router.replace(`/login?redirect=${currentUrl}`);
      return;
    }
    if (userLevel > level) {
      router.push("/");
      return () => {};
    }
    setAuthState((prev) => ({
      ...prev,
      showContent: true,
    }));
  }, [auth.isAuthenticated, level, router, setAuthState, userLevel]);

  return (
    <Spin spinning={!auth.showContent}>{auth.showContent && children}</Spin>
  );
};

export default Protect;
