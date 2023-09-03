import React, { useCallback, useEffect, useState } from "react";
import "../../styles/settings.scss";
import rightArrow from "../../assets/rightArrow.png";
import OutlinedInput from "@mui/material/OutlinedInput";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import { useDispatch, useSelector } from "react-redux";
import { updateUser } from "../../storage/auth";
import swal from "sweetalert";
import OutletService from "../../services/outletService";
import { adminOutlet, getAllStations } from "../../storage/outlet";
import { ThreeDots } from "react-loader-spinner";
import UserService from "../../services/user";
import OutletInfo from "../Settings/OutletInfo";
import Appearances from "../Settings/Appearance";
import Logo from "../Settings/Logo";
import Permissions from "../Settings/Permission";
import PermissionList from "../Settings/PermissionList";
import { logout } from "../../storage/logout";
import HistoryPage from "./History";
import { useNavigate } from "react-router-dom";

const Password = () => {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loadingSpinner, setLoadingSpinner] = useState(false);

  const changePassowrd = () => {
    if (password === "")
      return swal("Warning!", "Password field cannot be empty", "info");
    if (confirmPassword === "")
      return swal("Warning!", "Confirm password field cannot be empty", "info");
    if (confirmPassword !== password)
      return swal("Warning!", "Password did not match", "info");
    setLoadingSpinner(true);

    const payload = {
      id: user._id,
      password: password,
    };

    UserService.updateUserDarkMode(payload)
      .then((data) => {
        return data;
      })
      .then((data) => {
        UserService.getOneUser({ id: data.user._id }).then((data) => {
          localStorage.setItem("user", JSON.stringify(data.user));
          dispatch(updateUser(data.user));
          setLoadingSpinner(false);
          setPassword("");
          setConfirmPassword("");
          swal("Success!", "Password reset successfully!", "info");
        });
      });
  };

  return (
    <div className="appearance">
      <div style={{ width: "200px", marginTop: "10px" }} className="app">
        <div className="head">Change Password</div>
      </div>
      <div className="details">
        <div className="text-group">
          <div className="form-text">New Password</div>
          <OutlinedInput
            sx={{
              width: "100%",
              height: "35px",
              marginTop: "5px",
              background: "#EEF2F1",
              borderRadius: "0px",
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                border: "1px solid #777777",
              },
            }}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder=""
          />
        </div>

        <div style={{ marginTop: "20px" }} className="text-group">
          <div className="form-text">Re-type New Password</div>
          <OutlinedInput
            sx={{
              width: "100%",
              height: "35px",
              marginTop: "5px",
              background: "#EEF2F1",
              borderRadius: "0px",
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                border: "1px solid #777777",
              },
            }}
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder=""
          />
        </div>

        <div style={{ marginTop: "20px" }} className="text-group">
          <Button
            variant="contained"
            sx={{
              width: "100%",
              height: "30px",
              background: "#054834",
              fontSize: "11px",
              marginTop: "20px",
              marginBottom: "20px",
              borderRadius: "0px",
              textTransform: "capitalize",
              "&:hover": {
                backgroundColor: "#054834",
              },
            }}
            onClick={changePassowrd}>
            Save Changes
          </Button>
        </div>

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
  );
};

