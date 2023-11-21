import { Button } from "@mui/material";
import React from "react";
import { useState } from "react";
import { ThreeDots } from "react-loader-spinner";
import photo from "../../assets/photo.png";
import upload from "../../assets/upload.png";
import { useRef } from "react";
import axios from "axios";
import config from "../../constants";
import APIs from "../../services/connections/api";

const UploadPhoto = ({ setOpen, setGall, cam }) => {
  const attach = useRef();
  const [loading2, setLoading2] = useState(0);

  const uploadProductOrders = () => {
    attach.current.click();
  };

  const selectedFile = (e) => {
    let file;

    if (e.target.files && e.target.files.length > 0) {
      file = e.target.files[0];
    } else if (e.target.files && e.target.files.length === 0) {
      return;
    } else {
      const reader = new FileReader();
      reader.onload = function (event) {
        const base64String = event.target.result.split(",")[1];
        uploadBase64(base64String);
      };
      reader.readAsDataURL(e.target.files[0]);
      return;
    }

    setLoading2(1);

    const formData = new FormData();
    formData.append("file", file);

    const httpConfig = {
      headers: {
        "content-type": "multipart/form-data",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    };

    const url = `${config.BASE_URL}/360-station/api/upload`;

    axios
      .post(url, formData, httpConfig)
      .then((data) => {
        setGall(data.data.path);
      })
      .then(() => {
        setLoading2(2);
      });
  };

  const uploadBase64 = (imageSrc) => {
    const url = `${config.BASE_URL}/360-station/api/uploadFromCamera`;
    APIs.post(url, { image: imageSrc })
      .then(({ data }) => {
        setGall(data.path);
      })
      .then(() => {
        setLoading2(2);
      });
  };

  const openCamera = () => {
    setOpen(true);
  };

  return (
    <React.Fragment>
      <Button
        sx={{
          width: "98%",
          height: "35px",
          background: "green",
          borderRadius: "3px",
          fontSize: "10px",
          marginTop: "30px",
          "&:hover": {
            backgroundColor: "green",
          },
        }}
        onClick={openCamera}
        variant="contained">
        <img
          style={{ width: "25px", height: "20px", marginRight: "10px" }}
          src={photo}
          alt={"icon"}
        />
        {cam === "null" && <div>Take Photo</div>}
        {cam !== "null" && (
          <div style={{ color: "#fff", fontSize: "12px" }}>Success</div>
        )}
      </Button>

      <Button
        sx={{
          width: "98%",
          height: "35px",
          background: "#427BBE",
          borderRadius: "3px",
          fontSize: "10px",
          marginTop: "20px",
          "&:hover": {
            backgroundColor: "#427BBE",
          },
        }}
        onClick={uploadProductOrders}
        variant="contained">
        <img
          style={{ width: "25px", height: "20px", marginRight: "10px" }}
          src={upload}
          alt={"icon"}
        />
        {loading2 === 0 && <div>Attachment</div>}
        {loading2 === 1 && (
          <ThreeDots
            height="60"
            width="50"
            radius="9"
            color="#076146"
            ariaLabel="three-dots-loading"
            wrapperStyle={{}}
            wrapperClassName=""
            visible={true}
          />
        )}
        {loading2 === 2 && (
          <div style={{ color: "#fff", fontSize: "12px" }}>Success</div>
        )}
      </Button>
      <input
        onChange={selectedFile}
        ref={attach}
        type="file"
        style={{ visibility: "hidden" }}
      />
    </React.Fragment>
  );
};

export default UploadPhoto;
