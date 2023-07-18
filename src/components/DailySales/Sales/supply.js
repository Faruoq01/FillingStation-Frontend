import { Button, Skeleton } from "@mui/material";
import React from "react";
import { useState } from "react";
import { useSelector } from "react-redux";
import slideMenu from "../../../assets/slideMenu.png";
import swal from "sweetalert";
import { useHistory } from "react-router-dom";
import ApproximateDecimal from "../../common/approx";

const SupplyCard = () => {
  const history = useHistory();
  const user = useSelector((state) => state.auth.user);
  const [load, setLoad] = useState();

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

  const goToSupply = () => {
    if (!getPerm("5")) return swal("Warning!", "Permission denied", "info");
    history.push("/home/supply");
  };

  return (
    <React.Fragment>
      <div style={{ marginTop: "30px" }} className="asset">
        <div
          style={{ color: user.isDark === "0" ? "#000" : "#fff" }}
          className="tank-text">
          Supply
        </div>
        {load ? (
          <Skeleton
            sx={{ borderRadius: "5px", background: "#f7f7f7" }}
            animation="wave"
            variant="rectangular"
            width={"130px"}
            height={35}
          />
        ) : (
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
            onClick={goToSupply}>
            View in details
          </Button>
        )}
      </div>
      <div className="inner-section">
        <div className="cardss">
          {load ? (
            <Skeleton
              sx={{ borderRadius: "5px", background: "#f7f7f7" }}
              animation="wave"
              variant="rectangular"
              width={"100%"}
              height={105}
            />
          ) : (
            <>
              <div className="left">PMS</div>
              <div className="right">
                <div>Litre Qty</div>
                <div>{ApproximateDecimal(0)}</div>
              </div>
            </>
          )}
        </div>
        <div className="cardss">
          {load ? (
            <Skeleton
              sx={{ borderRadius: "5px", background: "#f7f7f7" }}
              animation="wave"
              variant="rectangular"
              width={"100%"}
              height={105}
            />
          ) : (
            <>
              <div className="left">AGO</div>
              <div className="right">
                <div>Litre Qty</div>
                <div>{ApproximateDecimal(0)}</div>
              </div>
            </>
          )}
        </div>
        <div style={{ marginRight: "0px" }} className="cardss">
          {load ? (
            <Skeleton
              sx={{ borderRadius: "5px", background: "#f7f7f7" }}
              animation="wave"
              variant="rectangular"
              width={"100%"}
              height={105}
            />
          ) : (
            <>
              <div className="left">DPK</div>
              <div className="right">
                <div>Litre Qty</div>
                <div>{ApproximateDecimal(0)}</div>
              </div>
            </>
          )}
        </div>
      </div>
    </React.Fragment>
  );
};

export default SupplyCard;
