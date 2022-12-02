import { Layout } from "antd";
import AppHeader from "../Components/Header/Header";
import AppFooter from "../Components/Footer/Footer";


import "antd/dist/antd.css";
import { RecoilRoot } from "recoil";
// import Protect from "../Components/Layout/Protect";
import AxiosWrapper from "../Components/AxiosWrapper";
  if (typeof window !== "undefined") {
    caches.keys().then(function (names) {
      for (let name of names) caches.delete(name);
    });
  }
function App({ Component, pageProps }) {
  return (
    <RecoilRoot>
      <AxiosWrapper>
        <Layout>
          <AppHeader />

          <Layout.Content
            style={{ padding: "50px", minHeight: "calc(100vh - 138px)" }}
          >
            <Component {...pageProps} />
          </Layout.Content>
          <AppFooter />
        </Layout>
      </AxiosWrapper>
    </RecoilRoot>
  );
}

export default App;


