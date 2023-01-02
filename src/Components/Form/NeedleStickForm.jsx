import React, { useState, useEffect, useContext } from "react";
import {
  Form,
  Input,
  InputNumber,
  Cascader,
  Select,
  Row,
  Col,
  Checkbox,
  Button,
  AutoComplete,
  Radio,
  DatePicker,
  notification,
  TimePicker,
  Divider,
  Spin,
} from "antd";
import axios from "axios";
import { useRouter } from "next/router";
import { useMediaQuery } from "react-responsive";
import authAtom from "../../context/authAtom";
import injuryLocations from "../../data/injuryLocations";
import designations from "../../data/designations";
import dutyAreas from "../../data/dutyAreas";
import { useRecoilValue } from "recoil";

import dayjs from "dayjs";
import weekday from "dayjs/plugin/weekday";
import localeData from "dayjs/plugin/localeData";

import {
  ANTIBODY_TITRE,
  INJURY_DEPTH,
  INJURY_TYPE,
  SEX,
} from "../../helpers/enums";
dayjs.extend(weekday);
dayjs.extend(localeData);
const { Option } = Select;

const NeedleStickForm = () => {
  const [form] = Form.useForm();
  const [isVaccinatedForHBV, setIsVaccinatedForHBV] = useState(false);
  const router = useRouter();
  const { id } = router.query;
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(false);
  const isMobile = useMediaQuery({ query: "(max-width: 767px)" });
  const auth = useRecoilValue(authAtom);

  useEffect(() => {
    if (id) {
      setIsInitialLoading(true);
      axios
        .get(`/api/form/${id}`)
        .then((res) => {
          if (res.status === 200) {
            setIsVaccinatedForHBV(res.data.form.isVaccinatedForHBV);
            // change date fields to dayjs object
            const formData = {
              ...res.data.form,
              reportingTime: dayjs(res.data.form.reportingTime),
              reportingDate: dayjs(res.data.form.reportingTime),
              injuryTime: dayjs(res.data.form.injuryTime),
              injuryDate: dayjs(res.data.form.injuryTime),
            };

            form.setFieldsValue(formData);
          }
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          setIsInitialLoading(false);
        });
    }
    // return () => {
    //   form.resetFields();
    // };
  }, [form, id]);

  const onFinish = async (values) => {
    // combine date and time fields
    const reportingTime = dayjs(
      values.reportingDate.format("YYYY-MM-DD") +
        " " +
        values.reportingTime.format("HH:mm:ss")
    );
    const injuryTime = dayjs(
      values.injuryDate.format("YYYY-MM-DD") +
        " " +
        values.injuryTime.format("HH:mm:ss")
    );
    delete values.reportingDate;
    delete values.injuryDate;
    const formData = {
      ...values,
      reportingTime,
      injuryTime,
    };

    // return;
    try {
      if (id) {
        setIsLoading(true);
        const res = await axios.patch(`/api/form/${id}`, formData);
        if (res.status === 200) {
          notification.success({
            message: "Success",
            description: "Form updated successfully",
          });
        }
      } else {
        setIsLoading(true);
        const resp = await axios.post("/api/form/create", formData);
        if (resp.status === 201) {
          // show notification
          notification.success({
            message: "Success",
            description: "Form submitted successfully",
          });

          router.replace("/forms/success/" + resp.data.newForm.id);
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

  const initialValues = {
    injuryDate: dayjs(),
    injuryTime: dayjs(),
    reportingDate: dayjs(),
    reportingTime: dayjs(),
    email:
      auth.isAuthenticated && auth.user.user_id !== "guest"
        ? auth.user.email
        : "",
    idNumber:
      auth.isAuthenticated && auth.user.user_id !== "guest"
        ? auth.user.user_id
        : "",
  };

  return (
    <Spin spinning={isInitialLoading}>
      <Form
        hidden={isInitialLoading}
        initialValues={initialValues}
        labelCol={{ span: 9 }}
        wrapperCol={{ span: 8 }}
        form={form}
        name="needle-stick"
        onFinish={onFinish}
        scrollToFirstError
      >
        <Form.Item name="name" label="Name" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="age" label="Age">
          <InputNumber min={1} max={120} />
        </Form.Item>
        <Form.Item label="Sex" name="sex">
          <Radio.Group size="large">
            <Radio.Button value="m">{SEX["m"]}</Radio.Button>
            <Radio.Button value="f">{SEX["f"]}</Radio.Button>
            <Radio.Button value="o">{SEX["o"]}</Radio.Button>
          </Radio.Group>
        </Form.Item>
        <Form.Item name="designation" label="Designation">
          <AutoComplete
            options={designations}
            placeholder="Designation"
            filterOption={(inputValue, option) =>
              option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !==
              -1
            }
            style={{ width: 200 }}
          />
        </Form.Item>
        <Form.Item name="dutyArea" label="Duty Area">
          <AutoComplete
            options={dutyAreas}
            placeholder="Duty Area"
            filterOption={(inputValue, option) =>
              option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !==
              -1
            }
            style={{ width: 200 }}
          />
        </Form.Item>
        <Form.Item name="idNumber" label="ID Number">
          <Input />
        </Form.Item>
        <Form.Item
          label="Injury Date and Time"
          rules={[
            {
              required: true,
              message: "Please input Needle Stick Injury Time",
            },
          ]}
        >
          <Input.Group compact>
            <Form.Item name="injuryDate" noStyle rules={[{ required: true }]}>
              <DatePicker style={{ width: "150px" }} />
            </Form.Item>
            <Form.Item name="injuryTime" noStyle rules={[{ required: true }]}>
              <TimePicker
                use12Hours
                format="h:mm a"
                style={{ width: "150px" }}
              />
            </Form.Item>
          </Input.Group>
        </Form.Item>

        <Form.Item
          label="Reporting Time"
          rules={[
            {
              required: true,
              message: "Please input Reporting Date",
            },
          ]}
        >
          <Input.Group compact>
            <Form.Item
              name="reportingDate"
              noStyle
              rules={[{ required: true }]}
            >
              <DatePicker style={{ width: "150px" }} />
            </Form.Item>
            <Form.Item
              name="reportingTime"
              noStyle
              rules={[{ required: true }]}
            >
              <TimePicker
                use12Hours
                format="h:mm a"
                style={{ width: "150px" }}
              />
            </Form.Item>
          </Input.Group>
        </Form.Item>
        <Divider />
        <Form.Item
          name="isVaccinatedForHBV"
          label="Is person vaccinated for HBV"
        >
          <Radio.Group
            onChange={(e) => setIsVaccinatedForHBV(e.target.value === "yes")}
          >
            <Radio value="yes">Yes</Radio>
            <Radio value="no">No</Radio>
          </Radio.Group>
        </Form.Item>

        {isVaccinatedForHBV && (
          <Form.Item name="antibodyTitre" label="anti-HBs titre">
            <Select placeholder="Select titre amount">
              <Option value="lt10">{ANTIBODY_TITRE["lt10"]}</Option>
              <Option value="gt10">{ANTIBODY_TITRE["gt10"]}</Option>
              <Option value="uk">{ANTIBODY_TITRE["uk"]}</Option>
            </Select>
          </Form.Item>
        )}
        <Form.Item name="injuryType" label="Nature of injury">
          <Select placeholder="Select a type of injury">
            <Option value="solid">{INJURY_TYPE["solid"]}</Option>
            <Option value="hollow">{INJURY_TYPE["hollow"]}</Option>
            <Option value="sharpCut">{INJURY_TYPE["sharpCut"]}</Option>
            <Option value="laceration">{INJURY_TYPE["laceration"]}</Option>
            <Option value="splatteredGlass">
              {INJURY_TYPE["splatteredGlass"]}
            </Option>
            <Option value="fluidSplashLow">
              {INJURY_TYPE["fluidSplashLow"]}
            </Option>
            <Option value="fluidSplashHigh">
              {INJURY_TYPE["fluidSplashHigh"]}
            </Option>
          </Select>
        </Form.Item>
        <Form.Item label="Site & depth of injury">
          <Input.Group compact>
            <Form.Item
              name="injuryLocation"
              noStyle
              rules={[{ required: true }]}
            >
              <AutoComplete
                options={injuryLocations}
                placeholder="Site of injury"
                filterOption={(inputValue, option) =>
                  option.value
                    .toUpperCase()
                    .indexOf(inputValue.toUpperCase()) !== -1
                }
                style={{ width: 200 }}
              />
            </Form.Item>
            <Form.Item name="injuryDepth" noStyle>
              <Select placeholder="Depth" style={{ width: 200 }}>
                <Option value="superficial">
                  {INJURY_DEPTH["superficial"]}
                </Option>
                <Option value="deep">{INJURY_DEPTH["deep"]}</Option>
              </Select>
            </Form.Item>
          </Input.Group>
        </Form.Item>
        <Divider />
        <Form.Item label="Status of source">
          <Form.Item
            label="HIV"
            name="sourceHIV"
            labelCol={{ span: 2 }}
            labelAlign="left"
          >
            <Select
              allowClear
              placeholder="HIV source"
              style={{ maxWidth: "20ch" }}
            >
              <Option value="positive">Positive</Option>
              <Option value="negative">negative</Option>
              <Option value="">Unknown</Option>
            </Select>
          </Form.Item>
          <Form.Item
            label="HBV"
            name="sourceHBV"
            labelCol={{ span: 2 }}
            labelAlign="left"
          >
            <Select
              allowClear
              placeholder="HBVsource"
              style={{ maxWidth: "20ch" }}
            >
              <Option value="positive">Positive</Option>
              <Option value="negative">negative</Option>
              <Option value="">Unknown</Option>
            </Select>
          </Form.Item>
          <Form.Item
            label="HCV"
            name="sourceHCV"
            labelCol={{ span: 2 }}
            labelAlign="left"
          >
            <Select
              allowClear
              placeholder="HBV source"
              style={{ maxWidth: "20ch" }}
            >
              <Option value="positive">Positive</Option>
              <Option value="negative">negative</Option>
              <Option value="">Unknown</Option>
            </Select>
          </Form.Item>
        </Form.Item>
        <Form.Item
          name="sourceSerumSent"
          label="Has the source serum sent fot testing"
        >
          <Radio.Group>
            <Radio value="yes">Yes</Radio>
            <Radio value="no">No</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item label="Does the source have signs/symptoms of:">
          <Input.Group compact>
            <Form.Item
              label="HIV infection"
              name="symptomsHIV"
              style={{ margin: "10px" }}
            >
              <Radio.Group>
                <Radio.Button value={false}>No</Radio.Button>
                <Radio.Button value={true}>Yes</Radio.Button>
              </Radio.Group>
            </Form.Item>
            <Form.Item
              label="HBV infection"
              name="symptomsHBV"
              style={{ margin: "10px" }}
            >
              <Radio.Group>
                <Radio.Button value={true}>Yes</Radio.Button>
                <Radio.Button value={false}>No</Radio.Button>
              </Radio.Group>
            </Form.Item>

            <Form.Item
              label="HCV infection"
              name="symptomsHCV"
              style={{ margin: "10px" }}
            >
              <Radio.Group>
                <Radio.Button value={true}>Yes</Radio.Button>
                <Radio.Button value={false}>No</Radio.Button>
              </Radio.Group>
            </Form.Item>
          </Input.Group>
        </Form.Item>
        <Divider />
        <Form.Item label="Action taken in causality:">
          <Form.Item
            labelCol={{ span: 8 }}
            labelAlign="left"
            name="HBVGiven"
            label="HBV given (If not vaccinated):"
          >
            <Radio.Group>
              <Radio value="yes">Yes</Radio>
              <Radio value="no">No</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item
            labelCol={{ span: 8 }}
            labelAlign="left"
            name="immunoglobulinGiven"
            label="HB immunoglobulin given :"
          >
            <Radio.Group>
              <Radio value="yes">Yes</Radio>
              <Radio value="no">No</Radio>
            </Radio.Group>
          </Form.Item>

          <Form.Item
            labelCol={{ span: 8 }}
            labelAlign="left"
            name="ARTGiven"
            label="ART given (if required)"
          >
            <Select placeholder="select an option" style={{ width: "25ch" }}>
              <Option value="no">No</Option>
              <Option value="2h">Yes, within 2 hours</Option>
              <Option value="72h">Yes, within 72 hours</Option>
              <Option value="gt72h">Yes, outside 72 hours</Option>
            </Select>
          </Form.Item>
        </Form.Item>
        <Divider />

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

          <Button style={{ marginLeft: 10 }} onClick={() => router.back()}>
            Cancel
          </Button>
        </Form.Item>
      </Form>
    </Spin>
  );
};

export default NeedleStickForm;
