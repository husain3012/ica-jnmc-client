import { useEffect, useState } from "react";
import { Button, Col, Divider, Modal, Row, Spin, Typography } from "antd";
import axios from "axios";
import dayjs from "dayjs";
import {
  ANTIBODY_TITRE,
  INJURY_DEPTH,
  INJURY_TYPE,
  SEX,
} from "../../helpers/enums";
import _ from "lodash";
const ViewFormModal = ({ id, setShowModal }) => {
  const [form, setForm] = useState(null); // [form, setForm
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (!id) return;
    setLoading(true);
    axios.get(`/api/form/${id}`).then((res) => {
      setLoading(false);
      console.log(res.data);
      setForm(res.data);
    });
  }, [id]);

  return (
    <Modal
    onCancel={() => setShowModal(null)}
      footer={[
        <Button
          key="submit"
          type="primary"
          onClick={() => setShowModal(null)}
        >
          OK
        </Button>,
      ]}
      cancelText={null}
      open={!!id}
    >
      <Typography.Title level={3}>Form Details</Typography.Title>
      <Spin spinning={loading}>
        {!loading && form && (
          <>
            <div>
              <strong>Form ID:</strong> <span>{form.id}</span>
            </div>
            <Divider />
            <div>
              <Row>
                <Col span={8}>
                  <strong>Name :</strong>
                </Col>
                <Col span={8}>
                  <span>{form.form?.name}</span>
                </Col>
              </Row>
              <Row>
                <Col span={8}>
                  <strong>Sex :</strong>
                </Col>
                <Col span={8}>
                  <span>{SEX[form.form?.sex]}</span>
                </Col>
              </Row>
              <Row>
                <Col span={8}>
                  <strong>Age :</strong>
                </Col>
                <Col span={8}>
                  <span>{form.form?.age}</span>
                </Col>
              </Row>
              <Row>
                <Col span={8}>
                  <strong>ID No. :</strong>
                </Col>
                <Col span={8}>
                  <span>{form.form?.idNumber || "-"}</span>
                </Col>
              </Row>
              <Row>
                <Col span={8}>
                  <strong>Designation :</strong>
                </Col>
                <Col span={8}>
                  <span>{form.form.designation}</span>
                </Col>
              </Row>
              <Row>
                <Col span={8}>
                  <strong>Duty Area :</strong>
                </Col>
                <Col span={8}>
                  <span>{form.form.dutyArea}</span>
                </Col>
              </Row>
              <Row>
                <Col span={8}>
                  <strong>Reporting Time :</strong>
                </Col>
                <Col span={8}>
                  <span>
                    {dayjs(form?.form?.reportingTime).format(
                      "DD-MM-YYYY, hh:mm, A"
                    )}
                  </span>
                </Col>
              </Row>
              <Divider />
              <Row>
                <Col span={8}>
                  <strong>Injury Time :</strong>
                </Col>
                <Col span={8}>
                  <span>
                    {dayjs(form?.form?.injuryTime).format(
                      "DD-MM-YYYY, hh:mm, A"
                    )}
                  </span>
                </Col>
              </Row>
              <Row>
                <Col span={8}>
                  <strong>Injury location :</strong>
                </Col>
                <Col span={8}>
                  <span>{form?.form.injuryLocation}</span>
                </Col>
              </Row>
              <Row>
                <Col span={8}>
                  <strong>Injury type :</strong>
                </Col>
                <Col span={8}>
                  <span>{INJURY_TYPE[form?.form.injuryType]}</span>
                </Col>
              </Row>
              <Row>
                <Col span={8}>
                  <strong>Injury Depth :</strong>
                </Col>
                <Col span={8}>
                  <span>{INJURY_DEPTH[form.form.injuryDepth]}</span>
                </Col>
              </Row>
              <Row>
                <Col span={8}>
                  <strong>Vaccinated for HBV :</strong>
                </Col>
                <Col span={8}>
                  <span>{_(form?.form.isVaccinatedForHBV).capitalize()}</span>
                </Col>
              </Row>

              {form?.form.isVaccinatedForHBV === "yes" && (
                <Row>
                  <Col span={8}>
                    <strong>anti-HBs titre :</strong>
                  </Col>
                  <Col span={8}>
                    <span>{ANTIBODY_TITRE[form?.form.antibodyTitre]}</span>
                  </Col>
                </Row>
              )}

              <Divider />
              <p>Status of source: </p>
              <Row>
                <Col span={8}>
                  <strong>HIV :</strong>
                </Col>
                <Col span={8}>
                  <span>{_(form.form.sourceHIV).capitalize() || "-"}</span>
                </Col>
              </Row>
              <Row>
                <Col span={8}>
                  <strong>HBV :</strong>
                </Col>
                <Col span={8}>
                  <span>{_(form.form.sourceHBV).capitalize() || "-"}</span>
                </Col>
              </Row>
              <Row>
                <Col span={8}>
                  <strong>HCV :</strong>
                </Col>
                <Col span={8}>
                  <span>{_(form.form.sourceHCV).capitalize() || "-"}</span>
                </Col>
              </Row>
              <Row>
                <Col span={8}>
                  <strong>Sent for testing :</strong>
                </Col>
                <Col span={8}>
                  <span>
                    {_(form.form.sourceSerumSent).capitalize() || "-"}
                  </span>
                </Col>
              </Row>

              <Divider />

              <Row>
                <Col span={8}>
                  <strong>Created At :</strong>
                </Col>
                <Col span={8}>
                  <span>
                    {dayjs(form.createdAt).format("DD-MM-YYYY, hh:mm, A")}
                  </span>
                </Col>
              </Row>
              <Row>
                <Col span={8}>
                  <strong>Updated At :</strong>
                </Col>
                <Col span={8}>
                  <span>
                    {dayjs(form.updatedAt).format("DD-MM-YYYY, hh:mm, A")}
                  </span>
                </Col>
              </Row>
              <Row>
                <Col span={8}>
                  <strong>Created By:</strong>
                </Col>
                <Col span={8}>
                  <span>{form.users.email}</span>
                </Col>
              </Row>
            </div>
          </>
        )}
      </Spin>
    </Modal>
  );
};

export default ViewFormModal;
