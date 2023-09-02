import React from "react";
import ThreeDotsLoader from "../../common/ThreeDotsLoader";

export const TableViewForDesktop = ({ children, columns, ref }) => {
  return (
    <div ref={ref} className="table-container">
      <div className="table-head">
        {columns.map((item, index) => {
          return (
            <div key={index} className="column">
              {item}
            </div>
          );
        })}
      </div>
      {children}
    </div>
  );
};

export const DesktopTableRowContainer = ({ children, rows, loading }) => {
  return (
    <React.Fragment>
      {loading && <ThreeDotsLoader />}
      {rows.length === 0 && !loading && <div style={place}>No data</div>}
      {children}
    </React.Fragment>
  );
};

export const DesktopTableRows = ({ children, index, callback }) => {
  return (
    <React.Fragment>
      <div key={index} onClick={callback} className="row-container">
        <div className="table-head2">{children}</div>
      </div>
    </React.Fragment>
  );
};

export const DesktopTableCell = ({ data }) => {
  return <div className="column">{data}</div>;
};

const place = {
  width: "100%",
  textAlign: "center",
  fontSize: "12px",
  marginTop: "20px",
  color: "green",
};
