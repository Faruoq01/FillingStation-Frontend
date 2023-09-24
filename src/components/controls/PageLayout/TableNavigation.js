import { useSelector } from "react-redux";

const TableNavigation = ({
  skip,
  limit,
  total,
  setSkip,
  updateDate,
  callback,
  salesShift = "All shifts",
}) => {
  const oneStationData = useSelector((state) => state.outlet.adminOutlet);

  const nextPage = () => {
    setSkip((prev) => prev + 1);
    const getID = oneStationData === null ? "None" : oneStationData._id;
    callback(getID, updateDate, skip + 1, salesShift);
  };

  const prevPage = () => {
    if (skip < 1) return;
    setSkip((prev) => prev - 1);
    const getID = oneStationData === null ? "None" : oneStationData._id;
    callback(getID, updateDate, skip - 1, salesShift);
  };
  return (
    <div className="footer">
      <div style={{ fontSize: "14px" }}>
        Showing {(skip + 1) * limit - (limit - 1)} to {(skip + 1) * limit} of{" "}
        {total} entries
      </div>
      <div className="nav">
        <button onClick={prevPage} className="but">
          Previous
        </button>
        <div className="num">{skip + 1}</div>
        <button onClick={nextPage} className="but2">
          Next
        </button>
      </div>
    </div>
  );
};

export default TableNavigation;
