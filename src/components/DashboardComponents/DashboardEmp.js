import React, { useState } from "react";
import "../../styles/payments.scss";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import avatar from "../../assets/avatar.png";
import OutlinedInput from "@mui/material/OutlinedInput";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { useCallback } from "react";
import APIs from "../../services/connections/api";
import { searchdashStaffs, setEmployeeList } from "../../storage/dashboard";
import { ThreeDots } from "react-loader-spinner";
import GenerateReports from "../Modals/reports";
import { PrintButton } from "../common/buttons";

const DashboardEmployee = () => {
  const [prints, setPrints] = useState(false);
  const user = useSelector((state) => state.auth.user);

  const employees = useSelector((state) => state.dashboard.employeeList);
  const dispatch = useDispatch();
  const oneStationData = useSelector((state) => state.outlet.adminOutlet);
  const [load, setLoad] = useState(false);

  const resolveUserID = () => {
    if (user.userType === "superAdmin") {
      return { id: user._id };
    } else {
      return { id: user.organisationID };
    }
  };

  const getEmployeeList = useCallback(() => {
    setLoad(true);
    const payload = {
      outletID: oneStationData === null ? "None" : oneStationData._id,
      organisationID: resolveUserID().id,
    };

    APIs.post("/dashboard/employee", payload)
      .then(({ data }) => {
        dispatch(setEmployeeList(data.employee));
      })
      .then(() => {
        setLoad(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    getEmployeeList();
  }, [getEmployeeList]);

  const printReport = () => {
    setPrints(true);
  };

  const searchTable = (value) => {
    dispatch(searchdashStaffs(value));
  };

  return (
    <div data-aos="zoom-in-down" className="paymentsCaontainer">
      {prints && (
        <GenerateReports
          open={prints}
          close={setPrints}
          section={"employee"}
          data={employees}
        />
      )}
      <div className="inner-pay">
        <div className="action">
          <div style={{ width: "150px" }} className="butt2">
            <Select
              labelId="demo-select-small"
              id="demo-select-small"
              value={10}
              sx={{
                ...selectStyle2,
                backgroundColor: "#06805B",
                color: "#fff",
              }}>
              <MenuItem style={menu} value={10}>
                Action
              </MenuItem>
              <MenuItem style={menu} value={30}>
                History
              </MenuItem>
              <MenuItem onClick={printReport} style={menu} value={40}>
                Print
              </MenuItem>
            </Select>
          </div>
        </div>

        <div className="search2">
          <div className="butt2">
            <OutlinedInput
              sx={{
                width: "100%",
                height: "35px",
                background: "#EEF2F1",
                fontSize: "12px",
                borderRadius: "0px",
                outline: "none",
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  border: "1px solid #777777",
                },
              }}
              type="text"
              placeholder="Search"
              onChange={(e) => {
                searchTable(e.target.value);
              }}
            />
          </div>
          <PrintButton callback={printReport} />
        </div>

        <div className="table-container">
          <div className="table-head">
            <div className="column">S/N</div>
            <div className="column">Staff Image</div>
            <div className="column">Staff Name</div>
            <div className="column">Sex</div>
            <div className="column">Email</div>
            <div className="column">Phone Number</div>
            <div className="column">Date Employed</div>
            <div className="column">Job Title</div>
            <div className="column">User Type</div>
          </div>

          <div className="row-container">
            {employees.length === 0 ? (
              load ? (
                <ThreeDots
                  height="60"
                  width="50"
                  radius="9"
                  color="#06805B"
                  ariaLabel="three-dots-loading"
                  wrapperStyle={{ marginLeft: "20px" }}
                  wrapperClassName=""
                  visible={true}
                />
              ) : (
                <div style={place}>No data </div>
              )
            ) : (
              employees.map((item, index) => {
                return (
                  <div key={index} className="table-head2">
                    <div className="column">{index + 1}</div>
                    <div className="column">
                      <img
                        style={{
                          width: "35px",
                          height: "35px",
                          borderRadius: "35px",
                        }}
                        src={avatar}
                        alt="icon"
                      />
                    </div>
                    <div className="column">{item.staffName}</div>
                    <div className="column">{item.sex}</div>
                    <div className="column">{item.email}</div>
                    <div className="column">{item.phone}</div>
                    <div className="column">{item.dateEmployed}</div>
                    <div className="column">{item.jobTitle}</div>
                    <div className="column">{item.userType}</div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        <div className="footer">
          <div style={{ fontSize: "14px" }}></div>
          <div className="nav"></div>
        </div>
      </div>
    </div>
  );
};

const menu = {
  fontSize: "14px",
};

const selectStyle2 = {
  width: "100%",
  height: "35px",
  borderRadius: "5px",
  background: "#F2F1F1B2",
  color: "#000",
  fontSize: "14px",
  outline: "none",
};

const place = {
  width: "100%",
  textAlign: "center",
  fontSize: "14px",
  marginTop: "20px",
  color: "green",
};

export default DashboardEmployee;
