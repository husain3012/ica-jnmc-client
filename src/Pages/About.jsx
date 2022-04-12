import React from "react";
import { Typography, Divider } from "antd";

const { Title, Paragraph, Text, Link } = Typography;

const About = () => {
  return (
    <div>
      <Title>About</Title>
      <Paragraph>
        <Text>
          This is a open source web application for managing and automating the process of post exposure prophylaxis forms. Developed by{" "}
          <a href="https://www.linkedin.com/in/husain3012/" target="_blank" rel="noreferrer">
            Husain Shahid
          </a>
        </Text>
      </Paragraph>
      <Divider />
      <Paragraph>
        <Text>Important Links:</Text>
        <br />
        <Text>
          <a href="https://github.com/husain3012/pep-jnmc-server" target="_blank" rel="noreferrer">
            Server source code
          </a>
        </Text>
        <br />

        <Text>
          <a href="https://github.com/husain3012/pep-jnmc-client" target="_blank" rel="noreferrer">
            Client source code
          </a>
        </Text>
      </Paragraph>
    </div>
  );
};

export default About;
