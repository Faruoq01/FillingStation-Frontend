import { Button } from "@mui/material";
import photo from "../../assets/photo.png";
import upload from "../../assets/upload.png";
import { useDispatch, useSelector } from "react-redux";
import AddIcon from "@mui/icons-material/Add";
import hr8 from "../../assets/hr8.png";
import swal from "sweetalert";
import axios from "axios";
import config from "../../constants";
import { useState } from "react";
import { useRef } from "react";
import ReactCamera from "../Modals/ReactCamera";
import { expensesPayload } from "../../storage/recordsales";
import "../../styles/lpoNew.scss";
import moment from "moment";

const ExpenseComponents = (props) => {
  const gallery = useRef();
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const oneStationData = useSelector((state) => state.outlet.adminOutlet);
  const [reg, setReg] = useState(false);

  /////////////////////////////////////////////////////////////
  const user = useSelector((state) => state.auth.user);
  const selectedPumps = useSelector((state) => state.recordsales.selectedPumps);
  const selectedTanks = useSelector((state) => state.recordsales.selectedTanks);
  const expensesPayloadData = useSelector(
    (state) => state.recordsales.expensesPayload
  );
  const currentDate = useSelector((state) => state.recordsales.currentDate);
  const mainDate = moment
    .tz(currentDate, user.timezone)
    .format("YYYY-MM-DD HH:mm:ss")
    .split(" ")[0];

  console.log(selectedPumps, "selected pumps");
  console.log(selectedTanks, "selected tanks");
  console.log(expensesPayloadData, "records");

  // payload data
  const [expenseName, setExpenseName] = useState("");
  const [description, setDescription] = useState("");
  const [expenseAmount, setExpenseAmount] = useState("");
  const [cam, setCam] = useState(null);
  const [gall, setGall] = useState(null);

  const deleteFromList = (index) => {
    const copyExpenses = JSON.parse(JSON.stringify(expensesPayloadData));
    copyExpenses.splice(index, 1);
    dispatch(expensesPayload(copyExpenses));
  };

  const openCamera = () => {
    setOpen(true);
  };

  const openGallery = () => {
    gallery.current.click();
  };

  const pickFromGallery = (e) => {
    let file = e.target.files[0];

    const formData = new FormData();
    formData.append("file", file);
    const httpConfig = {
      headers: {
        "content-type": "multipart/form-data",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    };
    const url = `${config.BASE_URL}/360-station/api/upload`;
    axios.post(url, formData, httpConfig).then((data) => {
      setGall(data.data.path);
    });
  };

  function removeSpecialCharacters(str) {
    return str.replace(/[^0-9.]/g, "");
  }

  const addDetailsToList = () => {
    if (oneStationData === null)
      return swal("Warning!", "please select station", "info");
    if (expenseName === "")
      return swal("Warning!", "Expense name field should not be empty", "info");
    if (description === "")
      return swal("Warning!", "Description field should not be empty", "info");
    if (expenseAmount === "")
      return swal(
        "Warning!",
        "Expense amount field should not be empty",
        "info"
      );
    if (isNaN(Number(expenseAmount)))
      return swal(
        "Warning!",
        "Amount field is not a number, remove characters like comma",
        "info"
      );

    const getImage = () => {
      if (gall === null && cam === null) return "null";
      if (gall === null) return cam;
      if (cam === null) return gall;
    };

    const payload = {
      dateCreated: "none",
      expenseName: reg ? "Regulatory payment" : expenseName,
      description: description,
      expenseAmount: expenseAmount,
      attachApproval: getImage(),
      outletID: oneStationData?._id,
      organizationID: oneStationData?.organisation,
      createdAt: mainDate,
      updatedAt: mainDate,
    };

    const copyExpenses = JSON.parse(JSON.stringify(expensesPayloadData));
    copyExpenses.push(payload);
    dispatch(expensesPayload(copyExpenses));

    setExpenseAmount("");
    setDescription("");
    setExpenseName("");
    setCam(null);
    setGall(null);
  };

  const handleChange = (e) => {
    setReg(e.target.checked);
  };

  return (
    <div
      style={{
        width: "98%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}>
      <ReactCamera open={open} close={setOpen} setDataUri={setCam} />

      <div className="lpo-body">
        <div className="lpo-left">
          <div style={checkIt}>
            <input
              onChange={handleChange}
              type={"checkbox"}
              style={{ width: "20px", height: "20px", marginRight: "10px" }}
            />
            <span style={{ fontSize: "14px", fontWeight: "bold" }}>
              Regulatory Payment
            </span>
          </div>

          <div className="single-form">
            <div className="input-d">
              <span>Expense Name</span>
              <input
                style={{ width: "98%" }}
                value={expenseName}
                onChange={(e) => setExpenseName(e.target.value)}
                className="lpo-inputs"
                type={"text"}
              />
            </div>
          </div>

          <div className="single-form">
            <div className="input-d">
              <span>Description</span>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                style={{ width: "98%", height: "100px" }}
                className="lpo-inputs"
                type={"text"}>
                {" "}
              </textarea>
            </div>
          </div>

          <div className="single-form">
            <div className="input-d">
              <span>Expense Amount</span>
              <input
                style={{ width: "98%" }}
                value={expenseAmount}
                onChange={(e) =>
                  setExpenseAmount(removeSpecialCharacters(e.target.value))
                }
                className="lpo-inputs"
                type={"text"}
              />
            </div>
          </div>

          <div style={{ marginTop: "40px" }} className="double-form">
            <div className="input-d">
              <Button
                variant="contained"
                onClick={openCamera}
                sx={{
                  width: "100%",
                  height: "35px",
                  background: "#216DB2",
                  fontSize: "13px",
                  borderRadius: "5px",
                  textTransform: "capitalize",
                  "&:hover": {
                    backgroundColor: "#216DB2",
                  },
                }}>
                <img
                  style={{ width: "22px", height: "18px", marginRight: "10px" }}
                  src={photo}
                  alt="icon"
                />
                <div>
                  {typeof cam === "string" ? (
                    "Image taken"
                  ) : (
                    <span>Take photo</span>
                  )}
                </div>
              </Button>
            </div>

            <div className="input-d">
              <Button
                onClick={openGallery}
                variant="contained"
                sx={{
                  width: "100%",
                  height: "35px",
                  background: "#087B36",
                  fontSize: "13px",
                  borderRadius: "5px",
                  textTransform: "capitalize",
                  "&:hover": {
                    backgroundColor: "#087B36",
                  },
                }}>
                <img
                  style={{ width: "22px", height: "18px", marginRight: "10px" }}
                  src={upload}
                  alt="icon"
                />
                <div>
                  {typeof gall === "string" ? (
                    "File uploaded"
                  ) : (
                    <span>Upload</span>
                  )}
                </div>
              </Button>
            </div>
          </div>

          <div style={add}>
            <Button
              sx={{
                width: "180px",
                height: "30px",
                background: "#427BBE",
                borderRadius: "3px",
                fontSize: "11px",
                marginBottom: "20px",
                "&:hover": {
                  backgroundColor: "#427BBE",
                },
              }}
              onClick={addDetailsToList}
              variant="contained">
              <AddIcon sx={{ marginRight: "10px" }} /> Add to List
            </Button>
            <input
              onChange={pickFromGallery}
              ref={gallery}
              style={{ visibility: "hidden" }}
              type={"file"}
            />
          </div>
        </div>

        <div className="lpo-right">
          <div className="table-head">
            <div className="col">S/N</div>
            <div className="col">Expense Name</div>
            <div className="col">Amount</div>
            <div className="col">Action</div>
          </div>

          {expensesPayloadData.length === 0 ? (
            <div style={{ marginTop: "10px" }}>No data</div>
          ) : (
            expensesPayloadData.map((data, index) => {
              return (
                <div
                  key={index}
                  style={{ background: "#fff", marginTop: "5px" }}
                  className="table-head">
                  <div style={{ color: "#000" }} className="col">
                    {index + 1}
                  </div>
                  <div style={{ color: "#000" }} className="col">
                    {data?.expenseName}
                  </div>
                  <div style={{ color: "#000" }} className="col">
                    {data?.expenseAmount}
                  </div>
                  <div style={{ color: "#000" }} className="col">
                    <img
                      onClick={() => {
                        deleteFromList(index);
                      }}
                      style={{ width: "22px", height: "22px" }}
                      src={hr8}
                      alt="icon"
                    />
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

const checkIt = {
  width: "100%",
  display: "flex",
  flexDirection: "row",
  justifyContent: "flex-start",
  alignItems: "center",
};

const add = {
  width: "100%",
  display: "flex",
  flexDirection: "row",
  justifyContent: "flex-start",
  marginTop: "30px",
};

export default ExpenseComponents;
