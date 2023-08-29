import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import close from "../../../assets/close.png";
import Button from "@mui/material/Button";
import OutlinedInput from "@mui/material/OutlinedInput";
import Modal from "@mui/material/Modal";
import { ThreeDots } from "react-loader-spinner";
import Radio from "@mui/material/Radio";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import swal from "sweetalert";
import OutletService from "../../../services/outletService";
import { removeSpinner, setSpinner } from "../../../storage/outlet";

const EditPump = (props) => {
  const dispatch = useDispatch();
  const loadingSpinner = useSelector((state) => state.auth.loadingSpinner);

  const [initialState, setInitialState] = useState(0);
  const [productType, setProduct] = useState("PMS");
  const [pumpName, setPumpName] = useState("");
  const [totalizer, setTotalizer] = useState("");
  const [hostTank, setHostTank] = useState(null);
  const [list, setList] = useState([]);

  const handleClose = () => dispatch(props.close(false));

  function removeSpecialCharacters(str) {
    return str.replace(/[^0-9.]/g, "");
  }

  const handleOpen = () => {
    if (hostTank === null)
      return swal("Warning!", "Please select host tank", "info");
    if (pumpName === "")
      return swal("Warning!", "Pump name field cannot be empty", "info");
    if (initialState === "")
      return swal("Warning!", "Tank name field cannot be empty", "info");
    if (productType === "")
      return swal("Warning!", "Product type field cannot be empty", "info");
    if (totalizer === "")
      return swal("Warning!", "Totalizer field cannot be empty", "info");
    dispatch(setSpinner());

    const data = {
      id: props.data._id,
      pumpName: pumpName,
      hostTank: hostTank._id,
      productType: productType,
      totalizerReading: removeSpecialCharacters(totalizer),
      organisationID: hostTank.organisationID,
      outletID: hostTank.outletID,
      hostTankName: hostTank.tankName,
    };

    OutletService.pumpUpdate(data)
      .then((data) => {
        dispatch(removeSpinner());
        props.refresh();
        swal("Success", data.message, "success");
      })
      .then(() => {
        handleClose();
      });
  };

  const updateTankDetails = (data, index) => {
    setInitialState(index);
    setHostTank(data);
  };

  useEffect(() => {
    const findID = props.allTank.findIndex(
      (data) => data._id === props.data.hostTank
    );
    setProduct(props.data.productType);
    setTotalizer(props.data.totalizerReading);
    setPumpName(props.data.pumpName.split(" ")[1]);
    setHostTank(props.allTank[findID]);
    setList(
      props.allTank.filter(
        (data) => data.productType === props.data.productType
      )
    );
  }, [
    props.data.productType,
    props.allTank,
    props.data.totalizerReading,
    props.data.hostTank,
    props.data.pumpName,
    productType,
  ]);

  return (
    <Modal
      open={props.open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
      <div style={{ height: "430px" }} className="modalContainer2">
        <div className="inner">
          <div className="head">
            <div className="head-text">Edit Pump</div>
            <img
              onClick={handleClose}
              style={{ width: "18px", height: "18px" }}
              src={close}
              alt={"icon"}
            />
          </div>

          <div style={{ marginTop: "15px" }} className="inputs">
            <div className="head-text2">Choose product type</div>
            <div className="radio">
              {(props.tabs === 1 || props.tabs === 0) && (
                <div className="rad-item">
                  <Radio
                    onClick={() => {
                      setProduct("PMS");
                    }}
                    checked={productType === "PMS" ? true : false}
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
                      setProduct("AGO");
                    }}
                    checked={productType === "AGO" ? true : false}
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
                      setProduct("DPK");
                    }}
                    checked={productType === "DPK" ? true : false}
                  />
                  <div className="head-text2" style={{ marginRight: "5px" }}>
                    DPK
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="inputs">
            <div className="head-text2">Pump No/ Series</div>
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
              value={pumpName}
              type="number"
              onChange={(e) => setPumpName(e.target.value)}
            />
          </div>

          <div style={{ marginTop: "15px" }} className="inputs">
            <div className="head-text2">Tank Connected to pump</div>
            <Select
              labelId="demo-select-small"
              id="demo-select-small"
              value={initialState}
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
              }}>
              <MenuItem style={menu} value={0}>
                Select a tank
              </MenuItem>
              {list.map((data, index) => {
                return (
                  <MenuItem
                    onClick={() => {
                      updateTankDetails(data, index + 1);
                    }}
                    key={index}
                    style={menu}
                    value={index + 1}>
                    {data.tankName}
                  </MenuItem>
                );
              })}
            </Select>
          </div>

          <div style={{ marginTop: "15px" }} className="inputs">
            <div className="head-text2">Totalizer Reading</div>
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
              value={totalizer}
              type="text"
              onChange={(e) => setTotalizer(e.target.value)}
            />
          </div>

          <div style={{ height: "30px" }} className="butt">
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
              onClick={handleOpen}
              variant="contained">
              {" "}
              Save
            </Button>

            {loadingSpinner && (
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

const menu = {
  fontSize: "14px",
};

export default EditPump;
