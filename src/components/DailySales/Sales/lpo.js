import { Button } from "@mui/material";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import slideMenu from "../../../assets/slideMenu.png";
import swal from "sweetalert";
import ApproximateDecimal from "../../common/approx";

const LPO = () => {
  const history = useHistory();
  const user = useSelector((state) => state.auth.user);

  const resolveUserID = () => {
    if (user.userType === "superAdmin") {
      return { id: user._id };
    } else {
      return { id: user.organisationID };
    }
  };

  const getPerm = (e) => {
    if (user.userType === "superAdmin") {
      return true;
    }
    return user.permission?.dailySales[e];
  };

  const goToLPO = () => {
    if (!getPerm("7")) return swal("Warning!", "Permission denied", "info");
    history.push("/home/record-sales/lpo");
  };

  return (
    <div style={{ marginTop: "30px" }} className="section">
      <div className="alisss">
        <div
          style={{ color: user.isDark === "0" ? "#000" : "#fff" }}
          className="tank-text">
          LPO
        </div>
        <Button
          variant="contained"
          startIcon={
            <img
              style={{
                width: "15px",
                height: "10px",
                marginRight: "15px",
              }}
              src={slideMenu}
              alt="icon"
            />
          }
          sx={{
            width: "150px",
            height: "30px",
            background: "#06805B",
            fontSize: "11px",
            borderRadius: "0px",
            fontFamily: "Poppins",
            textTransform: "capitalize",
            "&:hover": {
              backgroundColor: "#06805B",
            },
          }}
          onClick={goToLPO}>
          View in details
        </Button>
      </div>
      <div className="inner-section">
        <div
          style={{ height: "110px", paddingBottom: "10px" }}
          className="inner-content">
          <div className="conts">
            <div className="row-count">
              <div
                style={{ fontSize: "13px", fontWeight: "bold" }}
                className="item-count">
                LPO (Ltrs)
              </div>
              <div
                style={{ fontSize: "13px", fontWeight: "bold" }}
                className="item-count">
                Amount
              </div>
            </div>
            <div className="row-count">
              <div className="item-count">PMS: {ApproximateDecimal(0)}</div>
              <div className="item-count">NGN {ApproximateDecimal(0)}</div>
            </div>

            <div className="row-count">
              <div className="item-count">AGO: {ApproximateDecimal(0)}</div>
              <div className="item-count">NGN {ApproximateDecimal(0)}</div>
            </div>

            <div className="row-count">
              <div className="item-count">DPK: {ApproximateDecimal(0)}</div>
              <div className="item-count">NGN {ApproximateDecimal(0)}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LPO;
