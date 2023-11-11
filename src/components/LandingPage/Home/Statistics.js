import pumpIcon from "../../../assets/landing/pumpIcon.png";
import userIcon from "../../../assets/landing/userIcon.png";

const Statistics = () => {
  return (
    <div className="stats">
      <div className="ins">
        <div className="row">
          <div className="box">
            <span>No 1</span>
            <span style={{ color: "#399A19" }}>Filling Outlet</span>
            <span>Management</span>
          </div>
        </div>
        <div className="row">
          <div className="box">
            <img
              style={{ width: "35px", height: "35px" }}
              src={pumpIcon}
              alt="icon"
            />
            <span
              style={{
                fontSize: "30px",
                fontWeight: "bolder",
                lineHeight: "60px",
              }}>
              0
            </span>
            <span>Total Outlets</span>
          </div>
        </div>
        <div className="row">
          <div className="box">
            <img
              style={{ width: "35px", height: "40px" }}
              src={userIcon}
              alt="icon"
            />
            <span
              style={{
                fontSize: "30px",
                fontWeight: "bolder",
                lineHeight: "60px",
              }}>
              0
            </span>
            <span>Happy Customers</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Statistics;
