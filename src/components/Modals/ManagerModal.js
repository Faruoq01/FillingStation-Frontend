import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import close from "../../assets/close.png";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import { ThreeDots } from "react-loader-spinner";
import swal from "sweetalert";
import "../../styles/lpo.scss";
import "../../styles/lpo.scss";
import Radio from "@mui/material/Radio";
import "react-html5-camera-photo/build/css/index.css";
import { MenuItem, Select } from "@mui/material";
import { adminOutlet } from "../../storage/outlet";
import AdminUserService from "../../services/adminUsers";
import { useEffect } from "react";
import ReactCamera from "./ReactCamera";
import UploadPhoto from "../common/uploadphoto";

const ManagerModal = (props) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const user = useSelector((state) => state.auth.user);
  const allOutlets = useSelector((state) => state.outlet.allOutlets);
  const oneStationData = useSelector((state) => state.outlet.adminOutlet);

  const [cam, setCam] = useState("null");
  const [gall, setGall] = useState("null");
  const [open, setOpen] = useState("");

  const [staffName, setStaffName] = useState("");
  const [sex, setSex] = useState("Male");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [state, setState] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [bankName, setBankName] = useState("");
  const [dateEmployed, setDateEmployed] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [role, setRole] = useState(["Admin", "Accountant", "Manager", "Staff"]);
  const [roleData, setRoleData] = useState("");
  const [alias, setAlias] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [defaultState, setDefault] = useState(0);
  const [roleState, setRoleState] = useState(0);
  const [loader, setLoader] = useState(false);
  const [salary, setSalary] = useState("");

  const handleClose = () => {
    props.close(false);
  };

  const resolveUserID = () => {
    if (user.userType === "superAdmin") {
      return { id: user._id };
    } else {
      return { id: user.organisationID };
    }
  };

  useEffect(() => {
    const extensions = [...new Set(props.roles.map((data) => data.role))];
    const existingRoles = [...role].concat(extensions);
    existingRoles.push("Others");
    setRole(existingRoles);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const submit = () => {
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
    if (salary === "")
      return swal("Warning!", "Salary field cannot be empty", "info");
    if (dateEmployed === "")
      return swal("Warning!", "Date employed field cannot be empty", "info");
    if (dateOfBirth === "")
      return swal("Warning!", "Date of birth field cannot be empty", "info");
    if (roleData === "")
      return swal("Warning!", "Role field cannot be empty", "info");
    if (alias === "")
      return swal("Warning!", "Alias field cannot be empty", "info");
    if (jobTitle === "")
      return swal("Warning!", "Job title field cannot be empty", "info");
    if (password === "")
      return swal("Warning!", "Password field cannot be empty", "info");
    if (confirmPassword !== password)
      return swal("Warning!", "Confirm password field cannot be empty", "info");
    if (cam === "null" && gall === "null")
      return swal("Warning!", "File upload cannot be empty", "info");

    setLoading(true);
    setLoader(true);
    const payload = {
      staffName: staffName,
      sex: sex,
      email: email,
      phone: phone,
      address: address,
      state: state,
      accountNumber: accountNumber,
      bankName: bankName,
      salary: salary,
      image: cam === "null" ? gall : cam,
      dateEmployed: dateEmployed,
      dateOfBirth: dateOfBirth,
      role: roleData,
      timezone: user.timezone,
      alias: alias,
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
        setLoader(false);
        props.refresh();

        setStaffName("");
        setSex("");
        setEmail("");
        setPhone("");
        setAddress("");
        setState("");
        setAccountNumber("");
        setBankName("");
        setSalary("");
        setDateEmployed("");
        setDateOfBirth("");
        setRoleState(0);
        setRoleData("");
        setAlias("");
        setJobTitle("");
        setDefault(0);
        handleClose();
      });
  };

  const changeMenu = (index, item) => {
    setDefault(index);
    setAlias(item.alias);
    dispatch(adminOutlet(item));
  };

  const changeRoleMenu = (index, data) => {
    setRoleState(index);

    if (roleState === 5) {
      setRoleData("");
    } else {
      setRoleData(data);
    }
  };

  return (
    <Modal
      open={props.open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
      <div className="modalContainer2">
        <ReactCamera open={open} close={setOpen} setDataUri={setCam} />
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
              <input
                style={{
                  width: "94%",
                  outline: "none",
                  paddingLeft: "10px",
                  height: "35px",
                  marginTop: "5px",
                  background: "#EEF2F1",
                  fontSize: "12px",
                  borderRadius: "0px",
                  border: "1px solid #777777",
                }}
                placeholder=""
                type="text"
                onChange={(e) => setStaffName(e.target.value)}
              />
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
              <input
                style={{
                  width: "94%",
                  outline: "none",
                  paddingLeft: "10px",
                  height: "35px",
                  marginTop: "5px",
                  background: "#EEF2F1",
                  fontSize: "12px",
                  borderRadius: "0px",
                  border: "1px solid #777777",
                }}
                placeholder=""
                type="text"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="inputs">
              <div className="head-text2">Phone Number</div>
              <input
                style={{
                  width: "94%",
                  outline: "none",
                  paddingLeft: "10px",
                  height: "35px",
                  marginTop: "5px",
                  background: "#EEF2F1",
                  fontSize: "12px",
                  borderRadius: "0px",
                  border: "1px solid #777777",
                }}
                type="number"
                placeholder=""
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
            <div className="inputs">
              <div className="head-text2">Home Address</div>
              <input
                style={{
                  width: "94%",
                  outline: "none",
                  paddingLeft: "10px",
                  height: "35px",
                  marginTop: "5px",
                  background: "#EEF2F1",
                  fontSize: "12px",
                  borderRadius: "0px",
                  border: "1px solid #777777",
                }}
                placeholder=""
                type="text"
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>
            <div style={{ marginTop: "15px" }} className="inputs">
              <div className="head-text2">Select Station</div>
              <Select
                labelId="demo-select-small"
                id="demo-select-small"
                value={defaultState}
                sx={{
                  width: "98%",
                  outline: "none",
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
                  Select Station
                </MenuItem>
                {allOutlets.map((item, index) => {
                  return (
                    <MenuItem
                      key={index}
                      onClick={() => {
                        changeMenu(index + 1, item);
                      }}
                      style={menu}
                      value={index + 1}>
                      {item.outletName + ", " + item.alias}
                    </MenuItem>
                  );
                })}
              </Select>
            </div>
            <div className="inputs">
              <div className="head-text2">Alias</div>
              <input
                disabled
                style={{
                  width: "94%",
                  outline: "none",
                  paddingLeft: "10px",
                  height: "35px",
                  marginTop: "5px",
                  background: "#EEF2F1",
                  fontSize: "12px",
                  borderRadius: "0px",
                  border: "1px solid #777777",
                }}
                placeholder=""
                type="text"
                value={alias}
                // onChange={e => setAlias(e.target.value)}
              />
            </div>
            <div className="inputs">
              <div className="head-text2">State Of Origin</div>
              <input
                style={{
                  width: "94%",
                  outline: "none",
                  paddingLeft: "10px",
                  height: "35px",
                  marginTop: "5px",
                  background: "#EEF2F1",
                  fontSize: "12px",
                  borderRadius: "0px",
                  border: "1px solid #777777",
                }}
                placeholder=""
                type="text"
                onChange={(e) => setState(e.target.value)}
              />
            </div>
            <div className="inputs">
              <div className="head-text2">Account Number</div>
              <input
                style={{
                  width: "94%",
                  outline: "none",
                  paddingLeft: "10px",
                  height: "35px",
                  marginTop: "5px",
                  background: "#EEF2F1",
                  fontSize: "12px",
                  borderRadius: "0px",
                  border: "1px solid #777777",
                }}
                placeholder=""
                type="text"
                onChange={(e) => setAccountNumber(e.target.value)}
              />
            </div>
            <div className="inputs">
              <div className="head-text2">Bank Name</div>
              <input
                style={{
                  width: "94%",
                  outline: "none",
                  paddingLeft: "10px",
                  height: "35px",
                  marginTop: "5px",
                  background: "#EEF2F1",
                  fontSize: "12px",
                  borderRadius: "0px",
                  border: "1px solid #777777",
                }}
                placeholder=""
                type="text"
                onChange={(e) => setBankName(e.target.value)}
              />
            </div>
            <div className="inputs">
              <div className="head-text2">Salary</div>
              <input
                style={{
                  width: "94%",
                  outline: "none",
                  paddingLeft: "10px",
                  height: "35px",
                  marginTop: "5px",
                  background: "#EEF2F1",
                  fontSize: "12px",
                  borderRadius: "0px",
                  border: "1px solid #777777",
                }}
                placeholder=""
                type="text"
                onChange={(e) => setSalary(e.target.value)}
              />
            </div>
            <div className="inputs">
              <div className="head-text2">Date Employed</div>
              <input
                style={{
                  width: "94%",
                  outline: "none",
                  paddingLeft: "10px",
                  height: "35px",
                  marginTop: "5px",
                  background: "#EEF2F1",
                  fontSize: "12px",
                  borderRadius: "0px",
                  border: "1px solid #777777",
                  userSelect: "none",
                }}
                placeholder=""
                type="date"
                onChange={(e) => setDateEmployed(e.target.value)}
              />
            </div>
            <div className="inputs">
              <div className="head-text2">Date Of Birth</div>
              <input
                style={{
                  width: "94%",
                  outline: "none",
                  paddingLeft: "10px",
                  height: "35px",
                  marginTop: "5px",
                  background: "#EEF2F1",
                  fontSize: "12px",
                  borderRadius: "0px",
                  border: "1px solid #777777",
                  userSelect: "none",
                }}
                placeholder=""
                type="date"
                onChange={(e) => setDateOfBirth(e.target.value)}
              />
            </div>
            <div style={{ marginTop: "15px" }} className="inputs">
              <div className="head-text2">Role</div>
              <Select
                labelId="demo-select-small"
                id="demo-select-small"
                value={roleState}
                sx={{
                  width: "98%",
                  outline: "none",
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
                  Select a designation
                </MenuItem>
                {role.map((item, index) => {
                  return (
                    <MenuItem
                      key={index}
                      onClick={() => {
                        changeRoleMenu(index + 1, item);
                      }}
                      style={menu}
                      value={index + 1}>
                      {item}
                    </MenuItem>
                  );
                })}
              </Select>
            </div>
            {roleState === 5 && (
              <div className="inputs">
                <div className="head-text2">Designation</div>
                <input
                  style={{
                    width: "94%",
                    outline: "none",
                    paddingLeft: "10px",
                    height: "35px",
                    marginTop: "5px",
                    background: "#EEF2F1",
                    fontSize: "12px",
                    borderRadius: "0px",
                    border: "1px solid #777777",
                  }}
                  placeholder=""
                  type="text"
                  onChange={(e) => setRoleData(e.target.value)}
                />
              </div>
            )}
            <div className="inputs">
              <div className="head-text2">Job Title</div>
              <input
                style={{
                  width: "94%",
                  outline: "none",
                  paddingLeft: "10px",
                  height: "35px",
                  marginTop: "5px",
                  background: "#EEF2F1",
                  fontSize: "12px",
                  borderRadius: "0px",
                  border: "1px solid #777777",
                }}
                placeholder=""
                type="text"
                onChange={(e) => setJobTitle(e.target.value)}
              />
            </div>
            <div className="inputs">
              <div className="head-text2">Password</div>
              <input
                style={{
                  width: "94%",
                  outline: "none",
                  paddingLeft: "10px",
                  height: "35px",
                  marginTop: "5px",
                  background: "#EEF2F1",
                  fontSize: "12px",
                  borderRadius: "0px",
                  border: "1px solid #777777",
                }}
                placeholder=""
                type="password"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="inputs">
              <div className="head-text2">Confirm Password</div>
              <input
                style={{
                  width: "94%",
                  outline: "none",
                  paddingLeft: "10px",
                  height: "35px",
                  marginTop: "5px",
                  background: "#EEF2F1",
                  fontSize: "12px",
                  borderRadius: "0px",
                  border: "1px solid #777777",
                }}
                placeholder=""
                type="password"
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
            <UploadPhoto setOpen={setOpen} setGall={setGall} cam={cam} />
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
              variant="contained">
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
  fontSize: "12px",
};

export default ManagerModal;
