import edit from "../../assets/comp/edit.png";
import del from "../../assets/comp/delete.png";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import ApproximateDecimal from "../common/approx";
import APIs from "../../services/connections/api";
import React from "react";
import { useNavigate } from "react-router-dom";
import { useCallback } from "react";
import { useEffect } from "react";
import { setTankLevels } from "../../storage/comprehensive";
import { ThreeDots } from "react-loader-spinner";

const TankLevels = () => {
  const navigate = useNavigate();
  const tankLevels = useSelector((state) => state.comprehensive.tankLevels);

  const dispatch = useDispatch();
  const currentDate = useSelector((state) => state.dailysales.updatedDate);
  const user = useSelector((state) => state.auth.user);
  const oneStationData = useSelector((state) => state.outlet.adminOutlet);
  const salesShift = useSelector((state) => state.dailysales.salesShift);
  const [load, setLoad] = useState(false);

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

  const getTankLevels = useCallback((updatedDate, salesShift) => {
    if (oneStationData === null) return navigate("dailysales");
    setLoad(true);
    const payload = {
      organizationID: resolveUserID().id,
      outletID: oneStationData._id,
      date: updatedDate,
      shift: salesShift,
    };

    APIs.post("/comprehensive/tankLevels", payload)
      .then(({ data }) => {
        dispatch(setTankLevels(data.tankLevels));
      })
      .then(() => {
        setLoad(false);
      });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    getTankLevels(currentDate, salesShift);
  }, [getTankLevels, currentDate, salesShift]);

  const DippingRow = (props) => {
    return (
      <div style={{ marginTop: "5px" }} className="product_balance_header">
        <div style={ins} className="cells">
          {props.index + 1}
        </div>
        <div style={ins} className="cells">
          {props.data.tankName}
        </div>
        <div style={ins} className="cells">
          {props.data.productType}
        </div>
        <div style={ins} className="cells">
          {ApproximateDecimal(Number(props.data.currentLevel))}
        </div>
        <div style={ins} className="cells">
          {ApproximateDecimal(props.data.afterSales)}
        </div>
        {getPerm("17") && (
          <div style={ins} className="cells">
            <img
              style={{ width: "20px", height: "20px", marginRight: "10px" }}
              src={edit}
              alt="icon"
            />
            <img
              style={{ width: "20px", height: "20px" }}
              src={del}
              alt="icon"
            />
          </div>
        )}
      </div>
    );
  };

  const MobileDippingRow = ({ data }) => {
    return (
      <div className="supply_card">
        <div style={rows}>
          <div style={{ width: "100%" }}>
            <div style={title}>{data.tankName}</div>
            <div style={label}>Tank Name</div>
          </div>

          <div style={{ width: "100%" }}>
            <div style={title}>{data.productType}</div>
            <div style={label}>Product</div>
          </div>
        </div>

        <div style={rows}>
          <div style={{ width: "100%" }}>
            <div style={title}>
              {ApproximateDecimal(Number(data.currentLevel))}
            </div>
            <div style={label}>Previous Level</div>
          </div>

          <div style={{ width: "100%" }}>
            <div style={title}>{ApproximateDecimal(data.afterSales)}</div>
            <div style={label}>After sale</div>
          </div>
        </div>

        <div style={rows}>
          <div style={{ width: "100%" }}></div>

          <div style={{ width: "100%" }}>
            <div style={title}>
              {getPerm("13") && (
                <div className="cells">
                  <img
                    style={{
                      width: "20px",
                      height: "20px",
                      marginRight: "10px",
                    }}
                    src={edit}
                    alt="icon"
                  />
                  <img
                    style={{ width: "20px", height: "20px" }}
                    src={del}
                    alt="icon"
                  />
                </div>
              )}
            </div>
            <div style={label}>Action</div>
          </div>
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
          <div className="initial_balance_container">
            <div className="product_balance_header">
              <div className="cells">S/N</div>
              <div className="cells">Tank Name</div>
              <div className="cells">Product</div>
              <div className="cells">Before sales</div>
              <div className="cells">After sales</div>
              {getPerm("17") && <div className="cells">Action</div>}
            </div>

            {tankLevels.length === 0 ? (
              <div>No records </div>
            ) : (
              tankLevels.map((item, index) => {
                return <DippingRow key={index} data={item} index={index} />;
              })
            )}
          </div>

          <div className="initial_balance_container_mobile">
            {/* Supply records */}
            <div className="mobile_header">&nbsp;&nbsp;&nbsp; Dipping</div>
            <div
              style={{ marginBottom: "20px", marginTop: "10px" }}
              className="balance_mobile_detail">
              <div className="sups">
                <div className="slide">
                  {tankLevels.length === 0 ? (
                    <div>No records </div>
                  ) : (
                    tankLevels.map((item, index) => {
                      return (
                        <MobileDippingRow
                          key={index}
                          data={item}
                          index={index}
                        />
                      );
                    })
                  )}
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

export default TankLevels;
