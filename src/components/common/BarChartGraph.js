import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { useCallback } from "react";
import { useEffect } from "react";
import { Bar } from "react-chartjs-2";
import { Skeleton } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import APIs from "../../services/connections/api";
import { graph } from "../../storage/dailysales";
import { useState } from "react";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const options = {
  plugins: {
    legend: {
      display: false,
    },
  },
  maintainAspectRatio: false,
  scales: {
    x: {
      grid: {
        display: false,
      },
    },
    y: {
      grid: {
        display: false,
      },
    },
  },
};

const BarChartGraph = (props) => {
  const dispatch = useDispatch();
  const moment = require("moment-timezone");
  const date2 = moment().format("YYYY-MM-DD").split(" ")[0];

  const updatedDate = useSelector((state) => state.dailysales.updatedDate);
  const graphData = useSelector((state) => state.dailysales.graph);
  const oneStationData = useSelector((state) => state.outlet.adminOutlet);
  const user = useSelector((state) => state.auth.user);
  const [load, setLoad] = useState(false);

  const resolveUserID = () => {
    if (user.userType === "superAdmin") {
      return { id: user._id };
    } else {
      return { id: user.organisationID };
    }
  };

  const getMonthlyGraphData = useCallback(
    (station) => {
      setLoad(true);
      const getDate = updatedDate === (null || "") ? date2 : updatedDate;
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
        organisationID: resolveUserID().id,
        outletID: station === null ? "None" : station?._id,
        range: range,
      };

      APIs.post("/daily-sales/bargraph", payload)
        .then(({ data }) => {
          console.log(data, "monthly");
          dispatch(graph(data.monthly));
        })
        .then(() => {
          setLoad(false);
        })
        .catch((err) => {
          setLoad(false);
        });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  useEffect(() => {
    getMonthlyGraphData(oneStationData);
  }, [oneStationData, getMonthlyGraphData]);

  return (
    <div className="bar-chart">
      <div className="bar">
        {load ? (
          <Skeleton
            sx={{ borderRadius: "5px", background: "#f7f7f7" }}
            animation="wave"
            variant="rectangular"
            width={"100%"}
            height={300}
          />
        ) : (
          <Bar options={options} data={graphData} />
        )}
      </div>
    </div>
  );
};

export default BarChartGraph;
