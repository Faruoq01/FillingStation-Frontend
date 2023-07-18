import { Button } from "@mui/material";
import slideMenu from "../../../assets/slideMenu.png";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import AddPayModal from "../../Modals/AddPayModal";
import { useState } from "react";
import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt";
import ApproximateDecimal from "../../common/approx";

const NetToBank = () => {
  const history = useHistory();
  const user = useSelector((state) => state.auth.user);
  const [payMe, setPayMe] = useState(false);

  const openPayModal = () => {
    setPayMe(true);
  };

  return (
    <div style={{ marginTop: "30px" }} className="section">
      {payMe && (
        <AddPayModal
          open={payMe}
          close={setPayMe}
          // refresh={getAllProductData}
        />
      )}
      <div className="alisss">
        <div
          style={{ color: user.isDark === "0" ? "#000" : "#fff" }}
          className="tank-text">
          Net to bank
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
          onClick={() => {
            history.push("/home/analysis/payments");
          }}>
          View in details
        </Button>
      </div>
      <div onClick={openPayModal} style={updatePay}>
        <div>Click here to update payment</div>
        <ArrowRightAltIcon />
      </div>
      <div className="inner-section">
        <div className="inner-content">
          <div className="conts">
            <div className="row-count">
              <div
                style={{ fontSize: "12px", fontWeight: "bold" }}
                className="item-count">
                Net to bank
              </div>
              <div
                style={{ fontSize: "12px", fontWeight: "bold" }}
                className="item-count">
                Payment
              </div>
              <div
                style={{ fontSize: "12px", fontWeight: "bold" }}
                className="item-count">
                NGN {ApproximateDecimal(0)}
              </div>
              <div
                style={{ fontSize: "12px", fontWeight: "bold" }}
                className="item-count">
                Outstanding
              </div>
            </div>
            <div className="row-count">
              <div className="item-count">NGN {ApproximateDecimal(0)}</div>
              <div style={{ color: "#0872D4" }} className="item-count">
                Teller
              </div>
              <div style={{ color: "#0872D4" }} className="item-count">
                NGN {ApproximateDecimal(0)}
              </div>
              <div style={{ color: "red" }} className="item-count">
                {ApproximateDecimal(0)}
              </div>
            </div>
            <div className="row-count">
              <div className="item-count"></div>
              <div style={{ color: "#000" }} className="item-count">
                POS
              </div>
              <div style={{ color: "#000" }} className="item-count">
                NGN {ApproximateDecimal(0)}
              </div>
              <div className="item-count"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const updatePay = {
  fontWeight: "500",
  color: "green",
  marginTop: "10px",
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  cursor: "pointer",
};

export default NetToBank;
