import { Button, Upload, message } from "antd";
import axios from "axios";
import React, { useState } from "react";
import { UploadOutlined } from "@ant-design/icons";
import authAtom from "../../context/authAtom";
import { useRecoilValue } from "recoil";
const BackupUpload = () => {
  const [isSuccess, setIsSuccess] = useState(false);
  const [progress, setProgress] = useState(0);
  const { token } = useRecoilValue(authAtom);

  const props = {
    name: "backup",
    action: "/api/admin/settings/backup",
    headers: {
      authorization: `Bearer ${token}`,
    },

    onChange(info) {
      if (info.file.status !== "uploading") {
        console.log(info.file, info.fileList);
      }
      if (info.file.status === "done") {
        message.success(`${info.file.name} file uploaded successfully`);
      } else if (info.file.status === "error") {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
  };
  const uploadForm = async (formData) => {
    setIsLoading(true);
    await axios.post(url, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress: (progressEvent) => {
        const progress = (progressEvent.loaded / progressEvent.total) * 50;
        setProgress(progress);
    },
      onDownloadProgress: (progressEvent) => {
        const progress = 50 + (progressEvent.loaded / progressEvent.total) * 50;
        console.log(progress);
        setProgress(progress);
      },
    });
    setIsSuccess(true);
  };
  return (
    <div>
      <Upload maxCount={1} {...props}>
        <Button icon={<UploadOutlined />}>Upload Backup</Button>
      </Upload>
    </div>
  );
};

export default BackupUpload;
