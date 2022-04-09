import React, { useEffect, useState } from "react";
import { Button, Divider, Space } from "antd";
import dayjs from "dayjs";
import { GoogleOutlined } from "@ant-design/icons";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import generateCalendarLinks from "../../utils/calendar-link";
const FormSuccess = () => {
  const { id } = useParams();

  const [formData, setFormData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const asyncFunc = async () => {
      if (id) {
        setIsLoading(true);
        const res = await axios.get(process.env.REACT_APP_BACKEND + `/api/form/get/${id}`);
        console.log(res.data);
        if (res.status === 200) {
          setFormData(res.data);
        }
      }
      setIsLoading(false);
    };
    asyncFunc();
  }, [id]);

  return isLoading ? (
    <div>Loading...</div>
  ) : formData ? (
    <div style={{maxWidth:"900px", margin:"auto"}}>
      <h1>Set Reminders!</h1>
      <p>Hi {formData.form.name},</p>
      <p>You have successfully submitted your form.</p>
      <p>
        Kindly visit on {dayjs(formData.firstVisit).format("DD-MMM-YYYY")},  {dayjs(formData.secondVisit).format("DD-MMM-YYYY")} and {dayjs(formData.thirdVisit).format("DD-MMM-YYYY")}
      </p>
      <Divider/>
      <p>We will try sending an email to remind you! Add reminders to your google calendar by clicking the buttons below.</p>
      <div style={{ maxWidth: "900px", margin: "auto" }}>
        <a
          href={
            generateCalendarLinks({
              name: formData.form.name,
              startTime: formData.firstVisit,
              appointmentType: "First",
            }).google
          }
          target="_blank"
          rel="noreferrer"
        >
          <Button icon={<GoogleOutlined />} type="primary" size="large" block style={{ marginBottom: "10px" }}>
            First Visit
          </Button>
        </a>

        <a
          href={
            generateCalendarLinks({
              name: formData.form.name,
              startTime: formData.secondVisit,
              appointmentType: "Second",
            }).google
          }
          target="_blank"
          rel="noreferrer"
        >
          <Button icon={<GoogleOutlined />} type="primary" size="large" block style={{ marginBottom: "10px" }}>
            Second Visit
          </Button>
        </a>
        <a
          href={
            generateCalendarLinks({
              name: formData.form.name,
              startTime: formData.thirdVisit,
              appointmentType: "Third",
            }).google
          }
          target="_blank"
          rel="noreferrer"
        >
          <Button icon={<GoogleOutlined />} type="primary" size="large" block style={{ marginBottom: "10px" }}>
            Third Visit
          </Button>
        </a>
        <Divider />
        <Link to="/">
          <Button type="link" size="large" block>
           Go Home
          </Button>
        </Link>
      </div>
    </div>
  ) : (
    <div>
      <h1>NOT FOUND</h1>
      <p>The form you are looking for does not exist.</p>
    </div>
  );
};

export default FormSuccess;
