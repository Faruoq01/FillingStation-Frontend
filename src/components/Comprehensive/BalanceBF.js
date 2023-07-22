import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import ApproximateDecimal from "../common/approx";
import { useCallback, useEffect, useState } from "react";
import APIs from "../../services/api";
import { setBalances, setSupply } from "../../storage/comprehensive";
import { Skeleton } from "@mui/material";
import React from "react";
import moment from "moment";
import { useHistory } from "react-router-dom";

const InitialBalance = () => {
  const history = useHistory();
  const today = moment().format("YYYY-MM-DD").split(" ")[0];
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const oneStationData = useSelector((state) => state.outlet.adminOutlet);
  const updatedDate = useSelector((state) => state.dailysales.updatedDate);
  const balances = useSelector((state) => state.comprehensive.balances);
  const { pms, ago, dpk } = useSelector((state) => state.comprehensive.supply);
  const [load, setLoad] = useState(false);

  const resolveUserID = () => {
    if (user.userType === "superAdmin") {
      return { id: user._id };
    } else {
      return { id: user.organisationID };
    }
  };

  const getAllProductBalances = useCallback((updatedDate) => {
    if (oneStationData === null) return history.push("/home/daily-sales");
    setLoad(true);
    const payload = {
      organizationID: resolveUserID().id,
      outletID: oneStationData._id,
      date: updatedDate === "" ? today : updatedDate,
    };

    APIs.post("/comprehensive/balanceBF", payload)
      .then(({ data }) => {
        dispatch(setBalances(data.data.balanceCF));
        dispatch(setSupply(data.data.supply));
      })
      .then(() => {
        setLoad(false);
      });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    getAllProductBalances(updatedDate);
  }, [getAllProductBalances, updatedDate]);

  const calculateSum = (data, supply) => {
    const actaulSupply = supply?.quantity;
    return Number(data) + Number(actaulSupply);
  };

  const InitialRows = ({ type, data, supply }) => {
    return (
      <div style={{ marginTop: "5px" }} className="header_balance_container">
        <div style={ins} className="B_forward">
          <div style={{ marginRight: "5px" }} className="b_child">
            {type}
          </div>
          <div className="b_child">{ApproximateDecimal(data)}</div>
        </div>

        <div style={ins} className="initial_supply">
          <div style={{ marginRight: "5px" }} className="b_child">
            {type}
          </div>
          <div style={{ marginRight: "5px" }} className="b_child">
            {ApproximateDecimal(supply?.quantity)}
          </div>
          <div style={{ marginRight: "5px" }} className="b_child">
            {ApproximateDecimal(supply?.shortage)}
          </div>
          <div style={{ marginRight: "5px" }} className="b_child">
            {ApproximateDecimal(supply?.overage)}
          </div>
          <div className="b_child">
            <Link>View</Link>
          </div>
        </div>
        <div style={ins} className="B_forward">
          <div style={{ marginRight: "5px" }} className="b_child">
            {type}
          </div>
          <div className="b_child">
            {ApproximateDecimal(calculateSum(data, supply))}
          </div>
        </div>
      </div>
    );
  };

  const SupplyCard = ({ color, type, data, supply }) => {
    return (
      <div className="supply_card">
        <div style={tag}>
          <div style={{ ...tag_name, background: color }}>{type}</div>
        </div>

        <div style={rows}>
          <div>
            <div style={title}>{ApproximateDecimal(supply?.quantity)}</div>
            <div style={label}>Quantity</div>
          </div>
          <div>
            <div style={title}>{ApproximateDecimal(supply?.shortage)}</div>
            <div style={label}>Shortage</div>
          </div>
        </div>

        <div style={rows}>
          <div>
            <div style={title}>{ApproximateDecimal(supply?.overage)}</div>
            <div style={label}>Overage</div>
          </div>
          <div>
            <div style={title}>
              <Link>View</Link>
            </div>
            <div style={label}></div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <React.Fragment>
      {load ? (
        <Skeleton
          sx={{
            borderRadius: "5px",
            background: "#f7f7f7",
            marginLeft: "20px",
          }}
          animation="wave"
          variant="rectangular"
          width={"94%"}
          height={200}
        />
      ) : (
        <div style={{ width: "100%" }}>
          <div className="initial_balance_container">
            <div className="header_balance_container">
              <div className="B_forward">Balance B/Forward</div>
              <div className="initial_supply">&nbsp; &nbsp; Supply</div>
              <div className="B_forward">Available Balance</div>
            </div>

            <div
              style={{ marginTop: "5px" }}
              className="header_balance_container"
            >
              <div style={ins} className="B_forward">
                <div style={{ marginRight: "5px" }} className="b_child">
                  Product Type
                </div>
                <div className="b_child">Litre Qty</div>
              </div>
              <div style={ins} className="initial_supply">
                <div style={{ marginRight: "5px" }} className="b_child">
                  Type
                </div>
                <div style={{ marginRight: "5px" }} className="b_child">
                  Quantity
                </div>
                <div style={{ marginRight: "5px" }} className="b_child">
                  Shortage
                </div>
                <div style={{ marginRight: "5px" }} className="b_child">
                  Overage
                </div>
                <div className="b_child">Details</div>
              </div>
              <div style={ins} className="B_forward">
                <div style={{ marginRight: "5px" }} className="b_child">
                  Product Type
                </div>
                <div className="b_child">Litre Qty</div>
              </div>
            </div>

            <InitialRows type={"PMS"} data={balances.pms} supply={pms} />
            <InitialRows type={"AGO"} data={balances.ago} supply={ago} />
            <InitialRows type={"DPK"} data={balances.dpk} supply={dpk} />
          </div>

          <div className="initial_balance_container_mobile">
            {/* Balance Brought forward */}
            <div className="mobile_header">
              &nbsp;&nbsp;&nbsp; Balance B/Forward
            </div>
            <div className="balance_mobile_detail">
              <div className="col_1">
                <div className="mobile_big">
                  {ApproximateDecimal(balances.pms)}
                </div>
                <div className="mobile_sm">PMS</div>
              </div>
              <div className="col_1">
                <div className="mobile_big">
                  {ApproximateDecimal(balances.ago)}
                </div>
                <div className="mobile_sm">AGO</div>
              </div>
              <div className="col_1">
                <div className="mobile_big">
                  {ApproximateDecimal(balances.dpk)}
                </div>
                <div className="mobile_sm">DPK</div>
              </div>
            </div>

            {/* Supply records */}
            <div style={{ marginTop: "20px" }} className="mobile_header">
              &nbsp;&nbsp;&nbsp; Supply
            </div>
            <div
              style={{ marginBottom: "20px", marginTop: "10px" }}
              className="balance_mobile_detail"
            >
              <div className="sups">
                <div className="slide">
                  <SupplyCard
                    color={"#06805B"}
                    type={"PMS"}
                    data={balances.pms}
                    supply={pms}
                  />
                  <SupplyCard
                    color={"#FFA010"}
                    type={"AGO"}
                    data={balances.ago}
                    supply={ago}
                  />
                  <SupplyCard
                    color={"#525252"}
                    type={"DPK"}
                    data={balances.dpk}
                    supply={dpk}
                  />
                </div>
              </div>
            </div>

            {/* Balance carried forward */}
            <div className="mobile_header">
              &nbsp;&nbsp;&nbsp; Available Balance
            </div>
            <div className="balance_mobile_detail">
              <div className="col_1">
                <div className="mobile_big">
                  {ApproximateDecimal(calculateSum(balances.pms, pms))}
                </div>
                <div className="mobile_sm">PMS</div>
              </div>
              <div className="col_1">
                <div className="mobile_big">
                  {ApproximateDecimal(calculateSum(balances.ago, ago))}
                </div>
                <div className="mobile_sm">AGO</div>
              </div>
              <div className="col_1">
                <div className="mobile_big">
                  {ApproximateDecimal(calculateSum(balances.dpk, dpk))}
                </div>
                <div className="mobile_sm">DPK</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </React.Fragment>
  );
};

const ins = {
  background: "transparent",
  color: "#000",
};

const tag = {
  width: "100%",
  display: "flex",
  flexDirection: "row",
  justifyContent: "flex-start",
};

const tag_name = {
  width: "70px",
  height: "35px",
  background: "#06805B",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  fontSize: "12px",
};

const rows = {
  width: "90%",
  height: "auto",
  marginTop: "20px",
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between",
};

const title = {
  fontSize: "12px",
  fontWeight: "500",
  fontFamily: "Poppins",
  lineHeight: "30px",
  color: "#515151",
};

const label = {
  fontSize: "11px",
  fontWeight: "500",
  fontFamily: "Poppins",
  color: "#07956A",
};

export default InitialBalance;
