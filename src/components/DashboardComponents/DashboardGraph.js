import { Button, Skeleton, Stack } from "@mui/material";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { useState } from "react";
import { useEffect } from "react";
import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import ButtonDatePicker from "../common/CustomDatePicker";
import APIs from "../../services/api";
import { weekly, monthly, annually, yearList } from "../../storage/dashboard";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const monthlyLabels = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const weekLabels = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const options = {
  plugins: {
    legend: {
      display: false,
    },
  },
  maintainAspectRatio: false,
  scales: {
    x: {
      min: 0,
    },
    y: {
      min: 0,
    },
  },
};

const DashboardGraph = (props) => {
  const moment = require("moment-timezone");
  const date2 = moment().format("YYYY-MM-DD").split(" ")[0];
  const [value, setValue] = useState(null);

  const graph = useSelector((state) => state.dashboard.graph);
  const annualLabel = useSelector((state) => state.dashboard.yearList);
  const [load, setLoad] = useState(false);
  const oneStationData = useSelector((state) => state.outlet.adminOutlet);
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  console.log(graph, "graph");
  const [currentSelection, setCurrentSelection] = useState(1);

  const setWeeklyData = () => {
    const weeklyData = {
      labels: weekLabels,
      datasets: [
        {
          label: "AGO",
          borderColor: "#399A19",
          data: graph.weekly.pms,
        },
        {
          label: "PMS",
          borderColor: "#FFA010",
          data: graph.weekly.ago,
        },
        {
          label: "DPK",
          borderColor: "#000",
          data: graph.weekly.dpk,
        },
      ],
    };

    return weeklyData;
  };

  const setMonthlyData = () => {
    const monthlyData = {
      labels: monthlyLabels,
      datasets: [
        {
          label: "AGO",
          borderColor: "#399A19",
          data: graph.monthly.pms,
        },
        {
          label: "PMS",
          borderColor: "#FFA010",
          data: graph.monthly.ago,
        },
        {
          label: "DPK",
          borderColor: "#000",
          data: graph.monthly.dpk,
        },
      ],
    };

    return monthlyData;
  };

  const setAnnualData = () => {
    const annualData = {
      labels: annualLabel,
      datasets: [
        {
          label: "AGO",
          borderColor: "#399A19",
          data: graph.annually.pms,
        },
        {
          label: "PMS",
          borderColor: "#FFA010",
          data: graph.annually.ago,
        },
        {
          label: "DPK",
          borderColor: "#000",
          data: graph.annually.dpk,
        },
      ],
    };

    return annualData;
  };

  const resolveUserID = () => {
    if (user.userType === "superAdmin") {
      return { id: user._id };
    } else {
      return { id: user.organisationID };
    }
  };

  const updateDate = async (newValue) => {
    setValue(newValue);
  };

  function getUpcomingSunday(data) {
    const end = moment(data)
      .endOf("week")
      .format("YYYY-MM-DD HH:mm:ss")
      .split(" ")[0];
    return end;
  }

  function getLastSunday(data) {
    const last = moment(data)
      .startOf("week")
      .format("YYYY-MM-DD HH:mm:ss")
      .split(" ")[0];
    return last;
  }

  const getAllDatesBetween = (startDateString, endDateString) => {
    const dateFormat = "YYYY-MM-DD";
    const startDate = moment(startDateString, dateFormat);
    const endDate = moment(endDateString, dateFormat);
    const dates = [];

    while (startDate.isSameOrBefore(endDate)) {
      dates.push(startDate.format(dateFormat));
      startDate.add(1, "day");
    }

    return dates;
  };

  const getWeeklyGraphData = useCallback((date, station) => {
    setLoad(true);
    const getDate = date === null ? date2 : date.format("YYYY-MM-DD");
    const firstDayOfTheWeek = getLastSunday(getDate);
    const lastDayOfTheWeek = getUpcomingSunday(getDate);
    const range = getAllDatesBetween(firstDayOfTheWeek, lastDayOfTheWeek);

    const payload = {
      organisation: resolveUserID().id,
      outletID: station === null ? "None" : station?._id,
      range: range,
    };

    APIs.post("/dashboard/weekly", payload)
      .then(({ data }) => {
        dispatch(weekly(data.weekly.weekly));
      })
      .then(() => {
        setLoad(false);
      })
      .catch((err) => {
        setLoad(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getMonthlyGraphData = useCallback(
    (date, station) => {
      const getDate = date === null ? date2 : date.format("YYYY-MM-DD");
      const getYear = moment(getDate).format("YYYY");
      const range = [];

      for (let month = 0; month < 12; month++) {
        const startDate = moment({ getYear, month })
          .startOf("month")
          .format("YYYY-MM-DD");
        const endDate = moment({ getYear, month })
          .endOf("month")
          .format("YYYY-MM-DD");

        range.push({ start: startDate, end: endDate });
      }

      const payload = {
        organisation: resolveUserID().id,
        outletID: station === null ? "None" : station?._id,
        range: range,
      };

      APIs.post("/dashboard/monthly", payload)
        .then(({ data }) => {
          dispatch(monthly(data.monthly.monthly));
        })
        .catch((err) => {});
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const getAnnualGraphData = useCallback(
    (date, station) => {
      const getDate = date === null ? date2 : date.format("YYYY-MM-DD");
      const getYear = moment(getDate).format("YYYY");
      const startYear = Number(getYear) - 5;
      const endYear = Number(getYear) + 5;
      const yearSet = [];
      const range = [];
      for (let i = startYear; i <= endYear; i++) {
        yearSet.push(i);
      }

      for (let year of yearSet) {
        const startDate = moment({ year, month: 0 })
          .startOf("year")
          .format("YYYY-MM-DD");
        const endDate = moment({ year, month: 11 })
          .endOf("year")
          .format("YYYY-MM-DD");

        range.push({ start: startDate, end: endDate });
      }
      dispatch(yearList(yearSet));

      const payload = {
        organisation: resolveUserID().id,
        outletID: station === null ? "None" : station?._id,
        range: range,
      };

      APIs.post("/dashboard/annually", payload)
        .then(({ data }) => {
          dispatch(annually(data.annually.annually));
        })
        .catch((err) => {});
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  useEffect(() => {
    getWeeklyGraphData(value, oneStationData);
    getMonthlyGraphData(value, oneStationData);
    getAnnualGraphData(value, oneStationData);
  }, [
    oneStationData,
    getWeeklyGraphData,
    value,
    getMonthlyGraphData,
    getAnnualGraphData,
  ]);

  const convertDate = (newValue) => {
    const getDate = newValue.format("MM/DD/YYYY");
    const date = new Date(getDate);
    const toString = date.toDateString();
    const [day, year, month] = toString.split(" ");
    const finalDate = `${day} ${month} ${year}`;

    return finalDate;
  };

  const switchGraphTab = (type) => {
    switch (type) {
      case "week": {
        setCurrentSelection(1);
        getWeeklyGraphData(value, oneStationData);
        break;
      }

      case "month": {
        setCurrentSelection(2);
        getMonthlyGraphData(value, oneStationData);
        break;
      }

      case "year": {
        setCurrentSelection(3);
        getAnnualGraphData(value, oneStationData);
        break;
      }

      default: {
      }
    }
  };

  const getDataDetails = () => {
    if (currentSelection === 1) return setWeeklyData();
    if (currentSelection === 2) return setMonthlyData();
    if (currentSelection === 3) return setAnnualData();
  };

  return (
    <div style={{ marginTop: "10px" }} className="dash-records">
      {load ? (
        <Skeleton
          sx={{ borderRadius: "5px", background: "#f7f7f7" }}
          animation="wave"
          variant="rectangular"
          width={"100%"}
          height={450}
        />
      ) : (
        <div className="padding-container">
          <div className="week">
            <div className="butts">
              <Button
                onClick={() => {
                  switchGraphTab("week");
                }}
                sx={currentSelection === 1 ? activeButton : inActive}
                variant="contained">
                {" "}
                Week{" "}
              </Button>
              <Button
                onClick={() => {
                  switchGraphTab("month");
                }}
                sx={currentSelection === 2 ? activeButton : inActive}
                variant="contained">
                {" "}
                Month{" "}
              </Button>
              <Button
                onClick={() => {
                  switchGraphTab("year");
                }}
                sx={currentSelection === 3 ? activeButton : inActive}
                variant="contained">
                {" "}
                Year{" "}
              </Button>
            </div>

            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <Stack spacing={1}>
                <ButtonDatePicker
                  label={`${value == null || "" ? date2 : convertDate(value)}`}
                  value={value}
                  onChange={(newValue) => updateDate(newValue)}
                />
              </Stack>
            </LocalizationProvider>
          </div>
          <div className="type">
            <div className="single-type">
              <div className="color"></div>
              <div className="name">PMS</div>
            </div>
            <div style={{ marginLeft: "10px" }} className="single-type">
              <div style={{ background: "#FFA010" }} className="color"></div>
              <div className="name">AGO</div>
            </div>
            <div style={{ marginLeft: "10px" }} className="single-type">
              <div style={{ background: "#35393E" }} className="color"></div>
              <div className="name">DPK</div>
            </div>
          </div>
          <div className="graph">
            <Line options={options} data={getDataDetails()} />
          </div>
        </div>
      )}
    </div>
  );
};

const activeButton = {
  width: "50px",
  height: "30px",
  background: "#06805B",
  fontSize: "10px",
  borderRadius: "0px",
  "&:hover": {
    backgroundColor: "#06805B",
  },
};

const inActive = {
  width: "50px",
  height: "30px",
  background: "#C1CABE",
  fontSize: "10px",
  color: "#000",
  borderRadius: "0px",
  "&:hover": {
    backgroundColor: "#C1CABE",
  },
};

export default DashboardGraph;
