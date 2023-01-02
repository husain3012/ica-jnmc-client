import { message } from "antd";
import axios from "axios";
import dayjs from "dayjs";

export const downloadCsvData = async (setLoadingDownload) => {
  setLoadingDownload && setLoadingDownload(true);
  try {
    const res = await axios.get("/api/admin/settings/backup");
    if (res.status === 200) {
      console.log(res.data);
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      const today = dayjs().format("DD-MMM-YYYY_hh-mm-ss");
      link.setAttribute("download", "pepjnmc_backup_" + today + ".csv");
      document.body.appendChild(link);
      link.click();
      message.success("Downloaded");
    }
  } catch (error) {
    message.error("Error downloading");
  }
  setLoadingDownload && setLoadingDownload(false);
};
