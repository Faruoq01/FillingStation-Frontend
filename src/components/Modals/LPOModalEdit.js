import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import close from "../../assets/close.png";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import { ThreeDots } from "react-loader-spinner";
import swal from "sweetalert";
import "../../styles/lpo.scss";
import Radio from "@mui/material/Radio";

const LPOModalEdit = (props) => {
  const { singleLPO } = useSelector((state) => state.lpo);
  const [productType, setProductType] = useState("Weekly");
  const [loading, setLoading] = useState(false);
  const user = useSelector((state) => state.auth.user);

  const [companyName, setCompanyName] = useState(singleLPO.companyName);
  const [address, setAddress] = useState(singleLPO?.address ?? "");
  const [personOfContact, setPersonOfContact] = useState(
    singleLPO?.personOfContact ?? ""
  );
  const [PMS, setPMS] = useState(singleLPO?.PMS ?? "");
  const [AGO, setAGO] = useState(singleLPO?.AGO ?? "");
  const [DPK, setDPK] = useState(singleLPO?.DPK ?? "");
  const [PMSRate, setPMSRate] = useState(singleLPO?.PMSRate);
  const [AGORate, setAGORate] = useState(singleLPO?.AGORate);
  const [DPKRate, setDPKRate] = useState(singleLPO?.DPKRate ?? "");
  const [contactPhone, setContactPhone] = useState(
    singleLPO?.contactPhone ?? ""
  );
  const [loader, setLoader] = useState(false);

  const handleClose = () => props.close(false);

  const resolveUserID = () => {
    if (user.userType === "superAdmin") {
      return { id: user._id };
    } else {
      return { id: user.organisationID };
    }
  };

  useEffect(() => {
    console.log("==============peret====================");
    console.log(singleLPO.DPKRate);
    console.log("==================================");
  }, [singleLPO]);

  const submit = () => {
    if (companyName === "")
      return swal("Warning!", "Company name field cannot be empty", "info");
    if (address === "")
      return swal("Warning!", "Address field cannot be empty", "info");
    if (personOfContact === "")
      return swal("Warning!", "Contact field cannot be empty", "info");
    if (PMS === "")
      return swal("Warning!", "PMS field cannot be empty", "info");
    if (AGO === "")
      return swal("Warning!", "AGO field cannot be empty", "info");
    if (DPK === "")
      return swal("Warning!", "DPK field cannot be empty", "info");
    if (PMSRate === "")
      return swal("Warning!", "PMS rate field cannot be empty", "info");
    if (AGORate === "")
      return swal("Warning!", "AGO rate field cannot be empty", "info");
    if (DPKRate === "")
      return swal("Warning!", "DPK rate field cannot be empty", "info");
    if (contactPhone === "")
      return swal("Warning!", "Contact phone field cannot be empty", "info");
    setLoader(true);

    if (isNaN(Number(PMS)))
      return swal("Warning!", "PMS limit field is not a number", "info");
    if (isNaN(Number(AGO)))
      return swal("Warning!", "AGO limit field is not a number", "info");
    if (isNaN(Number(DPK)))
      return swal("Warning!", "DPK limit field is not a number", "info");
    if (isNaN(Number(PMSRate)))
      return swal("Warning!", "PMS rate field is not a number", "info");
    if (isNaN(Number(AGORate)))
      return swal("Warning!", "AGO rate field is not a number", "info");
    if (isNaN(Number(DPKRate)))
      return swal("Warning!", "DPK rate field is not a number", "info");

    setLoading(true);

    const payload = {
      companyName: companyName,
      address: address,
      personOfContact: personOfContact,
      contactPhone: contactPhone,
      PMS: PMS,
      AGO: AGO,
      DPK: DPK,
      PMSRate: PMSRate,
      AGORate: AGORate,
      DPKRate: DPKRate,
      paymentStructure: productType,
      organizationID: resolveUserID().id,
    };

    // LPOService.createLPO(payload)
    //   .then((data) => {
    //     swal("Success", "LPO created successfully!", "success");
    //   })
    //   .then(() => {
    // setLoading(false);
    // setLoader(false);
    // props.refresh();
    // handleClose();
    //   });
    setTimeout(() => {
      setLoading(false);
      setLoader(false);
      props.refresh();
      handleClose();
    }, 2000);
  };

  const setFormState = (setState) => (e) => {
    setState(e.target.value);
  };

  return (
    <Modal
      open={props.open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
    >
      <div className="modalContainer2">
        <div className="inner">
          <div className="head">
            <div className="head-text">Edit LPO Company</div>
            <img
              onClick={handleClose}
              style={{ width: "18px", height: "18px" }}
              src={close}
              alt={"icon"}
            />
          </div>

          <div className="middleDiv" style={inner}>
            <div className="inputs">
              <div className="head-text2">Company Name</div>
              <input
                value={companyName}
                style={{
                  width: "96%",
                  height: "35px",
                  marginTop: "5px",
                  background: "#EEF2F1",
                  border: "1px solid #777777",
                  fontSize: "12px",
                  outline: "none",
                  paddingLeft: "5px",
                }}
                placeholder=""
                onChange={setFormState(setCompanyName)}
              />
            </div>

            <div className="inputs">
              <div className="head-text2">Address</div>
              <input
                value={address}
                style={{
                  width: "96%",
                  height: "35px",
                  marginTop: "5px",
                  background: "#EEF2F1",
                  border: "1px solid #777777",
                  fontSize: "12px",
                  outline: "none",
                  paddingLeft: "5px",
                }}
                placeholder=""
                onChange={setFormState(setAddress)}
              />
            </div>

            <div className="inputs">
              <div className="head-text2">Person of Contact</div>
              <input
                value={personOfContact}
                style={{
                  width: "96%",
                  height: "35px",
                  marginTop: "5px",
                  background: "#EEF2F1",
                  border: "1px solid #777777",
                  fontSize: "12px",
                  outline: "none",
                  paddingLeft: "5px",
                }}
                placeholder=""
                onChange={setFormState(setPersonOfContact)}
              />
            </div>

            <div className="inputs">
              <div className="head-text2">Contact phone</div>
              <input
                value={contactPhone}
                style={{
                  width: "96%",
                  height: "35px",
                  marginTop: "5px",
                  background: "#EEF2F1",
                  border: "1px solid #777777",
                  fontSize: "12px",
                  outline: "none",
                  paddingLeft: "5px",
                }}
                placeholder=""
                type="text"
                onChange={setFormState(setContactPhone)}
              />
            </div>

            <div className="inputs">
              <div className="head-text2">PMS Limit (Litres)</div>
              <input
                value={PMS}
                style={{
                  width: "96%",
                  height: "35px",
                  marginTop: "5px",
                  background: "#EEF2F1",
                  border: "1px solid #777777",
                  fontSize: "12px",
                  outline: "none",
                  paddingLeft: "5px",
                }}
                placeholder=""
                type="text"
                onChange={setFormState(setPMS)}
              />
            </div>

            <div className="inputs">
              <div className="head-text2">AGO Limit (Litres)</div>
              <input
                value={AGO}
                style={{
                  width: "96%",
                  height: "35px",
                  marginTop: "5px",
                  background: "#EEF2F1",
                  border: "1px solid #777777",
                  fontSize: "12px",
                  outline: "none",
                  paddingLeft: "5px",
                }}
                placeholder=""
                type="text"
                onChange={setFormState(setAGO)}
              />
            </div>

            <div className="inputs">
              <div className="head-text2">DPK Limit (Litres)</div>
              <input
                value={DPK}
                style={{
                  width: "96%",
                  height: "35px",
                  marginTop: "5px",
                  background: "#EEF2F1",
                  border: "1px solid #777777",
                  fontSize: "12px",
                  outline: "none",
                  paddingLeft: "5px",
                }}
                placeholder=""
                type="text"
                onChange={setFormState(setDPK)}
              />
            </div>

            <div className="inputs">
              <div className="head-text2">PMS Rate (amount)</div>
              <input
                value={PMSRate}
                style={{
                  width: "96%",
                  height: "35px",
                  marginTop: "5px",
                  background: "#EEF2F1",
                  border: "1px solid #777777",
                  fontSize: "12px",
                  outline: "none",
                  paddingLeft: "5px",
                }}
                placeholder=""
                type="text"
                onChange={setFormState(setPMSRate)}
              />
            </div>

            <div className="inputs">
              <div className="head-text2">AGO Rate(amount)</div>
              <input
                value={AGORate}
                style={{
                  width: "96%",
                  height: "35px",
                  marginTop: "5px",
                  background: "#EEF2F1",
                  border: "1px solid #777777",
                  fontSize: "12px",
                  outline: "none",
                  paddingLeft: "5px",
                }}
                placeholder=""
                type="text"
                onChange={setFormState(setAGORate)}
              />
            </div>

            <div className="inputs">
              <div className="head-text2">DPK Rate (amount)</div>
              <input
                value={DPKRate}
                style={{
                  width: "96%",
                  height: "35px",
                  marginTop: "5px",
                  background: "#EEF2F1",
                  border: "1px solid #777777",
                  fontSize: "12px",
                  outline: "none",
                  paddingLeft: "5px",
                }}
                placeholder=""
                type="text"
                onChange={setFormState(setDPKRate)}
              />
            </div>

            <div className="inputs">
              <div className="head-text2">Payment structure</div>
              <div className="radio">
                <div className="rad-item">
                  <Radio
                    onClick={() => {
                      setProductType("Weekly");
                    }}
                    checked={productType === "Weekly" ? true : false}
                  />
                  <div className="head-text2" style={{ marginRight: "5px" }}>
                    Weekly
                  </div>
                </div>
                <div className="rad-item">
                  <Radio
                    onClick={() => {
                      setProductType("Monthly");
                    }}
                    checked={productType === "Monthly" ? true : false}
                  />
                  <div className="head-text2" style={{ marginRight: "5px" }}>
                    Monthly
                  </div>
                </div>
                <div className="rad-item">
                  <Radio
                    onClick={() => {
                      setProductType("Annually");
                    }}
                    checked={productType === "Annually" ? true : false}
                  />
                  <div className="head-text2" style={{ marginRight: "5px" }}>
                    Yearly
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div style={{ marginTop: "10px", height: "30px" }} className="butt">
            <Button
              disabled={loader}
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
              variant="contained"
            >
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
  height: "500px",
  overflowY: "scroll",
};

export default LPOModalEdit;
