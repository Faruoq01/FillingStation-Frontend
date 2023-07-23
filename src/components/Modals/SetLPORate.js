import React, { useState } from "react";
import { useSelector } from "react-redux";
import close from "../../assets/close.png";
import Button from "@mui/material/Button";
import OutlinedInput from "@mui/material/OutlinedInput";
import Modal from "@mui/material/Modal";
import { ThreeDots } from "react-loader-spinner";
import swal from "sweetalert";
import "../../styles/lpo.scss";
import LPOService from "../../services/lpo";
import { useEffect } from "react";

const LPORateModal = (props) => {
  const [loading, setLoading] = useState(false);
  const user = useSelector((state) => state.auth.user);
  const singleLPO = useSelector((state) => state.lpo.singleLPO);
  const [pms, setPMS] = useState("");
  const [ago, setAGO] = useState("");
  const [dpk, setDPK] = useState("");

  const resolveUserID = () => {
    if (user.userType === "superAdmin") {
      return { id: user._id };
    } else {
      return { id: user.organisationID };
    }
  };

  useEffect(() => {
    setPMS(singleLPO.PMSRate);
    setAGO(singleLPO.AGORate);
    setDPK(singleLPO.DPKRate);
  }, [singleLPO.AGORate, singleLPO.DPKRate, singleLPO.PMSRate]);

  const handleClose = () => props.close(false);

  const submit = () => {
    if (pms === "")
      return swal("Warning!", "Employee name field cannot be empty", "info");
    if (ago === "")
      return swal("Warning!", "Query title field cannot be empty", "info");
    if (dpk === "")
      return swal("Warning!", "Description field cannot be empty", "info");

    setLoading(true);

    const payload = {
      id: singleLPO?._id,
      PMSRate: pms,
      AGORate: ago,
      DPKRate: dpk,
      organisationID: resolveUserID().id,
    };

    LPOService.updateLPO(payload)
      .then((data) => {
        swal("Success", "LPO created successfully!", "success");
      })
      .then(() => {
        setLoading(false);
        props.refresh();
        handleClose();
      });
  };

  return (
    <Modal
      open={props.open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
      <div style={{ height: "auto" }} className="modalContainer2">
        <div style={{ height: "auto", margin: "20px" }} className="inner">
          <div className="head">
            <div className="head-text">Edit Product Rate</div>
            <img
              onClick={handleClose}
              style={{ width: "18px", height: "18px" }}
              src={close}
              alt={"icon"}
            />
          </div>

          <div className="middleDiv" style={inner}>
            <div className="inputs">
              <div className="head-text2">PMS Rate per litre</div>
              <OutlinedInput
                sx={{
                  width: "100%",
                  height: "35px",
                  marginTop: "5px",
                  background: "#EEF2F1",
                  border: "1px solid #777777",
                  fontSize: "12px",
                }}
                placeholder=""
                type="number"
                value={pms}
                onChange={(e) => setPMS(e.target.value)}
              />
            </div>

            <div className="inputs">
              <div className="head-text2">AGO Rate per litre</div>
              <OutlinedInput
                sx={{
                  width: "100%",
                  height: "35px",
                  marginTop: "5px",
                  background: "#EEF2F1",
                  border: "1px solid #777777",
                  fontSize: "12px",
                }}
                placeholder=""
                type="number"
                value={ago}
                onChange={(e) => setAGO(e.target.value)}
              />
            </div>

            <div className="inputs">
              <div className="head-text2">DPK Rate per litre</div>
              <OutlinedInput
                sx={{
                  width: "100%",
                  height: "35px",
                  marginTop: "5px",
                  background: "#EEF2F1",
                  border: "1px solid #777777",
                  fontSize: "12px",
                }}
                placeholder=""
                type="number"
                value={dpk}
                onChange={(e) => setDPK(e.target.value)}
              />
            </div>
          </div>
          <div style={{ marginTop: "10px", height: "30px" }} className="butt">
            <Button
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
  height: "280px",
};

export default LPORateModal;
