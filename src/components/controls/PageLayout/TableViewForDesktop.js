import React from "react";
import { ThreeDots } from "react-loader-spinner";

export const DesktopTableRows = ({ rows, Action, loading }) => {
  return (
    <React.Fragment>
      {!loading ? (
        rows.length === 0 ? (
          <div style={place}>No data</div>
        ) : (
          rows.map((item, index) => {
            return (
              <div key={index} className="row-container">
                <div className="table-head2">
                  <div className="column">{index + 1}</div>
                  <div className="column">{item.state}</div>
                  <div className="column">{item.outletName}</div>
                  <div className="column">{item._id.substring(0, 6)}</div>
                  <div className="column">{item.noOfTanks}</div>
                  <div className="column">{item.noOfPumps}</div>
                  <div className="column">{item.alias}</div>
                  <div className="column">{item.city}</div>
                  <div className="column">{<Action item={item} />}</div>
                </div>
              </div>
            );
          })
        )
      ) : (
        <div style={load}>
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
        </div>
      )}
    </React.Fragment>
  );
};

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

const place = {
  width: "100%",
  textAlign: "center",
  fontSize: "12px",
  marginTop: "20px",
  color: "green",
};

const load = {
  width: "100%",
  height: "30px",
  display: "flex",
  justifyContent: "center",
};
