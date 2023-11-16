const mobile = window.matchMedia("(max-width: 600px)");

export const TableControls = ({ children, mt }) => {
  return (
    <div style={{ ...container, marginTop: mobile.matches ? "0px" : mt }}>
      {children}
    </div>
  );
};

export const LeftControls = ({ children }) => {
  return <div style={left}>{children}</div>;
};

export const RightControls = ({ children }) => {
  return <div style={right}>{children}</div>;
};

const container = {
  width: "100%",
  display: "flex",
  flexDirection: mobile.matches ? "column-reverse" : "row",
  justifyContent: mobile.matches ? "flex-start" : "space-between",
  alignItems: mobile.matches ? "flex-start" : "center",
};

const right = {
  width: mobile.matches ? "100%" : "50%",
  display: "flex",
  flexDirection: mobile.matches ? "column" : "row",
  justifyContent: mobile.matches ? "flex-start" : "flex-end",
  alignItems: mobile.matches ? "flex-start" : "center",
};

const left = {
  width: mobile.matches ? "100%" : "50%",
  display: "flex",
  flexDirection: "row",
  justifyContent: mobile.matches ? "flex-start" : "flex-start",
  alignItems: mobile.matches ? "flex-start" : "center",
  marginTop: mobile.matches ? "10px" : "0px",
};