const Email = () => {
  const [email, setEmail] = useState("");
  const user = useSelector((state) => state.auth.user);
  const [loadingSpinner, setLoadingSpinner] = useState(false);
  const dispatch = useDispatch();

  const changeEmail = () => {
    if (email === "")
      return swal("Warning!", "Email field cannot be empty", "info");
    if (!email.includes("@"))
      return swal("Warning!", "Please put a valid email", "info");
    if (!email.includes("."))
      return swal("Warning!", "Please put a valid email", "info");
    setLoadingSpinner(true);

    const payload = {
      id: user._id,
      email: email,
    };

    UserService.updateUserDarkMode(payload)
      .then((data) => {
        return data;
      })
      .then((data) => {
        UserService.getOneUser({ id: data.user._id }).then((data) => {
          localStorage.setItem("user", JSON.stringify(data.user));
          dispatch(updateUser(data.user));
          setLoadingSpinner(false);
          setEmail("");
          swal("Success!", "Email reset successfully!", "info");
        });
      });
  };

  return (
    <div className="appearance">
      <div style={{ width: "200px", marginTop: "10px" }} className="app">
        <div className="head">Change Email</div>
      </div>
      <div className="details">
        <div className="text-group">
          <div className="form-text">Email</div>
          <OutlinedInput
            sx={{
              width: "100%",
              height: "35px",
              marginTop: "5px",
              fontSize: "12px",
              background: "#EEF2F1",
              borderRadius: "0px",
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                border: "1px solid #777777",
              },
            }}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder=""
          />
        </div>

        <div style={{ marginTop: "20px" }} className="text-group">
          <Button
            variant="contained"
            sx={{
              width: "100%",
              height: "30px",
              background: "#054834",
              fontSize: "11px",
              marginTop: "20px",
              marginBottom: "20px",
              borderRadius: "0px",
              textTransform: "capitalize",
              "&:hover": {
                backgroundColor: "#054834",
              },
            }}
            onClick={changeEmail}>
            Save
          </Button>
        </div>
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
  );
};

const DeleteOutlet = (props) => {
  const oneStation = useSelector((state) => state.outlet.adminOutlet);
  const [loadingSpinner, setLoadingSpinner] = useState(false);

  const deleteStation = () => {
    if (oneStation === null)
      return swal("Warning!", "Please select a station", "info");

    setLoadingSpinner(true);

    const payload = {
      id: oneStation._id,
    };

    OutletService.deleteOutletStation(payload)
      .then((data) => {
        swal("Success!", "Outlet deleted successfully!", "info");
      })
      .then((data) => {
        setLoadingSpinner(false);
        props.refresh();
      });
  };

  return (
    <div className="appearance">
      <div style={{ width: "200px", marginTop: "10px" }} className="app">
        <div className="head">Delete Outlet</div>
      </div>
      <div className="details">
        <div className="text-group">
          <div style={{ fontWeight: "bold", fontSize: "12px" }}>Notice</div>
          <div
            style={{
              fontSize: "12px",
              marginTop: "10px",
              textAlign: "left",
            }}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Posuere
          </div>
        </div>

        <div style={{ marginTop: "20px" }} className="text-group">
          <div className="form-text">Why do you want to delete outlets?</div>
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
            disabled={true}
            value={
              oneStation === null ? "Select station" : oneStation?.outletName
            }
            placeholder=""
          />
        </div>

        <div style={{ marginTop: "20px" }} className="text-group">
          <Button
            variant="contained"
            sx={{
              width: "100%",
              height: "30px",
              background: "#054834",
              fontSize: "11px",
              marginTop: "20px",
              marginBottom: "20px",
              borderRadius: "0px",
              "&:hover": {
                backgroundColor: "#054834",
              },
            }}
            onClick={deleteStation}>
            Save
          </Button>
        </div>
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
  );
};

