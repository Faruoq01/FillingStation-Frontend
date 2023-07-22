import axios from "axios";
import { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import photo from "../../assets/photo.png";
import upload from "../../assets/upload.png";
import ReactCamera from "../Modals/ReactCamera";
import AddIcon from "@mui/icons-material/Add";
import hr8 from "../../assets/hr8.png";
import swal from "sweetalert";
import config from "../../constants";
import { updatePayload } from "../../storage/recordsales";
import "../../styles/lpoNew.scss";
import ApproximateDecimal from "../common/approx";
import { Button } from "@mui/material";

const PosPayments = (props) => {
  const dispatch = useDispatch();
  const gallery = useRef();
  const [open, setOpen] = useState(false);
  const oneStationData = useSelector((state) => state.outlet.adminOutlet);

  ///////////////////////////////////////////////////////////
  const records = useSelector((state) => state.recordsales.load);
  const selectedPumps = useSelector((state) => state.recordsales.selectedPumps);

  // payload data
  const [posName, setPosName] = useState("");
  const [terminalID, setTerminalID] = useState("");
  const [amountPaid, setAmountPaid] = useState("");
  const [paymentDate, setPaymentDate] = useState("");
  const [cam, setCam] = useState("null");
  const [gall, setGall] = useState("null");

  const deleteFromList = (index) => {
    const tankFromPayload = { ...records };
    tankFromPayload["6"].splice(index, 1);
    dispatch(updatePayload(tankFromPayload));
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

  const addDetailsToList = () => {
    if (oneStationData === null)
      return swal("Warning!", "please select station", "info");
    if (posName === "")
      return swal("Warning!", "Please add bank or pos name", "info");
    if (terminalID === "")
      return swal("Warning!", "Please add teller or terminal ID", "info");
    if (amountPaid === "")
      return swal("Warning!", "Amount field should not be empty", "info");
    if (paymentDate === "")
      return swal("Warning!", "Payment date field should not be empty", "info");
    if (isNaN(Number(amountPaid)))
      return swal(
        "Warning!",
        "Amount field is not a number, remove characters like comma",
        "info"
      );
    if (cam === "null" && gall === "null")
      return swal("Warning!", "Please add reciept", "info");

    const payload = {
      posName: posName,
      terminalID: terminalID,
      amountPaid: amountPaid,
      paymentDate: paymentDate,
      camera: cam,
      gallery: gall,
      outletID: oneStationData?._id,
      organizationID: oneStationData?.organisation,
    };

    const tankFromPayload = { ...records };
    tankFromPayload["6"].push(payload);
    dispatch(updatePayload(tankFromPayload));

    setPosName("");
    setTerminalID("");
    setAmountPaid("");
    setPaymentDate("");
    setCam("null");
    setGall("null");
  };

  const getPayments = () => {
    const bank = records["5"];
    const pos = records["6"];

    const totalExpenses = records["4"].reduce((accum, current) => {
      return Number(accum) + Number(current.expenseAmount);
    }, 0);

    const totalPOSPayment = pos.reduce((accum, current) => {
      return Number(accum) + Number(current.amountPaid);
    }, 0);

    const totalBankPayment = bank.reduce((accum, current) => {
      return Number(accum) + Number(current.amountPaid);
    }, 0);

    /*############################################
            Total sales
        ###############################################*/

    const totalPMS = selectedPumps
      .filter((data) => data.productType === "PMS")
      .reduce((accum, current) => {
        return (
          Number(accum) +
          Number(current.sales) * Number(oneStationData.PMSPrice)
        );
      }, 0);

    const totalAGO = selectedPumps
      .filter((data) => data.productType === "AGO")
      .reduce((accum, current) => {
        return (
          Number(accum) +
          Number(current.sales) * Number(oneStationData.AGOPrice)
        );
      }, 0);

    const totalDPK = selectedPumps
      .filter((data) => data.productType === "DPK")
      .reduce((accum, current) => {
        return (
          Number(accum) +
          Number(current.sales) * Number(oneStationData.DPKPrice)
        );
      }, 0);

    /*############################################
            Total lpo sales
        ###############################################*/

    const totalLpoPMS = records["3"]
      .filter((data) => data.productType === "PMS")
      .reduce((accum, current) => {
        return (
          Number(accum) + Number(current.lpoLitre) * Number(current.PMSRate)
        );
      }, 0);

    const totalLpoAGO = records["3"]
      .filter((data) => data.productType === "AGO")
      .reduce((accum, current) => {
        return (
          Number(accum) + Number(current.lpoLitre) * Number(current.AGORate)
        );
      }, 0);

    const totalLpoDPK = records["3"]
      .filter((data) => data.productType === "DPK")
      .reduce((accum, current) => {
        return (
          Number(accum) + Number(current.lpoLitre) * Number(current.DPKRate)
        );
      }, 0);

    /*############################################
            Return to tank
        ###############################################*/

    const pmsRT = records["2"]
      .filter((data) => data.productType === "PMS")
      .reduce((accum, current) => {
        return (
          Number(accum) +
          Number(current.RTlitre) * Number(oneStationData.PMSPrice)
        );
      }, 0);

    const agoRT = records["2"]
      .filter((data) => data.productType === "AGO")
      .reduce((accum, current) => {
        return (
          Number(accum) +
          Number(current.RTlitre) * Number(oneStationData.AGOPrice)
        );
      }, 0);

    const dpkRT = records["2"]
      .filter((data) => data.productType === "DPK")
      .reduce((accum, current) => {
        return (
          Number(accum) +
          Number(current.RTlitre) * Number(oneStationData.DPKPrice)
        );
      }, 0);

    const totalSales = totalPMS + totalAGO + totalDPK;
    const totalLpoSales = totalLpoPMS + totalLpoAGO + totalLpoDPK;
    const totalRT = pmsRT + agoRT + dpkRT;
    const netToBank = totalSales - totalLpoSales - totalRT - totalExpenses;
    const totalPayments = totalPOSPayment + totalBankPayment;

    const payment = {
      totalSales: totalSales - totalRT,
      salesAmount: totalSales - totalLpoSales - totalRT,
      netToBank: netToBank,
      outstanding: totalPayments - netToBank,
    };

    return payment;
  };

  function removeSpecialCharacters(str) {
    return str.replace(/[^0-9.]/g, "");
  }

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
          <div style={butt}>POS Payments</div>

          <div style={{ marginTop: "20px" }} className="double-form">
            <div className="input-d">
              <span>Pos Name</span>
              <input
                value={posName}
                onChange={(e) => setPosName(e.target.value)}
                className="lpo-inputs"
                type={"text"}
              />
            </div>

            <div className="input-d">
              <span>Terminal ID</span>
              <input
                value={terminalID}
                onChange={(e) => setTerminalID(e.target.value)}
                className="lpo-inputs"
                type={"text"}
              />
            </div>
          </div>

          <div className="single-form">
            <div className="input-d">
              <span>Amount Paid</span>
              <input
                value={amountPaid}
                onChange={(e) =>
                  setAmountPaid(removeSpecialCharacters(e.target.value))
                }
                className="lpo-inputs"
                type={"text"}
              />
            </div>
          </div>

          <div style={{ marginTop: "20px" }} className="double-form">
            <div className="input-d">
              <span>Net to bank</span>
              <input
                value={ApproximateDecimal(getPayments().netToBank)}
                disabled
                className="lpo-inputs"
                type={"text"}
              />
            </div>

            <div className="input-d">
              <span>Outstanding Balance</span>
              <input
                value={
                  getPayments().outstanding < 0
                    ? "-" + ApproximateDecimal(getPayments().outstanding)
                    : ApproximateDecimal(getPayments().outstanding)
                }
                disabled
                className="lpo-inputs"
                type={"text"}
              />
            </div>
          </div>

          <div className="single-form">
            <div className="input-d">
              <span>Payment Date</span>
              <input
                value={paymentDate}
                onChange={(e) => setPaymentDate(e.target.value)}
                className="lpo-inputs"
                type={"date"}
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
                  {cam !== "null" ? "Image taken" : <span>Take photo</span>}
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
                  {gall !== "null" ? "File uploaded" : <span>Upload</span>}
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
            <div className="col">POS</div>
            <div className="col">Date</div>
            <div className="col">Amount</div>
            <div className="col">Action</div>
          </div>

          {records["6"].length === 0 ? (
            <div style={{ marginTop: "10px" }}>No data</div>
          ) : (
            records["6"].map((data, index) => {
              return (
                <div
                  key={index}
                  style={{ background: "#fff", marginTop: "5px" }}
                  className="table-head">
                  <div style={{ color: "#000" }} className="col">
                    {index + 1}
                  </div>
                  <div style={{ color: "#000" }} className="col">
                    {data?.posName}
                  </div>
                  <div style={{ color: "#000" }} className="col">
                    {data?.paymentDate}
                  </div>
                  <div style={{ color: "#000" }} className="col">
                    {data?.amountPaid}
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

const add = {
  width: "100%",
  display: "flex",
  flexDirection: "row",
  justifyContent: "flex-start",
  marginTop: "30px",
};

const butt = {
  width: "100%",
  textAlign: "left",
  fontSize: "16px",
  fontColor: "green",
  fontWeight: "bolder",
};

export default PosPayments;
