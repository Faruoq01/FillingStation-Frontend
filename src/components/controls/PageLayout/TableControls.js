export const TableControls = ({ children, mt }) => {
  return (
    <div style={{ marginTop: mt }} className="search">
      {children}
    </div>
  );
};

export const LeftControls = ({ children }) => {
  return <div className="input-cont">{children}</div>;
};

export const RightControls = ({ children }) => {
  return (
    <div style={right} className="input-cont">
      {children}
    </div>
  );
};

const right = {
  justifyContent: "flex-end",
};
