import React, { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Table, Tag, Space, Button, message, Popconfirm } from "antd";
import Link from "next/link";
import dayjs from "dayjs";
import { useRecoilValue } from "recoil";
import {
  BellTwoTone,
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import Protect from "../../Components/Layout/Protect";
import authAtom from "../../context/authAtom";

const Dashboard = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [refresh, setRefresh] = useState(true);
  const auth = useRecoilValue(authAtom);
  const fetchData = useCallback(async () => {
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
  }, []);

  const deleteForm = useCallback(async (id) => {
    console.log("delete", id);
    try {
      const res = await axios.delete(`/api/form/${id}`);
      console.log(res.data);
      if (res.status === 200) {
        message.success("Form deleted");
        setRefresh(true);
        return true;
      }
    } catch (error) {
      message.error("Error deleting form");
      return false;
    }
  }, []);

  const columns = useMemo(
    () => [
      {
        title: "Name",
        dataIndex: "form",
        key: "name",
        render: (text, record) => <span>{text?.name}</span>,
      },
      {
        title: "Age",
        dataIndex: "form",
        key: "age",
        render: (text, record) => <span>{text?.age}</span>,
        responsive: ["md"],
      },
      {
        title: "Created By",
        dataIndex: "user",
        key: "moName",
        render: (text, record) => <span>{text?.email}</span>,
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
        title: "Actions",
        dataIndex: "id",
        key: "id",
        render: (text, record) => (
          <Space>
            <a>
              <Button>
                <Link href={`/forms/needle-stick/${text}`} size="middle">
                  <EyeOutlined color="blue" />
                </Link>
              </Button>
            </a>
            <a>
              <Button>
                <Link href={`/forms/needle-stick/${text}`} size="middle">
                  <EditOutlined />
                </Link>
              </Button>
            </a>
            {auth.user?.level <= 0 && (
              <Popconfirm
                onConfirm={() => deleteForm(text)}
                title="Sure to delete?"
              >
                <Button danger>
                  <DeleteOutlined />
                </Button>
              </Popconfirm>
            )}
          </Space>
        ),
      },
    ],
    [auth.user?.level, deleteForm]
  );

  useEffect(() => {
    if (!refresh) return;
    fetchData();
    setRefresh(false);
  }, [fetchData, refresh]);

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
