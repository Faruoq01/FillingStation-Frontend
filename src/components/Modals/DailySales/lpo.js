import React, { useState } from "react";
import close from "../../../assets/close.png";
import Button from "@mui/material/Button";
import OutlinedInput from "@mui/material/OutlinedInput";
import Modal from "@mui/material/Modal";
import { ThreeDots } from "react-loader-spinner";
import swal from "sweetalert";
import "../../../styles/lpo.scss";
import { useEffect } from "react";
import DailySalesService from "../../../services/DailySales";
import { useDispatch, useSelector } from "react-redux";
import APIs from "../../../services/api";

const UpdateLPO = (props) => {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const oneStationData = useSelector((state) => state.outlet.adminOutlet);
  const currentDate = useSelector((state) => state.dailysales.currentDate);
  const [loading, setLoading] = useState(false);
  const [accountName, setAccountName] = useState("");
  const [producType, setProductType] = useState("");
  const [truckNo, setTruckNo] = useState("");
  const [quantity, setQuantity] = useState("");
  const [rate, setRate] = useState("");

  const resolveUserID = () => {
    if (user.userType === "superAdmin") {
      return { id: user._id };
    } else {
      return { id: user.organisationID };
    }
  };

  const handleClose = () => props.close(false);

  const getLPORate = (data) => {
    switch (data.productType) {
      case "PMS": {
        return data.PMSRate;
      }
      case "AGO": {
        return data.AGORate;
      }
      case "DPK": {
        return data.DPKRate;
      }
      default: {
      }
    }
  };

  useEffect(() => {
    setAccountName(props.data.accountName);
    setProductType(props.data.productType);
    setTruckNo(props.data.truckNo);
    setQuantity(props.data.lpoLitre);
    setRate(getLPORate(props.data));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const submit = () => {
    if (accountName === "")
      return swal("Warning!", "Account name cannot be empty", "info");
    if (producType === "")
      return swal("Warning!", "Product type cannot be empty", "info");
    if (truckNo === "")
      return swal("Warning!", "Truck no cannot be empty", "info");
    if (quantity === "")
      return swal("Warning!", "Opening meter cannot be empty", "info");
    if (rate === "") return swal("Warning!", "Rate cannot be empty", "info");
    setLoading(true);

    const payload = {
      lpo: props.data,
      truckNo: truckNo,
    };

    APIs.post("/comprehensive/update-lpo", payload)
      .then(({ data }) => {
        props.update((prev) => !prev);
        setLoading(false);
      })
      .then(() => {
        handleClose();
        swal("Success!", "Record has been updated successfully!", "success");
      });
  };

  return (
    <Modal
      open={props.open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
      <div
        data-aos="zoom-out-up"
        style={{ height: "auto" }}
        className="modalContainer2">
        <div style={{ height: "auto", margin: "20px" }} className="inner">
          <div className="head">
            <div className="head-text">Edit LPO Sales</div>
            <img
              onClick={handleClose}
              style={{ width: "18px", height: "18px" }}
              src={close}
              alt={"icon"}
            />
          </div>

          <div className="middleDiv" style={inner}>
            <div style={{ marginTop: "15px" }} className="inputs">
              <div style={{ marginTop: "10px" }} className="inputs">
                <div className="head-text2">Account Name</div>
                <OutlinedInput
                  disabled
                  sx={{
                    width: "100%",
                    height: "35px",
                    marginTop: "5px",
                    background: "#EEF2F1",
                    borderRadius: "0px",
                    fontSize: "12px",
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      border: "1px solid #777777",
                    },
                  }}
                  placeholder=""
                  type="text"
                  value={accountName}
                  onChange={(e) => setAccountName(e.target.value)}
                />
              </div>

              <div style={{ marginTop: "15px" }} className="inputs">
                <div className="head-text2">Product</div>
                <OutlinedInput
                  disabled
                  sx={{
                    width: "100%",
                    height: "35px",
                    marginTop: "5px",
                    background: "#EEF2F1",
                    borderRadius: "0px",
                    fontSize: "12px",
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      border: "1px solid #777777",
                    },
                  }}
                  placeholder=""
                  type="text"
                  value={producType}
                  onChange={(e) => setProductType(e.target.value)}
                />
              </div>

              <div style={{ marginTop: "15px" }} className="inputs">
                <div className="head-text2">Truck No</div>
                <OutlinedInput
                  sx={{
                    width: "100%",
                    height: "35px",
                    marginTop: "5px",
                    background: "#EEF2F1",
                    borderRadius: "0px",
                    fontSize: "12px",
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      border: "1px solid #777777",
                    },
                  }}
                  placeholder=""
                  type="text"
                  value={truckNo}
                  onChange={(e) => setTruckNo(e.target.value)}
                />
              </div>

              <div style={{ marginTop: "10px" }} className="head-text2">
                Rate
              </div>
              <OutlinedInput
                disabled
                sx={{
                  width: "100%",
                  height: "35px",
                  marginTop: "5px",
                  background: "#EEF2F1",
                  borderRadius: "0px",
                  fontSize: "12px",
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    border: "1px solid #777777",
                  },
                }}
                placeholder=""
                type="text"
                value={rate}
                onChange={(e) => setRate(e.target.value)}
              />

              <div style={{ marginTop: "15px" }} className="inputs">
                <div className="head-text2">Quantity</div>
                <OutlinedInput
                  sx={{
                    width: "100%",
                    height: "35px",
                    marginTop: "5px",
                    background: "#EEF2F1",
                    borderRadius: "0px",
                    fontSize: "12px",
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      border: "1px solid #777777",
                    },
                  }}
                  placeholder=""
                  type="text"
                  value={quantity}
                  disabled
                  //   onChange={(e) => setQuantity(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div style={{ marginTop: "10px", height: "30px" }} className="butt">
            <Button
              disabled={loading}
              sx={{
                width: "100px",
                height: "30px",
                background: "#427BBE",
                borderRadius: "3px",
                fontSize: "10px",
                marginTop: "0px",
                "&:hover": {
                  backgroundColor: "#427BBE",
                },
              }}
              onClick={submit}
              variant="contained">
              {" "}
              Save
            </Button>

            {loading ? (
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
            ) : null}
          </div>
        </div>
      </div>
    </Modal>
  );
};

const inner = {
  width: "100%",
  height: "380px",
};

export default UpdateLPO;
