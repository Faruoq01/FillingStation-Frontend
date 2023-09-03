import { useDispatch, useSelector } from "react-redux";
import ApproximateDecimal from "../common/approx";
import { useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import APIs from "../../services/api";
import { setBalanceCF } from "../../storage/comprehensive";
import React from "react";
import { ThreeDots } from "react-loader-spinner";

const BalanceCF = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { pms, ago, dpk } = useSelector(
    (state) => state.comprehensive.balanceCF
  );
  const oneStationData = useSelector((state) => state.outlet.adminOutlet);
  const currentDate = useSelector((state) => state.dailysales.updatedDate);
  const user = useSelector((state) => state.auth.user);
  const [load, setLoad] = useState(false);

  const resolveUserID = () => {
    if (user.userType === "superAdmin") {
      return { id: user._id };
    } else {
      return { id: user.organisationID };
    }
  };

  const getRemarkData = useCallback((updatedDate) => {
    if (oneStationData === null) return navigate("dailysales");
    setLoad(true);
    const payload = {
      organizationID: resolveUserID().id,
      outletID: oneStationData._id,
      date: updatedDate,
    };

    APIs.post("/comprehensive/balanceCF", payload)
      .then(({ data }) => {
        dispatch(setBalanceCF(data.balanceCF));
      })
      .then(() => {
        setLoad(false);
      });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    getRemarkData(currentDate);
  }, [getRemarkData, currentDate]);

  const BalanceCF = ({ data, type, sn }) => {
    return (
      <div style={{ marginTop: "5px" }} className="product_balance_header">
        <div style={ins} className="cells">
          {sn}
        </div>
        <div style={ins} className="cells">
          {type}{" "}
        </div>
        <div style={ins} className="cells">
          {data === null ? "0" : ApproximateDecimal(data)}
        </div>
      </div>
    );
  };

  const MobileBalanceCF = ({ data, type, sn }) => {
    return (
      <div className="supply_card">
        <div style={rows}>
          <div style={{ width: "100%" }}>
            <div style={title}>{sn}</div>
            <div style={label}>S/N</div>
          </div>

          <div style={{ width: "100%" }}>
            <div style={title}>{type}</div>
            <div style={label}>Product</div>
          </div>
        </div>

        <div style={rows}>
          <div style={{ width: "100%" }}>
            <div style={title}>
              {data === null ? "0" : ApproximateDecimal(data)}
            </div>
            <div style={label}>Quantity</div>
          </div>

          <div style={{ width: "100%" }}></div>
        </div>
      </div>
    );
  };

  return (
    <React.Fragment>
      {load ? (
        <ThreeDots
          height="60"
          width="50"
          radius="9"
          color="#06805B"
          ariaLabel="three-dots-loading"
          wrapperStyle={{ marginLeft: "20px" }}
          wrapperClassName=""
          visible={true}
        />
      ) : (
        <div style={{ width: "100%" }}>
          <div
            style={{ maxWidth: "700px" }}
            className="initial_balance_container">
            <div className="product_balance_header">
              <div className="cells">S/N</div>
              <div className="cells">Product Type</div>
              <div className="cells">Quantity</div>
            </div>

            <BalanceCF data={pms} type={"PMS"} sn={"1"} />
            <BalanceCF data={ago} type={"AGO"} sn={"2"} />
            <BalanceCF data={dpk} type={"DPK"} sn={"3"} />
          </div>

          <div className="initial_balance_container_mobile">
            {/* Supply records */}
            <div className="mobile_header">
              &nbsp;&nbsp;&nbsp; Balance Carried Forward
            </div>
            <div
              style={{ marginBottom: "20px", marginTop: "10px" }}
              className="balance_mobile_detail">
              <div className="sups">
                <div className="slide">
                  <MobileBalanceCF data={pms} type={"PMS"} sn={"1"} />
                  <MobileBalanceCF data={ago} type={"AGO"} sn={"2"} />
                  <MobileBalanceCF data={dpk} type={"DPK"} sn={"3"} />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </React.Fragment>
  );
};

const ins = {
  background: "#EDEDEDB2",
  color: "#000",
  fontWeight: "600",
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

export default BalanceCF;
