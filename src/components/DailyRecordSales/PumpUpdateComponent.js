import { Radio } from "@mui/material";

import { useDispatch, useSelector } from "react-redux";
import { setProductType } from "../../storage/recordsales";
import PumpCard from "./pumpupdateUtils/pumpcard";
import PumpIndicators from "./pumpupdateUtils/pumpindicator";
import Navigation from "./navigation";
import React from "react";
import { useNavigate } from "react-router-dom";
import swal from "sweetalert";

const PumpUpdateComponent = (props) => {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate()
  const productType = useSelector((state) => state.recordsales.productType);
  const oneStationData = useSelector((state) => state.outlet.adminOutlet);

  //////////////////////////////////////////////////////////////
  const selectedPumps = useSelector((state) => state.recordsales.selectedPumps);

  const PMS = useSelector((state) => state.recordsales.PMS);
  const AGO = useSelector((state) => state.recordsales.AGO);
  const DPK = useSelector((state) => state.recordsales.DPK);

  const getPerm = (e) => {
    if (user.userType === "superAdmin") {
      return true;
    }
    return user.permission?.recordSales[e];
  };

  const onRadioClick = (data) => {
    if (data === "PMS") {
      dispatch(setProductType("PMS"));
    }

    if (data === "AGO") {
      dispatch(setProductType("AGO"));
    }

    if (data === "DPK") {
      dispatch(setProductType("DPK"));
    }
  };

  const displaySelectedPumps = (data, type) => {
    if (selectedPumps.length === 0) {
      return data;
    } else {
      const productPump = selectedPumps.filter(
        (data) => data.productType === type
      );
      return productPump;
    }
  };

  const RadioItem = ({ label, product }) => {
    return (
      <div className="rad-item">
        <Radio
          {...props}
          sx={{
            "&, &.Mui-checked": {
              color: "#054834",
            },
          }}
          onClick={() => onRadioClick(label)}
          checked={product === label ? true : false}
        />
        <div
          className="head-text2"
          style={{ marginRight: "5px", fontSize: "12px" }}>
          {label}
        </div>
      </div>
    );
  };

  const next = () => {
    if (oneStationData === null)
      return swal("Warning!", "Please select a station first", "info");
    if (!getPerm("3"))
      return swal("Warning!", "Permission denied", "info");

    navigate("/home/recordsales/rttank");
  }

  return (
    <React.Fragment>
      <div className="form-body">
        <div
          style={{ flexDirection: "column", alignItems: "center" }}
          className="inner-body">
          <div style={rad} className="radio">
            <RadioItem label={"PMS"} product={productType} />
            <RadioItem label={"AGO"} product={productType} />
            <RadioItem label={"DPK"} product={productType} />
          </div>

          <div style={placeholder}>Select pump used for the day</div>
          <PumpIndicators />

          <div style={pumpcontainer} className="pumping">
            {productType === "PMS" &&
              displaySelectedPumps(PMS, "PMS")?.map((item, index) => {
                return <PumpCard item={item} index={index} />;
              })}
            {productType === "AGO" &&
              displaySelectedPumps(AGO, "AGO")?.map((item, index) => {
                return <PumpCard item={item} index={index} />;
              })}
            {productType === "DPK" &&
              displaySelectedPumps(DPK, "DPK")?.map((item, index) => {
                return <PumpCard item={item} index={index} />;
              })}
          </div>
        </div>
      </div>
      <Navigation next={next} route={'pump'} />
    </React.Fragment>
  );
};

const rad = {
  display: "flex",
  flexDirection: "row",
  justifyContent: "center",
};

const placeholder = {
  marginTop: "10px",
  marginBottom: "10px",
  fontWeight: "400",
};

const pumpcontainer = {
  width: "100%",
  marginTop: "20px",
  justifyContent: "center",
};

export default PumpUpdateComponent;
