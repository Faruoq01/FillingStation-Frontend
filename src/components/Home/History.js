import { MenuItem, OutlinedInput, Select } from "@mui/material";
import "../../styles/history.scss";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import OutletService from "../../services/360station/outletService";
import { adminOutlet, getAllStations } from "../../storage/outlet";
import { DatePicker } from "antd";
import HistoryService from "../../services/360station/history";
import { ThreeDots } from "react-loader-spinner";
import { historyTags } from "../../storage/auth";
import RemarkCard from "../common/RemarkCard";

const HistoryPage = () => {
  const dispatch = useDispatch();
  const moment = require("moment-timezone");
  const [defaultState, setDefaultState] = useState(0);
  const [defaultState2, setDefaultState2] = useState(0);
  const [date, setDate] = useState(new Date());
  const [loading, setLoading] = useState();
  const user = useSelector((state) => state.auth.user);
  const allOutlets = useSelector((state) => state.outlet.allOutlets);
  const oneStationData = useSelector((state) => state.outlet.adminOutlet);
  const historyTag = useSelector((state) => state.auth.historyTag);
  const [historyData, setHistory] = useState([]);
  const [historyDataCopy, setHistoryCopy] = useState([]);

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
    return user.permission?.incomingOrder[e];
  };

  const getAllIncomingOrder = useCallback(() => {
    if (oneStationData !== null) {
      if (getPerm("0") || getPerm("1") || user.userType === "superAdmin") {
        const findID = allOutlets.findIndex(
          (data) => data._id === oneStationData._id
        );
        setDefaultState(findID + 1);

        const historyDate = moment(new Date(date))
          .format("YYYY-MM-DD HH:mm:ss")
          .split(" ")[0];
        const payload = {
          outletID: oneStationData._id,
          organisationID: resolveUserID().id,
          date: historyDate,
        };

        HistoryService.allRecords(payload).then((data) => {
          setLoading(false);
          setHistory(data.history.history);
          setHistoryCopy(data.history.history);
        });

        return;
      }
    }

    setLoading(true);
    const payload = {
      organisation: resolveUserID().id,
    };

    OutletService.getAllOutletStations(payload)
      .then((data) => {
        dispatch(getAllStations(data.station));
        if (
          (getPerm("0") || user.userType === "superAdmin") &&
          oneStationData === null
        ) {
          if (!getPerm("1")) setDefaultState(1);
          dispatch(adminOutlet(null));
          return "None";
        } else {
          OutletService.getOneOutletStation({ outletID: user.outletID }).then(
            (data) => {
              dispatch(adminOutlet(data.station));
            }
          );

          return user.outletID;
        }
      })
      .then((data) => {
        const historyDate = moment(new Date(date))
          .format("YYYY-MM-DD HH:mm:ss")
          .split(" ")[0];

        const payload = {
          outletID: data,
          organisationID: resolveUserID().id,
          date: historyDate,
        };

        HistoryService.allRecords(payload).then((data) => {
          setLoading(false);
          setHistory(data.history.history);
          setHistoryCopy(data.history.history);
        });
      });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    getAllIncomingOrder();
  }, [getAllIncomingOrder]);

  const changeMenu = (index, item) => {
    // if(!getPerm('1') && item === null) return swal("Warning!", "Permission denied", "info");
    // setLoading(true);
    setLoading(true);
    setDefaultState(index);
    dispatch(adminOutlet(item));

    const historyDate = moment(new Date(date))
      .format("YYYY-MM-DD HH:mm:ss")
      .split(" ")[0];
    const payload = {
      outletID: item,
      organisationID: resolveUserID().id,
      date: historyDate,
    };

    HistoryService.allRecords(payload).then((data) => {
      setLoading(false);
      setHistory(data.history.history);
      setHistoryCopy(data.history.history);
    });
  };

  function onChange(date, dateString) {
    setDate(dateString);
    setLoading(true);

    const historyDate = moment(new Date(dateString))
      .format("YYYY-MM-DD HH:mm:ss")
      .split(" ")[0];

    const payload = {
      outletID: oneStationData === null ? "None" : oneStationData._id,
      organisationID: resolveUserID().id,
      date: historyDate,
    };

    HistoryService.allRecords(payload).then((data) => {
      setLoading(false);
      setHistory(data.history.history);
      setHistoryCopy(data.history.history);
    });
  }

  const getTags = () => {
    const tags = historyData
      .map((item) => item.tag)
      .filter((value, index, self) => self.indexOf(value) === index);
    return tags;
  };

  const changeTagMenu = (index, item) => {
    setDefaultState2(index);
    dispatch(historyTags(item));
  };

  const getHistory = () => {
    if (historyTag === "All tags") {
      return historyData;
    } else {
      const filtered = historyData.filter((data) => data.tag === historyTag);
      return filtered;
    }
  };

  const searchTable = (searchKey) => {
    if (searchKey.length === 0) {
      setHistory(historyDataCopy);
    } else {
      const search = historyDataCopy.filter(
        (data) =>
          !data.name.toUpperCase().indexOf(searchKey.toUpperCase()) ||
          !data.content.toUpperCase().indexOf(searchKey.toUpperCase()) ||
          !data.createdAt.toUpperCase().indexOf(searchKey.toUpperCase())
      );
      setHistory(search);
    }
  };

  return (
    <div className="historyContainer">
      <div className="inner_history">
        <div className="history_controls">
          <DatePicker className="ant-picker-input" onChange={onChange} />
          <div className="outlet_control">
            {true && (
              <Select
                labelId="demo-select-small"
                id="demo-select-small"
                value={defaultState}
                sx={selectStyle2}>
                <MenuItem
                  onClick={() => {
                    changeMenu(0, null);
                  }}
                  style={menu}
                  value={0}>
                  All Stations
                </MenuItem>
                {allOutlets.map((item, index) => {
                  return (
                    <MenuItem
                      key={index}
                      style={menu}
                      onClick={() => {
                        changeMenu(index + 1, item);
                      }}
                      value={index + 1}>
                      {item.outletName + ", " + item.alias}
                    </MenuItem>
                  );
                })}
              </Select>
            )}
            {true || (
              <Select
                labelId="demo-select-small"
                id="demo-select-small"
                value={0}
                sx={selectStyle2}
                disabled>
                <MenuItem style={menu} value={0}>
                  {true
                    ? oneStationData?.outletName + ", " + oneStationData?.alias
                    : "No station created"}
                </MenuItem>
              </Select>
            )}
          </div>
          <div className="second-select">
            <OutlinedInput
              sx={{
                width: "100%",
                height: "35px",
                background: "#EEF2F1",
                fontSize: "12px",
                borderRadius: "0px",
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  border: "1px solid #777777",
                },
              }}
              type="text"
              placeholder="Search"
              onChange={(e) => {
                searchTable(e.target.value);
              }}
            />
          </div>
          <div className="outlet_control">
            {true && (
              <Select
                labelId="demo-select-small"
                id="demo-select-small"
                value={defaultState2}
                sx={selectStyle2}>
                <MenuItem
                  onClick={() => {
                    changeTagMenu(0, "All tags");
                  }}
                  style={menu}
                  value={0}>
                  All tags
                </MenuItem>
                {getTags().map((item, index) => {
                  return (
                    <MenuItem
                      key={index}
                      style={menu}
                      onClick={() => {
                        changeTagMenu(index + 1, item);
                      }}
                      value={index + 1}>
                      {item}
                    </MenuItem>
                  );
                })}
              </Select>
            )}
            {true || (
              <Select
                labelId="demo-select-small"
                id="demo-select-small"
                value={0}
                sx={selectStyle2}
                disabled>
                <MenuItem style={menu} value={0}>
                  {historyTag}
                </MenuItem>
              </Select>
            )}
          </div>
        </div>

        {loading ? (
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
        ) : getHistory().length === 0 ? (
          <div style={place}>No history created</div>
        ) : (
          getHistory().map((item, index) => {
            return <RemarkCard key={index} data={item} />;
          })
        )}
      </div>
    </div>
  );
};

const selectStyle2 = {
  width: "100%",
  height: "35px",
  borderRadius: "0px",
  background: "#F2F1F1B2",
  color: "#000",
  fontSize: "12px",
  outline: "none",
  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
    border: "1px solid #777777",
  },
};

const place = {
  width: "100%",
  display: "flex",
  flexDirection: "row",
  justifyContent: "flex-start",
  fontWeight: "bold",
  fontSize: "14px",
  color: "grey",
};

const menu = {
  fontSize: "12px",
};

export default HistoryPage;
