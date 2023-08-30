const mobile = window.matchMedia("(max-width: 600px)");

export const TableControls = ({ children, mt }) => {
  const getStyle = () => {
    const style = {
      marginTop: mobile.matches ? "0px" : mt,
    };
    return style;
  };
  return (
    <div style={getStyle()} className="search">
      {children}
    </div>
  );
};

export const LeftControls = ({ children }) => {
  return (
    <div style={left} className="input-cont">
      {children}
    </div>
  );
};

export const RightControls = ({ children }) => {
  return (
    <div style={right} className="input-cont">
      {children}
    </div>
  );
};

const right = {
  display: "flex",
  flexDirection: "row",
  justifyContent: mobile.matches ? "flex-start" : "flex-end",
};

const left = {
  display: "flex",
  flexDirection: "row",
  justifyContent: "flex-start",
};
