// import './index.css';
import { Layout } from "antd";
import AppHeader from "../Components/Header/Header";
import AppFooter from "../Components/Footer/Footer";
import * as serviceWorkerRegistration from "../serviceWorkerRegistration";
import reportWebVitals from "../reportWebVitals";

import "antd/dist/antd.css";
import { RecoilRoot } from "recoil";
// import Protect from "../Components/Layout/Protect";
import AxiosWrapper from "../Components/AxiosWrapper";

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

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
// serviceWorkerRegistration.register();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
