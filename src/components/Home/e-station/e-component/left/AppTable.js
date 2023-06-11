import React, { useId } from "react";
import "./appTable.scss";
import moment from "moment";
import CircleIcon from "@mui/icons-material/Circle";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import { tableData_E } from "../../data";
import { useMediaQuery } from "@mui/material";
export default function AppTable() {
  const mobile = useMediaQuery("(max-width:900px)");
  const tablet = useMediaQuery("(min-width:800px)");
  return (
    <div className="table-container">
      <div style={styles(mobile, tablet).tWrap}>
        <table id="app-table">
          <thead>
            <tr>
              <th>S/N</th>
              {!mobile && <th>Date</th>}
              {!mobile && <th>Time</th>}
              <th>{mobile ? "Account" : "Account Name"}</th>
              <th>Product</th>
              <th>Litres</th>
              <th>Price</th>
              {!mobile && <th>Station</th>}
              {!mobile && <th>Attendants</th>}
            </tr>
          </thead>
          <tbody>
            {tableData_E.map((item, index) => (
              <tr key={index + item.id}>
                <td>{index + 1}</td>
                {!mobile && <td>{item.date}</td>}
                {!mobile && <td>{item.time}</td>}
                <td>
                  <div style={styles(mobile, tablet).userName}>
                    <img
                      src={require("../../img/image.svg").default}
                      className="profile-image"
                    />
                    {!mobile && <label>{item.account_name}</label>}
                  </div>
                </td>
                <td>
                  <CircleIcon
                    style={{
                      color:
                        item.product == "DPK"
                          ? "#35393E"
                          : item.product == "PMS"
                          ? "#399A19"
                          : "#FFA010",
                      marginRight: 2,
                      fontSize: 8,
                    }}
                  />
                  {item.product}
                </td>
                <td>{item.liters}</td>
                <td>{item.price}</td>
                <td>{!mobile && item.station}</td>
                {!mobile && <td>{item.attendant}</td>}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="button-wrap">
        <div style={styles().pagginator}>
          <button className="button_">
            <KeyboardArrowLeftIcon />
          </button>
          <button className="button_">
            <KeyboardArrowRightIcon />
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = (mobile, tablet) => ({
  tWrap: {
    maxHeight: mobile && "550px",
    overflow: mobile && "scroll",
    width: "100%",
  },
  pagginator: {
    display: "flex",
    flexDirection: "row",
    marginRight: "10px",
    marginBottom: 10,
  },
  userName: {
    display: "flex",
    flexDirection: !mobile && "row",
    alignItems: "center",
    justifyContent: mobile ? "center" : "flex-start",
    marginLeft: !mobile && "1rem",
  },
});
