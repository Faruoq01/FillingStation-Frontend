import React from "react";
import "../../styles/estation/airbnb.scss";
import { Circle } from "@mui/icons-material";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import LPOService from "../../services/lpo";
import { createLPOSales } from "../../store/actions/lpo";
import moment from "moment";

export default function AirbnbTable() {
  const [skip, setSkip] = useState(0);
  const [limit] = useState(15);
  const singleLPO = useSelector((state) => state.lpoReducer.singleLPO);
  const lpos = useSelector((state) => state.lpoReducer.lpoSales);
  const updatedDate = useSelector((state) => state.dashboardReducer.dateRange);
  const dispatch = useDispatch();

  const refresh = (skip) => {
    if (skip < 0) return;
    const formatOne = moment(new Date(updatedDate[0]))
      .format("YYYY-MM-DD HH:mm:ss")
      .split(" ")[0];
    const formatTwo = moment(new Date(updatedDate[1]))
      .format("YYYY-MM-DD HH:mm:ss")
      .split(" ")[0];

    const payload = {
      skip: skip * limit,
      limit: limit,
      lpoID: singleLPO?._id,
      organisationID: singleLPO?.organizationID,
      startDate: formatOne,
      endDate: formatTwo,
    };

    LPOService.getAllLPOSales(payload).then((data) => {
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
      <div className="nav-Table">
        <div className="nav-cont">
          <div onClick={prevPage} className="prev-nav">
            Prev
          </div>
          <div className="nums">{skip + 1}</div>
          <div onClick={nextPage} className="prev-nav">
            Next
          </div>
        </div>
      </div>
    </div>
  );
}

const records = {
  fontSize: "12px",
  color: "green",
  fontWeight: "600",
  marginTop: "10px",
};
