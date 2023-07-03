import React from "react";
import "../../styles/estation/airbnb.scss";
import { Circle } from "@mui/icons-material";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import LPOService from "../../services/lpo";
import { createLPOSales } from "../../store/actions/lpo";

export default function AirbnbTable() {
  const [skip, setSkip] = useState(0);
  const [limit, setLimit] = useState(15);
  const [total, setTotal] = useState(0);
  const singleLPO = useSelector((state) => state.lpoReducer.singleLPO);
  const lpos = useSelector((state) => state.lpoReducer.lpoSales);
  const dispatch = useDispatch();

  const refresh = (skip) => {
    const payload = {
      skip: skip * limit,
      limit: limit,
      lpoID: singleLPO?._id,
      outletID: singleLPO?.outletID,
      organisationID: singleLPO?.organizationID,
    };

    LPOService.getAllLPOSales(payload).then((data) => {
      setTotal(data.lpo.count);
      dispatch(createLPOSales(data.lpo.lpo));
    });
  };

  const nextPage = () => {
    if (!(skip < 0)) {
      setSkip((prev) => prev + 1);
    }
    refresh(skip + 1);
  };

  const prevPage = () => {
    if (!(skip <= 0)) {
      setSkip((prev) => prev - 1);
    }
    refresh(skip - 1);
  };

  const getPrice = (item) => {
    if (item.productType === "PMS") return item.PMSRate;
    if (item.productType === "AGO") return item.AGORate;
    if (item.productType === "DPK") return item.DPKRate;
  };

  const getAmount = (item) => {
    if (item.productType === "PMS")
      return Number(item.PMSRate) * Number(item.lpoLitre);
    if (item.productType === "AGO")
      return Number(item.AGORate) * Number(item.lpoLitre);
    if (item.productType === "DPK")
      return Number(item.DPKRate) * Number(item.lpoLitre);
  };

  return (
    <div className="tb-wraper">
      <table id="customers">
        <thead>
          <tr>
            <th>S/N</th>
            <th>Date</th>
            <th>Products</th>
            <th>Litres</th>
            <th>Price/Litre</th>
            <th>Amount</th>
            <th>Station</th>
            <th>Reference</th>
          </tr>
        </thead>
        <tbody>
          {lpos.length === 0 ? (
            <div style={records}>No LPO Sales Records</div>
          ) : (
            lpos.map((item, index) => (
              <tr key={Math.random}>
                <td>{index + 1 > 9 ? index + 1 : `0${index + 1}`}</td>
                <td>{item.createdAt}</td>
                <td>
                  <Circle
                    style={{ color: "#1B6602", fontSize: 10, marginRight: 4 }}
                  />
                  <label>{item.productType}</label>
                </td>
                <td>{item.lpoLitre}</td>
                <td>{getPrice(item)}</td>
                <td>{getAmount(item)}</td>
                <td>{item.station}</td>
                <td>{item.truckNo}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

const records = {
  fontSize: "12px",
  color: "green",
  fontWeight: "600",
  marginTop: "10px",
};
