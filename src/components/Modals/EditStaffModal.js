import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import close from "../../assets/close.png";
import Button from "@mui/material/Button";
import OutlinedInput from "@mui/material/OutlinedInput";
import Modal from "@mui/material/Modal";
import { ThreeDots } from "react-loader-spinner";
import swal from "sweetalert";
import "../../styles/lpo.scss";
import "../../styles/lpo.scss";
import Radio from "@mui/material/Radio";
import "react-html5-camera-photo/build/css/index.css";
import AdminUserService from "../../services/adminUsers";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";

const EditStaffModal = (props) => {
  const singleEmployeeDetails = useSelector(
    (state) => state?.staffUserReducer?.singleEmployee
  );
  const [loading, setLoading] = useState(false);
  const user = useSelector((state) => state.authReducer.user);

  const oneStationData = useSelector(
    (state) => state.outletReducer.adminOutlet
  );

  const [staffName, setStaffName] = useState(
    singleEmployeeDetails.staffName ?? ""
  );
  const [defaultState, setDefaultState] = useState(0);
  const [sex, setSex] = useState(singleEmployeeDetails?.sex);
  const [email, setEmail] = useState(singleEmployeeDetails?.email);
  const [phone, setPhone] = useState(singleEmployeeDetails?.phone);
  const [address, setAddress] = useState(singleEmployeeDetails.address ?? "");
  const [state, setState] = useState(singleEmployeeDetails.state ?? "");
  const [accountNumber, setAccountNumber] = useState(
    singleEmployeeDetails.accountNumber ?? ""
  );
  const [bankName, setBankName] = useState(
    singleEmployeeDetails.bankName ?? ""
  );
  const [dateEmployed, setDateEmployed] = useState(
    singleEmployeeDetails.dateEmployed ?? ""
  );
  const [dateOfBirth, setDateOfBirth] = useState(
    singleEmployeeDetails.dateOfBirth ?? ""
  );
  const [role, setRole] = useState(singleEmployeeDetails.role ?? "");
  const [jobTitle, setJobTitle] = useState(
    singleEmployeeDetails.jobTitle ?? ""
  );
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const resolveUserID = () => {
    if (user.userType === "superAdmin") {
      return { id: user._id };
    } else {
      return { id: user.organisationID };
    }
  };

  const changeMenu = (index, item) => {
    setDefaultState(index);
  };

  const handleClose = () => {
    props.close(false);
  };

  useEffect(() => {
    if (singleEmployeeDetails) {
      // setStopLoading(true)
    }
  }, [singleEmployeeDetails]);

  const submit = () => {
    return;
    if (oneStationData === null)
      return swal("Warning!", "Please create a station", "info");
    if (staffName === "")
      return swal("Warning!", "Staff name field cannot be empty", "info");
    if (sex === "")
      return swal("Warning!", "Sex field cannot be empty", "info");
    if (email === "")
      return swal("Warning!", "Email field cannot be empty", "info");
    if (phone === "")
      return swal("Warning!", "Phone field cannot be empty", "info");
    if (address === "")
      return swal("Warning!", "Address field cannot be empty", "info");
    if (state === "")
      return swal("Warning!", "State field cannot be empty", "info");
    if (accountNumber === "")
      return swal("Warning!", "Account No field cannot be empty", "info");
    if (bankName === "")
      return swal("Warning!", "Bank name field cannot be empty", "info");
    if (dateEmployed === "")
      return swal("Warning!", "Date employed field cannot be empty", "info");
    if (dateOfBirth === "")
      return swal("Warning!", "Date of birth field cannot be empty", "info");
    if (role === "")
      return swal("Warning!", "Role field cannot be empty", "info");
    if (jobTitle === "")
      return swal("Warning!", "Job title field cannot be empty", "info");
    if (password === "")
      return swal("Warning!", "Password field cannot be empty", "info");
    if (confirmPassword !== password)
      return swal("Warning!", "Password field did not match", "info");

    setLoading(true);
    const payload = {
      staffName: staffName,
      sex: sex,
      email: email,
      phone: phone,
      address: address,
      state: state,
      accountNumber: accountNumber,
      bankName: bankName,
      dateEmployed: dateEmployed,
      dateOfBirth: dateOfBirth,
      role: role,
      jobTitle: jobTitle,
      password: password,
      organisationID: resolveUserID().id,
      outletID: oneStationData._id,
    };

    AdminUserService.createStaffUsers(payload)
      .then((data) => {
        if (data.hasOwnProperty("message")) {
          swal("Error!", data.message, "error");
        } else {
          swal("Success!", "A new user created successfully!", "success");
        }
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
      sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
    >
      <div className="modalContainer2">
        <div className="inner">
          <div className="head">
            <div className="head-text">Admin Users</div>
            <img
              onClick={handleClose}
              style={{ width: "18px", height: "18px" }}
              src={close}
              alt={"icon"}
            />
          </div>

          <div className="middleDiv" style={inner}>
            <div className="inputs">
              <div className="head-text2">Staff Name</div>
              <OutlinedInput
                value={staffName}
                sx={{
                  width: "100%",
                  height: "35px",
                  marginTop: "5px",
                  background: "#EEF2F1",
                  border: "1px solid #777777",
                  fontSize: "12px",
                }}
                placeholder=""
                type="text"
                onChange={(e) => setStaffName(e.target.value)}
              />
            </div>

            <div className="inputs">
              <div className="head-text2">Outlet Name</div>
              <Select
                labelId="demo-select-small"
                id="demo-select-small"
                value={defaultState}
                sx={{
                  width: "100%",
                  height: "35px",
                  marginTop: "5px",
                  background: "#EEF2F1",
                  border: "1px solid #777777",
                  fontSize: "12px",
                }}
              >
                {props?.allOutlets?.map((item, index) => {
                  return (
                    <MenuItem
                      key={index}
                      style={menu}
                      onClick={() => {
                        changeMenu(index, item);
                      }}
                      value={index}
                    >
                      {item.outletName}
                    </MenuItem>
                  );
                })}
              </Select>
            </div>

            <div className="inputs">
              <div className="head-text2">Sex</div>
              <div className="radio">
                <div className="rad-item">
                  <Radio
                    onClick={() => {
                      setSex("Male");
                    }}
                    checked={sex === "Male" ? true : false}
                  />
                  <div className="head-text2" style={{ marginRight: "5px" }}>
                    Male
                  </div>
                </div>
                <div className="rad-item">
                  <Radio
                    onClick={() => {
                      setSex("Female");
                    }}
                    checked={sex === "Female" ? true : false}
                  />
                  <div className="head-text2" style={{ marginRight: "5px" }}>
                    Female
                  </div>
                </div>
              </div>
            </div>

            <div className="inputs">
              <div className="head-text2">Email</div>
              <OutlinedInput
                value={email}
                sx={{
                  width: "100%",
                  height: "35px",
                  marginTop: "5px",
                  background: "#EEF2F1",
                  border: "1px solid #777777",
                  fontSize: "12px",
                }}
                placeholder=""
                type="text"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="inputs">
              <div className="head-text2">Phone Number</div>
              <OutlinedInput
                value={phone}
                sx={{
                  width: "100%",
                  height: "35px",
                  marginTop: "5px",
                  background: "#EEF2F1",
                  border: "1px solid #777777",
                  fontSize: "12px",
                }}
                type="number"
                placeholder=""
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>

            <div className="inputs">
              <div className="head-text2">Home Address</div>
              <OutlinedInput
                value={address}
                sx={{
                  width: "100%",
                  height: "35px",
                  marginTop: "5px",
                  background: "#EEF2F1",
                  border: "1px solid #777777",
                  fontSize: "12px",
                }}
                placeholder=""
                type="text"
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>

            <div className="inputs">
              <div className="head-text2">State Of Origin</div>
              <OutlinedInput
                value={state}
                sx={{
                  width: "100%",
                  height: "35px",
                  marginTop: "5px",
                  background: "#EEF2F1",
                  border: "1px solid #777777",
                  fontSize: "12px",
                }}
                placeholder=""
                type="text"
                onChange={(e) => setState(e.target.value)}
              />
            </div>

            <div className="inputs">
              <div className="head-text2">Account Number</div>
              <OutlinedInput
                value={accountNumber}
                sx={{
                  width: "100%",
                  height: "35px",
                  marginTop: "5px",
                  background: "#EEF2F1",
                  border: "1px solid #777777",
                  fontSize: "12px",
                }}
                placeholder=""
                type="text"
                onChange={(e) => setAccountNumber(e.target.value)}
              />
            </div>

            <div className="inputs">
              <div className="head-text2">Bank Name</div>
              <OutlinedInput
                value={bankName}
                sx={{
                  width: "100%",
                  height: "35px",
                  marginTop: "5px",
                  background: "#EEF2F1",
                  border: "1px solid #777777",
                  fontSize: "12px",
                }}
                placeholder=""
                type="text"
                onChange={(e) => setBankName(e.target.value)}
              />
            </div>

            <div className="inputs">
              <div className="head-text2">Date Employed</div>
              <OutlinedInput
                value={dateEmployed}
                sx={{
                  width: "100%",
                  height: "35px",
                  marginTop: "5px",
                  background: "#EEF2F1",
                  border: "1px solid #777777",
                  fontSize: "12px",
                }}
                placeholder=""
                type="date"
                onChange={(e) => setDateEmployed(e.target.value)}
              />
            </div>

            <div className="inputs">
              <div className="head-text2">Date Of Birth</div>
              <OutlinedInput
                value={dateOfBirth}
                sx={{
                  width: "100%",
                  height: "35px",
                  marginTop: "5px",
                  background: "#EEF2F1",
                  border: "1px solid #777777",
                  fontSize: "12px",
                }}
                placeholder=""
                type="date"
                onChange={(e) => setDateOfBirth(e.target.value)}
              />
            </div>

            <div className="inputs">
              <div className="head-text2">Role</div>
              <OutlinedInput
                value={role}
                sx={{
                  width: "100%",
                  height: "35px",
                  marginTop: "5px",
                  background: "#EEF2F1",
                  border: "1px solid #777777",
                  fontSize: "12px",
                }}
                placeholder=""
                type="text"
                onChange={(e) => setRole(e.target.value)}
              />
            </div>

            <div className="inputs">
              <div className="head-text2">Job Title</div>
              <OutlinedInput
                value={jobTitle}
                sx={{
                  width: "100%",
                  height: "35px",
                  marginTop: "5px",
                  background: "#EEF2F1",
                  border: "1px solid #777777",
                  fontSize: "12px",
                }}
                placeholder=""
                type="text"
                onChange={(e) => setJobTitle(e.target.value)}
              />
            </div>

            {/* <div className="inputs">
              <div className="head-text2">Password</div>
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
                type="password"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div> */}

            {/* <div className="inputs">
              <div className="head-text2">Confirm Password</div>
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
                type="password"
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div> */}
          </div>

          <div style={{ marginTop: "10px" }} className="butt">
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
              variant="contained"
            >
              {" "}
              Add User
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

const menu = {
  fontSize: "14px",
};

export default EditStaffModal;
