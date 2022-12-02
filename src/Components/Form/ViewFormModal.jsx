import { useEffect } from "react";
import { Modal } from "antd";
import axios from "axios";

const ViewFormModal = (id) => {
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setLoading(true);
    axios.get(`/api/form/${id}`).then((res) => {
      console.log(res.data);
    });
  }, [id]);

  return <Modal>ViewFormModal</Modal>;
};

export default ViewFormModal;