const Settings = (props) => {
  const [nav, setNav] = useState(0);
  const [defaultState, setDefault] = useState(0);
  const [actionState, setActionState] = useState(10);
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const allOutlets = useSelector((state) => state.outlet.allOutlets);
  const navigate = useNavigate();

  const logouts = () => {
    swal({
      title: "Alert!",
      text: "Are you sure you want to logout?",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        logout();
        navigate("login");
      }
    });
  };

  const resolveUserID = () => {
    if (user.userType === "superAdmin") {
      return { id: user._id };
    } else {
      return { id: user.organisationID };
    }
  };

  const getPerm = (e) => {
    if (user.userType === "superAdmin") {
      return true;
    }
    return user.permission?.settings[e];
  };

  const getStationData = useCallback(() => {
    const payload = {
      organisation: resolveUserID().id,
    };

    OutletService.getAllOutletStations(payload).then((data) => {
      dispatch(getAllStations(data.station));
      dispatch(adminOutlet(null));
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user._id, user.outletID, dispatch]);

  useEffect(() => {
    getStationData();
  }, [getStationData]);

  const changeMenu = (index, item) => {
    if (!getPerm("1") && item === null)
      return swal("Warning!", "Permission denied", "info");
    setDefault(index);
    dispatch(adminOutlet(item));
  };

  const navigateAround = (data) => {
    if (nav === 0 && !getPerm("2"))
      return swal("Warning!", "Permission denied", "info");
    if (nav === 1 && !getPerm("3"))
      return swal("Warning!", "Permission denied", "info");
    if (nav === 2 && !getPerm("4"))
      return swal("Warning!", "Permission denied", "info");
    if (nav === 3 && !getPerm("5"))
      return swal("Warning!", "Permission denied", "info");
    if (nav === 4 && !getPerm("6"))
      return swal("Warning!", "Permission denied", "info");
    if (nav === 5 && !getPerm("7"))
      return swal("Warning!", "Permission denied", "info");
    if (nav === 6 && !getPerm("8"))
      return swal("Warning!", "Permission denied", "info");
    setNav(data);
    setActionState(data);
  };

  return (
    <div
      style={{ marginTop: "50px" }}
      data-aos="zoom-in-down"
      className="settingsContainer">
      <div className="action">
        <Select
          labelId="demo-select-small"
          id="demo-select-small"
          value={actionState}
          sx={mobileSelect}>
          <MenuItem value={10}>Action</MenuItem>
          <MenuItem
            onClick={() => {
              navigateAround(0);
            }}
            value={0}>
            Outlet Information
          </MenuItem>
          <MenuItem
            onClick={() => {
              navigateAround(1);
            }}
            value={1}>
            Permission
          </MenuItem>
          <MenuItem
            onClick={() => {
              navigateAround(2);
            }}
            value={2}>
            History
          </MenuItem>
          <MenuItem
            onClick={() => {
              navigateAround(3);
            }}
            value={3}>
            Appearances
          </MenuItem>
          <MenuItem
            onClick={() => {
              navigateAround(4);
            }}
            value={4}>
            Logo (Branding)
          </MenuItem>
          <MenuItem
            onClick={() => {
              navigateAround(5);
            }}
            value={5}>
            Change Password
          </MenuItem>
          <MenuItem
            onClick={() => {
              navigateAround(6);
            }}
            value={6}>
            Change Email
          </MenuItem>
          <MenuItem
            onClick={() => {
              navigateAround(7);
            }}
            value={7}>
            Delete Outlet
          </MenuItem>
          <MenuItem onClick={logouts} value={8}>
            Logout
          </MenuItem>
        </Select>
      </div>
      <div className="inner-container">
        <div className="leftSettings">
          <div className="linspace">
            <div
              onClick={() => {
                navigateAround(0);
              }}
              className="accord">
              <div style={nav === 0 ? active : inActive}>
                Outlet Information
              </div>
              <img
                style={{ width: "7px", height: "13px" }}
                src={rightArrow}
                alt="icon"
              />
            </div>
            <div
              onClick={() => {
                navigateAround(1);
              }}
              className="accord">
              <div style={nav === 1 ? active : inActive}>Permission</div>
              <img
                style={{ width: "7px", height: "13px" }}
                src={rightArrow}
                alt="icon"
              />
            </div>
            <div
              onClick={() => {
                navigateAround(2);
              }}
              className="accord">
              <div style={nav === 2 ? active : inActive}>Activity history</div>
              <img
                style={{ width: "7px", height: "13px" }}
                src={rightArrow}
                alt="icon"
              />
            </div>
            <div
              onClick={() => {
                navigateAround(3);
              }}
              className="accord">
              <div style={nav === 3 ? active : inActive} className="text">
                Appearances
              </div>
              <img
                style={{ width: "7px", height: "13px" }}
                src={rightArrow}
                alt="icon"
              />
            </div>
            <div
              onClick={() => {
                navigateAround(4);
              }}
              className="accord">
              <div style={nav === 4 ? active : inActive} className="text">
                Logo ( Branding )
              </div>
              <img
                style={{ width: "7px", height: "13px" }}
                src={rightArrow}
                alt="icon"
              />
            </div>
            <div
              onClick={() => {
                navigateAround(5);
              }}
              className="accord">
              <div style={nav === 5 ? active : inActive} className="text">
                Change Password
              </div>
              <img
                style={{ width: "7px", height: "13px" }}
                src={rightArrow}
                alt="icon"
              />
            </div>
            <div
              onClick={() => {
                navigateAround(6);
              }}
              className="accord">
              <div style={nav === 6 ? active : inActive} className="text">
                Change Email
              </div>
              <img
                style={{ width: "7px", height: "13px" }}
                src={rightArrow}
                alt="icon"
              />
            </div>
            <div
              onClick={() => {
                navigateAround(7);
              }}
              className="accord">
              <div style={nav === 7 ? active : inActive} className="text">
                Delete Outlets
              </div>
              <img
                style={{ width: "7px", height: "13px" }}
                src={rightArrow}
                alt="icon"
              />
            </div>
            <div onClick={logouts} className="accord">
              <div style={{ color: "#1F1F1F" }} className="text">
                Logout
              </div>
              <img
                style={{ width: "7px", height: "13px" }}
                src={rightArrow}
                alt="icon"
              />
            </div>
          </div>
        </div>
        <div className="rightSettings">
          <div className="inner">
            {nav === 1 || nav === 7 || (
              <div style={contain}>
                <div className="second-select">
                  {
                    <Select
                      labelId="demo-select-small"
                      id="demo-select-small"
                      value={defaultState}
                      sx={selectStyle2}>
                      <MenuItem style={menu} value={0}>
                        Select Station
                      </MenuItem>
                      {allOutlets.map((item, index) => {
                        return (
                          <MenuItem
                            key={index}
                            style={menu}
                            onClick={() => {
                              changeMenu(index + 1, item);
                            }}
                            value={index + 1}>
                            {item.outletName + ", " + item.alias}
                          </MenuItem>
                        );
                      })}
                    </Select>
                  }
                </div>
              </div>
            )}
            {nav === 0 && <OutletInfo refresh={getStationData} />}
            {nav === 1 && <Permissions nav={setNav} />}
            {nav === 2 && <HistoryPage />}
            {nav === 3 && <Appearances />}
            {nav === 4 && <Logo />}
            {nav === 5 && <Password />}
            {nav === 6 && <Email />}
            {nav === 7 && <DeleteOutlet refresh={getStationData} />}
            {nav === 8 && <PermissionList nav={setNav} />}
          </div>
        </div>
      </div>
    </div>
  );
};

const menu = {
  fontSize: "12px",
};

const active = {
  fontStyle: "normal",
  fontWeight: "700",
  fontSize: "12px",
  lineHeight: "150.4%",
  color: "#06805B",
};

const inActive = {
  fontStyle: "normal",
  fontWeight: "700",
  fontSize: "12px",
  lineHeight: "150.4%",
  color: "#1F1F1F",
};

const selectStyle2 = {
  minWidth: "160px",
  height: "30px",
  borderRadius: "0px",
  backgroundColor: "#06805B",
  color: "#fff",
  fontSize: "12px",
  outline: "none",
  marginBottom: "10px",
  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
    border: "1px solid #777777",
  },
};

const contain = {
  width: "100%",
  display: "flex",
  flexDirection: "row",
  justifyContent: "flex-start",
};

const mobileSelect = {
  backgroundColor: "#06805B",
  color: "#fff",
  height: "30px",
  width: "150px",
  fontSize: "12px",
  marginRight: "20px",
  borderRadius: "0px",
  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
    border: "1px solid #777777",
  },
};

export default Settings;
