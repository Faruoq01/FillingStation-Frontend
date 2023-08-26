const TableNavigation = () => {
  return (
    <div className="footer">
      <div style={{ fontSize: "12px" }}>Showing 1 to 11 of 38 entries</div>
      <div className="nav">
        <button className="but">Previous</button>
        <div className="num">1</div>
        <button className="but2">Next</button>
      </div>
    </div>
  );
};

export default TableNavigation;
