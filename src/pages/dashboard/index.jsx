import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table, Tag, Space } from "antd";
import Link from "next/link";
import dayjs from "dayjs";
import { BellTwoTone } from "@ant-design/icons";
import Protect from "../../Components/Layout/Protect";
const columns = [
  {
    title: "Name",
    dataIndex: "form",
    key: "name",
    render: (text, record) => <span>{text.name}</span>,
  },
  {
    title: "Age",
    dataIndex: "form",
    key: "age",
    render: (text, record) => <span>{text.age}</span>,
    responsive: ["md"],
  },
  {
    title: "Created By",
    dataIndex: "user",
    key: "moName",
    render: (text, record) => <span>{text.email}</span>,
    responsive: ["lg"],
  },
  {
    title: "Reporting Time",
    dataIndex: "form",
    key: "reportingTime",
    render: (text, record) => (
      <span>{dayjs(text.reportingTime).format("DD/MM/YYYY, hh:mm a")}</span>
    ),
    responsive: ["md"],
  },
  {
    title: "Next Visit",
    dataIndex: "",
    key: "",
    responsive: ["md"],

    render: (text, record) => {
      const today = new Date().getTime(text.thirdVisit);

      let nextAppointment = new Date();
      let appointmentType = "";
      let expired = false;

      if (new Date(text.firstVisit).getTime() > today) {
        nextAppointment = new Date(text.firstVisit);
        appointmentType = "First";
      } else if (new Date(text.secondVisit) > today) {
        nextAppointment = new Date(text.secondVisit);
        appointmentType = "Second";
      } else if (new Date(text.thirdVisit) > today) {
        nextAppointment = new Date(text.thirdVisit);
        appointmentType = "Third";
      } else {
        expired = true;
      }
      const event = {
        name: `${text.form.name} - ${appointmentType} Visit`,
        details: "Patient visit for needle injury",
        location:
          "Jawaharlal Nehru Medical College, AMU,, Medical Rd, AMU Campus, Aligarh, Uttar Pradesh 202002",
        startTime: nextAppointment
          .toISOString()
          .split("T")[0]
          .split("-")
          .join(""),
        endTime: dayjs(nextAppointment)
          .add(1.5, "day")
          .toISOString()
          .split("T")[0]
          .split("-")
          .join(""),
      };

      // make calendar url from event object
      const AddToCalendarUrl = `https://www.google.com/calendar/render?action=TEMPLATE&text=${event.name}&dates=${event.startTime}/${event.endTime}&details=${event.details}&location=${event.location}&sf=true&output=xml`;

      return (
        <Space size="middle">
          <Tag
            color={
              appointmentType === "First"
                ? "green"
                : appointmentType === "Second"
                ? "yellow"
                : appointmentType === "Third"
                ? "orange"
                : "red"
            }
          >
            {dayjs(nextAppointment).format("DD/MM/YYYY, hh:mm a")}
          </Tag>
          {!expired && (
            <a href={AddToCalendarUrl} target="_blank" rel="noreferrer">
              {" "}
              <BellTwoTone />
            </a>
          )}
        </Space>
      );
    },
  },

  {
    title: "Investigations Sent",
    dataIndex: "form",
    key: "investigationsSent",
    responsive: ["lg"],
    render: (text, record) => (
      <Space size="middle">
        {text.investigationsSent?.map((tag) => (
          <Tag color="blue" key={tag}>
            {tag}
          </Tag>
        ))}
      </Space>
    ),
  },

  {
    title: "Edit",
    dataIndex: "id",
    key: "id",
    render: (text, record) => (
      <Link href={`/forms/needle-stick/${text}`} size="middle">
        Edit
      </Link>
    ),
  },
];

const Dashboard = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const resp = await axios.get("/api/form/getAll");
        if (resp.status === 200) {
          const mappedData = resp.data.map((item) => {
            return {
              ...item,
              key: item.id,
            };
          });
          setData(mappedData);
        }
      } catch (error) {
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <Protect level={1}>
      <div>
        <h2>Dashboard</h2>
        <Table columns={columns} dataSource={data} loading={isLoading} />
      </div>
    </Protect>
  );
};

export default Dashboard;
