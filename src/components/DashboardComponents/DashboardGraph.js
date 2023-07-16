import { Button, Skeleton, Stack } from "@mui/material";
import { Line } from "react-chartjs-2";
import DashboardService from "../../services/dashboard";
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
import { useRef, useState } from "react";
import { useEffect } from "react";
import { useCallback } from "react";
import { useSelector } from "react-redux";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import ButtonDatePicker from "../common/CustomDatePicker";
import APIs from "../../services/api";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const labels = [
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

const annualLabels = [
  "2017",
  "2018",
  "2019",
  "2020",
  "2021",
  "2022",
  "2023",
  "2024",
  "2025",
  "2026",
  "2027",
];

const weeklyData = {
  labels: weekLabels,
  datasets: [
    {
      label: "AGO",
      borderColor: "#399A19",
      data: [0, 0, 0, 0, 0, 0, 0],
    },
    {
      label: "PMS",
      borderColor: "#FFA010",
      data: [0, 0, 0, 0, 0, 0, 0],
    },
    {
      label: "DPK",
      borderColor: "#000",
      data: [0, 0, 0, 0, 0, 0, 0],
    },
  ],
};

const monthlyData = {
  labels: labels,
  datasets: [
    {
      label: "AGO",
      borderColor: "#399A19",
      data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    },
    {
      label: "PMS",
      borderColor: "#FFA010",
      data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    },
    {
      label: "DPK",
      borderColor: "#000",
      data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    },
  ],
};

const annualData = {
  labels: annualLabels,
  datasets: [
    {
      label: "AGO",
      borderColor: "#399A19",
      data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    },
    {
      label: "PMS",
      borderColor: "#FFA010",
      data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    },
    {
      label: "DPK",
      borderColor: "#000",
      data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    },
  ],
};

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

  const [weeklyDataSet, setWeeklyDataSet] = useState(weeklyData);
  const [monthlyDataSet, setMonthlyDataSet] = useState(monthlyData);
  const [annualDataSet, setAnnualDataSet] = useState(annualData);
  const [load, setLoad] = useState(false);
  const oneStationData = useSelector((state) => state.outlet.adminOutlet);
  const user = useSelector((state) => state.auth.user);

  const [currentSelection, setCurrentSelection] = useState(0);

  const resolveUserID = () => {
    if (user.userType === "superAdmin") {
      return { id: user._id };
    } else {
      return { id: user.organisationID };
    }
  };

  const updateDate = async (newValue) => {
    setValue(newValue);

    const getDate = newValue.format("YYYY-MM-DD");

    const firstDayOfTheWeek = getLastSunday(getDate);
    const lastDayOfTheWeek = getUpcomingSunday(getDate);

    const payload = {
      organisation: resolveUserID().id,
      outletID: oneStationData === null ? "None" : oneStationData?._id,
      startRange: firstDayOfTheWeek,
      endRange: lastDayOfTheWeek,
    };

    DashboardService.getWeeklyDataFromApi(payload).then((data) => {
      analyseWeeklyData(data);
    });
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

  function getFirstAndLastDayOfTheYear() {
    const currentYear = new Date().getFullYear();
    const firstDay = new Date(currentYear, 0, 1).toLocaleDateString();
    const year = firstDay.split("/")[2];

    const firstRange = moment([year])
      .format("YYYY-MM-DD HH:mm:ss")
      .split(" ")[0];
    const secondRange = moment([year])
      .endOf("year")
      .format("YYYY-MM-DD HH:mm:ss")
      .split(" ")[0];

    return { firstDay: firstRange, lastDay: secondRange };
  }

  function getYearRange() {
    const currentYear = new Date().getFullYear();
    const firstDay = new Date(currentYear, 0, 1).toLocaleDateString();
    const year = firstDay.split("/")[2];

    const firstRange = moment([year])
      .format("YYYY-MM-DD HH:mm:ss")
      .split(" ")[0];
    const secondRange = moment([year])
      .endOf("year")
      .format("YYYY-MM-DD HH:mm:ss")
      .split(" ")[0];

    return { firstRange: firstRange, secondRange: secondRange };
  }

  const analyseWeeklyData = (data) => {
    const weeklyData = {
      labels: weekLabels,
      datasets: [
        {
          label: "AGO",
          borderColor: "#FFA010",
          data: graph.weekly.pms,
        },
        {
          label: "PMS",
          borderColor: "#399A19",
          data: graph.weekly.ago,
        },
        {
          label: "DPK",
          borderColor: "#000",
          data: graph.weekly.dpk,
        },
      ],
    };
    setWeeklyDataSet(weeklyData);
  };

  const analyseMonthlyData = (data) => {
    const monthlyData = {
      labels: labels,
      datasets: [
        {
          label: "AGO",
          borderColor: "#FFA010",
          data: graph.monthly.ago,
        },
        {
          label: "PMS",
          borderColor: "#399A19",
          data: graph.monthly.pms,
        },
        {
          label: "DPK",
          borderColor: "#000",
          data: graph.monthly.dpk,
        },
      ],
    };

    setMonthlyDataSet(monthlyData);
  };

  const analyseAnnualData = (data, range) => {
    const years = [];
    const getTheYear = range.firstRange.split("-")[0];

    const firstRange = Number(getTheYear) - 5;
    const lastRangeRange = Number(getTheYear) + 5;

    for (let i = firstRange; i <= lastRangeRange; i++) {
      years.push(i);
    }

    const annualData = {
      labels: years,
      datasets: [
        {
          label: "AGO",
          borderColor: "#FFA010",
          data: graph.annually.pms,
        },
        {
          label: "PMS",
          borderColor: "#399A19",
          data: graph.annually.ago,
        },
        {
          label: "DPK",
          borderColor: "#000",
          data: graph.annually.dpk,
        },
      ],
    };

    setAnnualDataSet(annualData);
  };

  const getWeeklyGraphData = useCallback((date, station) => {
    // setLoad(true);
    const getDate = date === null ? date2 : date.format("YYYY-MM-DD");
    const firstDayOfTheWeek = getLastSunday(getDate);
    const lastDayOfTheWeek = getUpcomingSunday(getDate);

    const payload = {
      organisation: resolveUserID().id,
      outletID: station === null ? "None" : station?._id,
      start: firstDayOfTheWeek,
      end: lastDayOfTheWeek,
    };

    APIs.post("/dashboard/weekly", payload)
      .then(({ data }) => {
        console.log(data, "data");
      })
      .then(() => {
        setLoad(false);
      })
      .catch((err) => {
        setLoad(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    getWeeklyGraphData(value, oneStationData);
  }, [oneStationData, getWeeklyGraphData, value]);

  const getAllCurrentWeekData = useCallback(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getAllWeeklyData = () => {
    const gate = new Date();
    const firstDayOfTheWeek = getLastSunday(gate);
    const lastDayOfTheWeek = getUpcomingSunday(gate);

    const payload = {
      organisation: resolveUserID().id,
      outletID: oneStationData === null ? "None" : oneStationData?._id,
      startRange: firstDayOfTheWeek,
      endRange: lastDayOfTheWeek,
    };

    DashboardService.getWeeklyDataFromApi(payload).then((data) => {
      analyseWeeklyData(data);
    });
  };

  const getAllMonthlyData = () => {
    const dateRange = getFirstAndLastDayOfTheYear();

    const payload = {
      organisation: resolveUserID().id,
      outletID: oneStationData === null ? "None" : oneStationData?._id,
      startRange: dateRange.firstDay,
      endRange: dateRange.lastDay,
    };

    DashboardService.getMonthlyDataFromApi(payload).then((data) => {
      analyseMonthlyData(data);
    });
  };

  const getAllAnnualData = () => {
    const dateRange = getYearRange();

    const payload = {
      organisation: resolveUserID().id,
      outletID: oneStationData === null ? "None" : oneStationData?._id,
      startRange: dateRange.firstRange,
      endRange: dateRange.secondRange,
    };

    DashboardService.getAnnualDataFromApi(payload).then((data) => {
      analyseAnnualData(data, dateRange);
    });
  };

  const switchGraphTab = (data) => {
    switch (data) {
      case "week": {
        setCurrentSelection(0);
        getAllWeeklyData();
        break;
      }

      case "month": {
        setCurrentSelection(1);
        getAllMonthlyData();
        break;
      }

      case "year": {
        setCurrentSelection(2);
        getAllAnnualData();
        break;
      }
      default: {
      }
    }
  };

  useEffect(() => {
    // setCurrentDate(date2);

    getAllCurrentWeekData();
  }, [getAllCurrentWeekData]);

  const convertDate = (newValue) => {
    const getDate = newValue.format("MM/DD/YYYY");
    const date = new Date(getDate);
    const toString = date.toDateString();
    const [day, year, month] = toString.split(" ");
    const finalDate = `${day} ${month} ${year}`;

    return finalDate;
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
                sx={currentSelection === 0 ? activeButton : inActive}
                variant="contained">
                {" "}
                Week{" "}
              </Button>
              <Button
                onClick={() => {
                  switchGraphTab("month");
                }}
                sx={currentSelection === 1 ? activeButton : inActive}
                variant="contained">
                {" "}
                Month{" "}
              </Button>
              <Button
                onClick={() => {
                  switchGraphTab("year");
                }}
                sx={currentSelection === 2 ? activeButton : inActive}
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
            <Line
              options={options}
              data={
                currentSelection === 0
                  ? weeklyDataSet
                  : currentSelection === 1
                  ? monthlyDataSet
                  : currentSelection
                  ? annualDataSet
                  : []
              }
            />
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
