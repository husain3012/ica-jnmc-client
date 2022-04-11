import React from "react";
import { Layout } from "antd";
const { Footer } = Layout;

const AppFooter = () => {
  return (
    <Footer  style={{ textAlign: "center", backgroundColor:"#EEEEEE", borderTop:"1px solid #DDDDDD" }}>
   
      <a  style={{fontSize:"16px", color:"#06113C"}} href="mailto:husainshahidrao@gmail.com">Send Feedback ?</a>
    </Footer>
  );
};

export default AppFooter;
