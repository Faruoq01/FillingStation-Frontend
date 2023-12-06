import React from "react";
import ThreeDotsLoader from "../../common/ThreeDotsLoader";
import "../../../styles/common/table.scss";
import empty from "../../../assets/comp/No data-cuate 1.svg";

export const TableViewForMobile = ({ children, rows, loading }) => {
  return (
    <React.Fragment>
      {loading && <ThreeDotsLoader />}
      {rows.length === 0 && !loading && <div style={place}>
        <img style={emptyStyle} src={empty} alt="No data" />
        <div style={{marginBottom: "50px"}}>No records for the current filter</div>
      </div>}
      {children}
    </React.Fragment>
  );
};

export const MobileTableRows = ({ children, index }) => {
  return (
    <React.Fragment>
      <div key={index} className="mobile-table-container">
        <div className="inner-container">{children}</div>
      </div>
    </React.Fragment>
  );
};

export const MobileTableCell = ({ columns, cellData }) => {
  return (
    <div className="row">
      {columns[0] === "action" && (
        <div style={text} className="left-text">
          {cellData[0]}
        </div>
      )}
      {columns[0] === "action" || (
        <div className="left-text">
          <div style={leftAction} className="heads">
            {cellData[0]}
          </div>
          <div style={leftAction} className="foots">
            {columns[0]}
          </div>
        </div>
      )}
      {columns[1] === "action" && (
        <div style={text} className="left-text">
          {cellData[1]}
        </div>
      )}
      {columns[1] === "action" || (
        <div className="left-text">
          <div style={rightAction} className="heads">
            {cellData[1]}
          </div>
          <div style={rightAction} className="foots">
            {columns[1]}
          </div>
        </div>
      )}
    </div>
  );
};

const leftAction = {
  width: "100%",
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
};

const rightAction = {
  width: "100%",
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-end",
};

const text = {
  display: "flex",
  flexDirection: "row",
  justifyContent: "flex-end",
  alignItems: "center",
};

const place = {
  width: "100%",
  textAlign: "center",
  fontSize: "12px",
  marginTop: "20px",
  color: "green",
};

const emptyStyle = {
  width: "200px",
  height: "200px",
}
