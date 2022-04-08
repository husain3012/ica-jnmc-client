import React, { useState, useEffect } from "react";
import { Form, Input, InputNumber, Cascader, Select, Row, Col, Checkbox, Button, AutoComplete, Radio, DatePicker, notification } from "antd";
import dayjs from "dayjs";
import weekday from "dayjs/plugin/weekday";
import localeData from "dayjs/plugin/localeData";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { useMediaQuery } from "react-responsive";
dayjs.extend(weekday);
dayjs.extend(localeData);
const { Option } = Select;

const NeedleStick = () => {
  const [form] = Form.useForm();
  const [isVaccinatedForHBV, setIsVaccinatedForHBV] = useState(false);
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const isMobile = useMediaQuery({ query: "(max-width: 767px)" });
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      setIsLoading(true);
      axios
        .get(process.env.REACT_APP_BACKEND + `/api/form/get/${id}`)
        .then((res) => {
          if (res.status === 200) {
            console.log(res.data);
            setIsVaccinatedForHBV(res.data.form.isVaccinatedForHBV);
            // change date fields to dayjs object
            const formData = {
              ...res.data.form,
              reportingTime: dayjs(res.data.form.reportingTime),
              injuryTime: dayjs(res.data.form.injuryTime),
            };
            form.setFieldsValue(formData);
          }
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [form, id]);

  const onFinish = async (values) => {
    console.log("Received values of form: ", values);
    try {
      if (id) {
        setIsLoading(true);
        const res = await axios.put(process.env.REACT_APP_BACKEND + `/api/form/update/${id}`, values);
        if (res.status === 200) {
          notification.success({
            message: "Success",
            description: "Form updated successfully",
          });
        }
      } else {
        setIsLoading(true);
        const resp = await axios.post(process.env.REACT_APP_BACKEND + "/api/form/create", values);
        console.log(resp.data);
        if (resp.status === 201) {
          // show notification
          notification.success({
            message: "Success",
            description: "Form submitted successfully",
          });
          navigate("/", { replace: true });
        }
      }
      setIsLoading(false);
    } catch (error) {
      // console.log(error);
      notification.error({
        message: "Error",
        description: "Something went wrong",
      });
      setIsLoading(false);
    }
  };

  return (
    <Form labelCol={{ span: 8 }} wrapperCol={{ span: 12 }} form={form} name="needle-stick" onFinish={onFinish} scrollToFirstError>
      <Form.Item name="name" label="Name" rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Form.Item name="age" label="Age">
        <InputNumber />
      </Form.Item>
      <Form.Item label="Sex" name="sex">
        <Radio.Group size="large">
          <Radio.Button value="m">Male</Radio.Button>
          <Radio.Button value="f">Female</Radio.Button>
          <Radio.Button value="o">Other</Radio.Button>
        </Radio.Group>
      </Form.Item>
      <Form.Item name="designation" label="Designation">
        <Input />
      </Form.Item>
      <Form.Item name="dutyArea" label="Duty Area">
        <Input />
      </Form.Item>
      <Form.Item
        name="injuryTime"
        label="Needle Stick Injury Time"
        rules={[
          {
            required: true,
            message: "Please input Needle Stick Injury Time",
          },
        ]}
      >
        <DatePicker showTime />
      </Form.Item>
      <Form.Item
        name="reportingTime"
        label="Reporting Time"
        rules={[
          {
            required: true,
            message: "Please input Reporting Time",
          },
        ]}
      >
        <DatePicker showTime />
      </Form.Item>
      <Form.Item name="isVaccinatedForHBV" label="Is person vaccinated for HBV">
        <Radio.Group onChange={(e) => setIsVaccinatedForHBV(e.target.value === "yes")}>
          <Radio value="yes">Yes</Radio>
          <Radio value="no">No</Radio>
        </Radio.Group>
      </Form.Item>

      {isVaccinatedForHBV && (
        <Form.Item name="antibodyTitre" label="anti-HBs titre">
          <Radio.Group>
            <Radio value="lt10">Less than 10</Radio>
            <Radio value="gt10">Greater than 10</Radio>
            <Radio value="uk">Not known</Radio>
          </Radio.Group>
        </Form.Item>
      )}
      <Form.Item name="injuryType" label="Nature of injury">
        <Select placeholder="Select a type of injury">
          <Option value="solid">Solid</Option>
          <Option value="hollow">Hollow</Option>
          <Option value="sharpCut">Sharp Cut</Option>
          <Option value="laceration">Laceration</Option>
          <Option value="splatteredGlass">Splattered Glass</Option>
          <Option value="fluidSplash">Fluid Splash</Option>
        </Select>
      </Form.Item>
      <Form.Item name="injuryLocation" label="Injury Location">
        <Input />
      </Form.Item>
      <Form.Item name="sourceStatus" label="Status of source">
        <Select placeholder="Select a status of source">
          <Option value="positive">Positive</Option>
          <Option value="negative">negative</Option>
          <Option value="">Unknown</Option>
        </Select>
      </Form.Item>
      <Form.Item name="sourceSerumSent" label="Has the source serum sent fot testing">
        <Radio.Group>
          <Radio value="yes">Yes</Radio>
          <Radio value="no">No</Radio>
        </Radio.Group>
      </Form.Item>
      <Form.Item name="doesSourceHaveSymptomsOfInfection" label="Does the source have signs/symptoms of HIV/HBV/HCV infection">
        <Radio.Group>
          <Radio value="yes">Yes</Radio>
          <Radio value="no">No</Radio>
        </Radio.Group>
      </Form.Item>

      <Form.Item name="HBVGiven" label="HBV given (If not vaccinated):">
        <Radio.Group>
          <Radio value="yes">Yes</Radio>
          <Radio value="no">No</Radio>
        </Radio.Group>
      </Form.Item>
      <Form.Item name="immunoglobulinGiven" label="HBV given (If not vaccinated):">
        <Radio.Group>
          <Radio value="yes">Yes</Radio>
          <Radio value="no">No</Radio>
        </Radio.Group>
      </Form.Item>

      <Form.Item name="ARTGiven" label="ART given (if required)">
        <Radio.Group>
          <Radio value="yes">Yes</Radio>
          <Radio value="no">No</Radio>
        </Radio.Group>
      </Form.Item>
      <Form.Item name="investigationsSent" label="Investigations sent">
        <Checkbox.Group
          options={[
            { value: "HBS", label: "HBS Ag" },
            { value: "HIV", label: "HIV antibody" },
            { value: "HCV", label: "Anti HCV antibody" },
          ]}
        />
      </Form.Item>
      <Form.Item wrapperCol={{ offset: isMobile ? 0 : 8, span: 16 }}>
        <Button loading={isLoading} type="primary" htmlType="submit">
          {id ? "Update" : "Submit"}
        </Button>
      </Form.Item>
    </Form>
  );
};

export default NeedleStick;
