import React, { useEffect, useCallback, useState } from "react";
import "../../styles/payments.scss";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { ThreeDots } from "react-loader-spinner";
import { overageType } from "../../storage/dailysales";
import ApproximateDecimal from "../common/approx";
import APIs from "../../services/connections/api";
import { setDipping } from "../../storage/analysis";
import DateRangeLib from "../common/DatePickerLib";
import TableNavigation from "../controls/PageLayout/TableNavigation";
import {
  LeftControls,
  RightControls,
  TableControls,
} from "../controls/PageLayout/TableControls";
import { SearchField } from "../common/searchfields";
import SelectStation from "../common/selectstations";
import ShiftSelect from "../common/shift";
import { LimitSelect } from "../common/customselect";
import { PrintButton } from "../common/buttons";
import GenerateReports from "../Modals/reports";

const mobile = window.matchMedia("(max-width: 1150px)");

const OverageList = () => {
  const dispatch = useDispatch();
  const updateDate = useSelector((state) => state.dashboard.dateRange);
  const dipping = useSelector((state) => state.analysis.dipping);
  const user = useSelector((state) => state.auth.user);
  const [defaultState2, setDefault2] = useState(10);
  const oneStationData = useSelector((state) => state.outlet.adminOutlet);
  const [skip, setSkip] = useState(0);
  const [entries, setEntries] = useState(10);
  const [limit, setLimit] = useState(15);
  const [total] = useState(0);
  const [loading, setLoading] = useState(false);
  const overageTypeData = useSelector((state) => state.dailysales.overageType);
  const salesShift = useSelector((state) => state.dailysales.salesShift);
  const [prints, setPrints] = useState(false);

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
    return user?.permission?.expenses[e];
  };

  const getAllProductData = useCallback((updateDate, outlet, salesShift) => {
    getDippingData(outlet, updateDate, skip, salesShift);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const outlet = oneStationData === null ? "None" : oneStationData._id;
    getAllProductData(updateDate, outlet, salesShift);
  }, [getAllProductData, updateDate, oneStationData, salesShift]);

  const getDippingData = (stationID, date, skip, salesShift) => {
    setLoading(true);
    const [start, end] = date;

    const payload = {
      skip: skip * limit,
      limit: limit,
      outletID: stationID,
      organisationID: resolveUserID().id,
      start: start,
      end: end,
      shift: salesShift,
    };

    APIs.post("/analysis/dipping", payload)
      .then(({ data }) => {
        dispatch(setDipping(data.dipping.dipping));
      })
      .then(() => {
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
      });
  };

  const status = (data) => {
    const total = Number(data.dipping) - Number(data.afterSales);
    if (total === 0) {
      return "None";
    } else if (total < 0) {
      return "Shortage";
    } else {
      return "Overage";
    }
  };

  const getDippingResult = () => {
    const productCategory = dipping.filter(
      (data) => data.productType === overageTypeData
    );
    return productCategory;
  };

  const printReport = () => {
    setPrints(true);
  };

  const entriesMenu = (value, limit) => {
    setEntries(value);
    setLimit(limit);
    const getID = oneStationData === null ? "None" : oneStationData._id;
    getDippingData(getID, updateDate, skip, salesShift);
  };

  const selectedType = (data) => {
    setDefault2(data);
    if (data === 10) {
      dispatch(overageType("PMS"));
    } else if (data === 20) {
      dispatch(overageType("AGO"));
    } else {
      dispatch(overageType("DPK"));
    }
  };

  const stationHelper = (id) => {
    getDippingData(id, updateDate, skip, salesShift);
  };

  const searchTable = (value) => {};

  return (
    <div data-aos="zoom-in-down" className="paymentsCaontainer">
      <div className="inner-pay">
        <TableControls>
          <LeftControls>
            <SearchField ml={"0px"} callback={searchTable} />
            <SelectStation
              ml={"10px"}
              oneStation={getPerm("0")}
              allStation={getPerm("1")}
              callback={stationHelper}
            />
          </LeftControls>
          <RightControls>
            <DateRangeLib mt={mobile.matches ? "10px" : "0px"} />
          </RightControls>
        </TableControls>

        <TableControls mt={"10px"}>
          <LeftControls>
            <LimitSelect entries={entries} entriesMenu={entriesMenu} />
            <ShiftSelect ml={"10px"} />
          </LeftControls>
          <RightControls>
            <Select value={defaultState2} sx={selectMe}>
              <MenuItem
                value={10}
                onClick={() => {
                  selectedType(10);
                }}
                sx={menu}>
                PMS
              </MenuItem>
              <MenuItem
                value={20}
                onClick={() => {
                  selectedType(20);
                }}
                sx={menu}>
                AGO
              </MenuItem>
              <MenuItem
                value={30}
                onClick={() => {
                  selectedType(30);
                }}
                sx={menu}>
                DPK
              </MenuItem>
            </Select>
            <PrintButton callback={printReport} />
          </RightControls>
        </TableControls>

        <div style={{ marginTop: "10px" }} className="table-container">
          <div className="table-head">
            <div className="column">S/N</div>
            <div className="column">Date Created</div>
            <div className="column">Current stock</div>
            <div className="column">Dipping Level</div>
            <div className="column">Difference</div>
            <div className="column">Status</div>
          </div>

          <div className="row-container">
            {!loading ? (
              getDippingResult().length === 0 ? (
                <div style={place}>No Shortage/Overage</div>
              ) : (
                getDippingResult().map((data, index) => {
                  return (
                    <div className="table-head2">
                      <div className="column">{index + 1}</div>
                      <div className="column">{data.createdAt}</div>
                      <div className="column">
                        {ApproximateDecimal(Number(data.afterSales))}
                      </div>
                      <div className="column">{data.dipping}</div>
                      <div className="column">
                        {ApproximateDecimal(
                          Number(data.dipping) - Number(data.afterSales)
                        )}
                      </div>
                      <div className="column">
                        <span
                          style={status(data) === "Shortage" ? short2 : short}>
                          {status(data)}
                        </span>
                      </div>
                    </div>
                  );
                })
              )
            ) : (
              <div style={load}>
                <ThreeDots
                  height="60"
                  width="50"
                  radius="9"
                  color="#076146"
                  ariaLabel="three-dots-loading"
                  wrapperStyle={{}}
                  wrapperClassName=""
                  visible={true}
                />
              </div>
            )}
          </div>
        </div>

        <TableNavigation
          skip={skip}
          limit={limit}
          total={total}
          setSkip={setSkip}
          updateDate={updateDate}
          callback={getDippingData}
          salesShift={salesShift}
        />

        {prints && (
          <GenerateReports
            open={prints}
            close={setPrints}
            section={"overage"}
            data={dipping}
          />
        )}
      </div>
    </div>
  );
};

const selectMe = {
  height: "30px",
  borderRadius: "0px",
  background: "#F2F1F1B2",
  color: "#000",
  fontSize: "12px",
  outline: "none",
  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
    border: "1px solid #777777",
  },
};

const short = {
  width: "80px",
  height: "28px",
  background: "rgba(13, 108, 234, 0.12)",
  color: "#0D6CEA",
  fontSize: "12px",
  borderRadius: "10px",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

const short2 = {
  width: "80px",
  height: "28px",
  background: "rgba(223, 5, 5, 0.12)",
  color: "#DF0505",
  fontSize: "12px",
  borderRadius: "10px",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

const place = {
  width: "100%",
  textAlign: "center",
  fontSize: "12px",
  marginTop: "20px",
  color: "green",
};

const menu = {
  fontSize: "12px",
  fontFamily: "Poppins",
};

const load = {
  width: "100%",
  height: "30px",
  display: "flex",
  justifyContent: "center",
};

export default OverageList;
