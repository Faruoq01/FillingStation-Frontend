import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { closeModal, createTanks } from "../../store/actions/outlet";
import { useSelector } from "react-redux";
import close from "../../assets/close.png";
import Button from "@mui/material/Button";
import OutlinedInput from "@mui/material/OutlinedInput";
import Modal from "@mui/material/Modal";
import { ThreeDots } from "react-loader-spinner";
import Radio from "@mui/material/Radio";
import swal from "sweetalert";

const AddTank = (props) => {
  const dispatch = useDispatch();
  const open = useSelector((state) => state.outlet.openModal);
  const oneStation = useSelector((state) => state.outlet.adminOutlet);

  const handleClose = () => dispatch(closeModal(0));
  const [tankName, setTankName] = useState("");
  const [tankHeight, setTankHeight] = useState("");
  const [productType, setProductType] = useState("PMS");
  const [tankCapacity, setTankCapacity] = useState("");
  const [deadStockLevel, setDeadStockLevel] = useState("");
  const [calibrationDate, setCalibrationDate] = useState("");
  const [currentStock, setCurrentStock] = useState("");
  const [waiting, setWaiting] = useState(false);

  useEffect(() => {
    if (props.tabs === 0) {
      setProductType("PMS");
    } else if (props.tabs === 1) {
      setProductType("PMS");
    } else if (props.tabs === 2) {
      setProductType("AGO");
    } else if (props.tabs === 3) {
      setProductType("DPK");
    }
  }, [props.tabs]);

  function removeSpecialCharacters(str) {
    return str.replace(/[^0-9.]/g, "");
  }

  const handleAddPump = async () => {
    if (tankName === "")
      return swal("Warning!", "Tank name field cannot be empty", "info");
    if (productType === "")
      return swal("Warning!", "product type field cannot be empty", "info");
    if (tankCapacity === "")
      return swal("Warning!", "Tank capacity field cannot be empty", "info");
    if (deadStockLevel === "")
      return swal("Warning!", "Dead stock level field cannot be empty", "info");
    if (calibrationDate === "")
      return swal("Warning!", "Calibration date field cannot be empty", "info");
    if (currentStock === "")
      return swal("Warning!", "Current stock field cannot be empty", "info");
    if (oneStation === null)
      return swal("Warning!", "Please create a station", "info");
    setWaiting(true);

    const today = new Date();
    const dd = String(today.getDate()).padStart(2, "0");
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const yy = today.getFullYear();
    const day = mm + "/" + dd + "/" + yy;

    const data = {
      tankName: tankName,
      tankHeight: removeSpecialCharacters(tankHeight),
      productType: productType,
      tankCapacity: removeSpecialCharacters(tankCapacity),
      deadStockLevel: removeSpecialCharacters(deadStockLevel),
      calibrationDate: calibrationDate,
      organisationID: oneStation?.organisation,
      outletID: oneStation?._id,
      dateUpdated: day,
      station: oneStation?.outletName,
      previousLevel: "None",
      quantityAdded: "None",
      currentLevel: removeSpecialCharacters(currentStock),
    };

    await dispatch(createTanks(data, setWaiting));
    await props.refresh();
    setTimeout(() => {
      props.outRefresh();
    }, 500);
    dispatch(closeModal(0));
  };

  return (
    <Modal
      open={open === 2}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
      <div className="modalContainer2">
        <div className="inner">
          <div className="head">
            <div className="head-text">Add Tank</div>
            <img
              onClick={handleClose}
              style={{ width: "18px", height: "18px" }}
              src={close}
              alt={"icon"}
            />
          </div>

          <div style={cont}>
            <div style={{ marginTop: "15px" }} className="inputs">
              <div className="head-text2">Choose product type</div>
              <div className="radio">
                {(props.tabs === 1 || props.tabs === 0) && (
                  <div className="rad-item">
                    <Radio
                      onClick={() => {
                        setProductType("PMS");
                      }}
                      checked={
                        productType === "PMS" || props.tabs === 1 ? true : false
                      }
                    />
                    <div className="head-text2" style={{ marginRight: "5px" }}>
                      PMS
                    </div>
                  </div>
                )}
                {(props.tabs === 2 || props.tabs === 0) && (
                  <div className="rad-item">
                    <Radio
                      onClick={() => {
                        setProductType("AGO");
                      }}
                      checked={
                        productType === "AGO" || props.tabs === 2 ? true : false
                      }
                    />
                    <div className="head-text2" style={{ marginRight: "5px" }}>
                      AGO
                    </div>
                  </div>
                )}
                {(props.tabs === 3 || props.tabs === 0) && (
                  <div className="rad-item">
                    <Radio
                      onClick={() => {
                        setProductType("DPK");
                      }}
                      checked={
                        productType === "DPK" || props.tabs === 3 ? true : false
                      }
                    />
                    <div className="head-text2" style={{ marginRight: "5px" }}>
                      DPK
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="inputs">
              <div className="head-text2">Tank No/ Series</div>
              <OutlinedInput
                sx={{
                  width: "100%",
                  height: "35px",
                  marginTop: "5px",
                  background: "#EEF2F1",
                  fontSize: "12px",
                  borderRadius: "0px",
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    border: "1px solid #777777",
                  },
                }}
                placeholder=""
                type="number"
                onChange={(e) => setTankName(e.target.value)}
              />
            </div>

            <div style={{ marginTop: "15px" }} className="inputs">
              <div className="head-text2">Tank Height in cm (optional)</div>
              <OutlinedInput
                sx={{
                  width: "100%",
                  height: "35px",
                  marginTop: "5px",
                  background: "#EEF2F1",
                  fontSize: "12px",
                  borderRadius: "0px",
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    border: "1px solid #777777",
                  },
                }}
                placeholder=""
                type="text"
                onChange={(e) => setTankHeight(e.target.value)}
              />
            </div>

            <div style={{ marginTop: "15px" }} className="inputs">
              <div className="head-text2">Tank Capacity</div>
              <OutlinedInput
                sx={{
                  width: "100%",
                  height: "35px",
                  marginTop: "5px",
                  background: "#EEF2F1",
                  fontSize: "12px",
                  borderRadius: "0px",
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    border: "1px solid #777777",
                  },
                }}
                placeholder=""
                type="text"
                onChange={(e) => setTankCapacity(e.target.value)}
              />
            </div>

            <div style={{ marginTop: "15px" }} className="inputs">
              <div className="head-text2">Current Stock Level</div>
              <OutlinedInput
                sx={{
                  width: "100%",
                  height: "35px",
                  marginTop: "5px",
                  background: "#EEF2F1",
                  fontSize: "12px",
                  borderRadius: "0px",
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    border: "1px solid #777777",
                  },
                }}
                placeholder=""
                type="text"
                onChange={(e) => setCurrentStock(e.target.value)}
              />
            </div>

            <div style={{ marginTop: "15px" }} className="inputs">
              <div className="head-text2">Dead Stock Level (Litre)</div>
              <OutlinedInput
                sx={{
                  width: "100%",
                  height: "35px",
                  marginTop: "5px",
                  background: "#EEF2F1",
                  fontSize: "12px",
                  borderRadius: "0px",
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    border: "1px solid #777777",
                  },
                }}
                placeholder=""
                type="text"
                onChange={(e) => setDeadStockLevel(e.target.value)}
              />
            </div>

            <div style={{ marginTop: "15px" }} className="inputs">
              <div className="head-text2">Calibration Date</div>
              <input
                defaultValue={new Date()}
                onChange={(e) => setCalibrationDate(e.target.value)}
                style={date}
                type={"date"}
              />
            </div>
          </div>

          <div style={{ marginTop: "10px", height: "30px" }} className="butt">
            <Button
              disabled={waiting}
              sx={{
                width: "100px",
                height: "30px",
                background: "#427BBE",
                borderRadius: "3px",
                fontSize: "10px",
                marginTop: "00px",
                "&:hover": {
                  backgroundColor: "#427BBE",
                },
              }}
              onClick={handleAddPump}
              variant="contained">
              {" "}
              Save
            </Button>

            {waiting && (
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
          </div>
        </div>
      </div>
    </Modal>
  );
};

const cont = {
  width: "100%",
  height: "500px",
  overflowY: "scroll",
  overflowX: "hidden",
};

const date = {
  width: "95%",
  height: "35px",
  background: "#EEF2F1",
  paddingLeft: "2%",
  paddingRight: "2%",
  borderRadius: "0px",
  border: "1px solid #777777",
  outline: "none",
};

export default AddTank;
