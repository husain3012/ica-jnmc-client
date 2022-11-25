import React, { useEffect, useState, useContext } from "react";
import { Button, Divider, Form, Space, Input, notification, Spin } from "antd";
import dayjs from "dayjs";
import {
  GoogleOutlined,
  MailOutlined,
  WhatsAppOutlined,
} from "@ant-design/icons";
import Link from "next/link";
import { useRouter } from "next/router";
import axios from "axios";
import authAtom from "../../../context/authAtom";
import generateCalendarLinks from "../../../utils/calendar-link";
import { useRecoilValue } from "recoil";
import Protect from "../../../Components/Layout/Protect";
const FormSuccess = () => {
  const auth = useRecoilValue(authAtom);
  const router = useRouter();
  const { id } = router.query;

  const [formData, setFormData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSetReminderLoading, setIsSetReminderLoading] = useState(false);
  const [remindersSet, setRemindersSet] = useState(false);

  useEffect(() => {
    const asyncFunc = async () => {
      if (id) {
        setIsLoading(true);
        try {
          const res = await axios.get(`/api/form/${id}`);
          if (res.status === 200) {
            setFormData(res.data);
          }
        } catch (error) {
          console.log(error.response);
          if (error.response.status === 404) {
            router.replace("/404");
          } else {
            notification.error({
              message: error.response?.status || "Unknown Error",
              description: error.response?.status,
            });
          }
        }
      }
      setIsLoading(false);
    };
    asyncFunc();
  }, [id, router]);
  const [reminderForm] = Form.useForm();

  const reminderFormHandler = async (values) => {
    setIsSetReminderLoading(true);
    try {
      const res = await axios.post(`/api/form/reminder/${id}`, {
        email: values.email,
        phoneNumber: values.phoneNumber,
      });
      if (res.status === 200) {
        notification.success({
          message: "Success",
          description: "Reminder set successfully",
        });
        reminderForm.resetFields();
        setRemindersSet(res.data);
      }
    } catch (error) {
      console.log(error);
      notification.error({
        message: "Error",
        description: "Error setting reminder",
      });
    }
    setIsSetReminderLoading(false);
  };

  return (
    <Protect level={4}>
      <Spin spinning={isLoading}>
        {formData && (
          <div style={{ maxWidth: "900px", margin: "auto" }}>
            <h1>Set Reminders!</h1>
            <p>Hi {formData.form.name},</p>
            <p>You have successfully submitted your form.</p>
            <p>
              Kindly visit on:
              <br />
              {dayjs(formData.firstVisit).format("DD-MMM-YYYY")},{" "}
              {dayjs(formData.secondVisit).format("DD-MMM-YYYY")} and{" "}
              {dayjs(formData.thirdVisit).format("DD-MMM-YYYY")}
            </p>
            <Divider />
            <p>
              Sign up for email and whatsapp reminders, or add reminders to your
              google calendar by clicking the buttons below.
            </p>
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
                <Button
                  icon={<GoogleOutlined />}
                  type="primary"
                  size="large"
                  block
                  style={{ marginBottom: "10px" }}
                >
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
                <Button
                  icon={<GoogleOutlined />}
                  type="primary"
                  size="large"
                  block
                  style={{ marginBottom: "10px" }}
                >
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
                <Button
                  icon={<GoogleOutlined />}
                  type="primary"
                  size="large"
                  block
                  style={{ marginBottom: "10px" }}
                >
                  Third Visit
                </Button>
              </a>
              <Divider />
              <Form
                form={reminderForm}
                initialValues={{
                  email:
                    auth.isAuthenticated && auth.user.user_id !== "guest"
                      ? auth.user.email
                      : "",
                }}
                style={{ margin: "auto", maxWidth: "720px" }}
                layout="inline"
                onFinish={reminderFormHandler}
                name="reminder_form"
              >
                <Form.Item
                  style={{ margin: "10px auto" }}
                  name="email"
                  rules={[{ required: true, message: "Email is required!" }]}
                >
                  <Input
                    prefix={
                      <MailOutlined
                        style={{ color: "#EA4335", opacity: 0.5 }}
                      />
                    }
                    type="email"
                    placeholder="Email"
                  />
                </Form.Item>

                <Form.Item style={{ margin: "10px auto" }} name="phoneNumber">
                  <Input
                    prefix={
                      <WhatsAppOutlined
                        style={{ color: "#128C7E", opacity: 0.5 }}
                      />
                    }
                    type="number"
                    minLength={10}
                    maxLength={10}
                    placeholder="Whatsapp (optional)"
                  />
                </Form.Item>
                <Form.Item style={{ margin: "10px auto" }}>
                  <Button
                    disabled={remindersSet}
                    loading={isSetReminderLoading}
                    type="primary"
                    htmlType="submit"
                  >
                    Sign up for reminders!
                  </Button>
                </Form.Item>
              </Form>
              <Divider />

              <Link href="/">
                <Button type="link" size="large" block>
                  Go Home
                </Button>
              </Link>
            </div>
          </div>
        )}
      </Spin>
    </Protect>
  );
};

export default FormSuccess;
