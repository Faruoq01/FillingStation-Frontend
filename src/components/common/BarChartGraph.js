import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { useState } from "react";
import { useEffect } from "react";
import { Bar } from "react-chartjs-2";
import { Skeleton } from "@mui/material";
import { useSelector } from "react-redux";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
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

export const monthlyData = {
  labels,
  datasets: [
    {
      label: "Dataset 1",
      data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      backgroundColor: "#06805B",
    },
    {
      label: "Dataset 2",
      data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      backgroundColor: "#108CFF",
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
  const [monthlyDataSet, setMonthlyDataSet] = useState(monthlyData);

  return (
    <div className="bar-chart">
      <div className="bar">
        {props.load ? (
          <Skeleton
            sx={{ borderRadius: "5px", background: "#f7f7f7" }}
            animation="wave"
            variant="rectangular"
            width={"100%"}
            height={300}
          />
        ) : (
          <Bar options={options} data={monthlyDataSet} />
        )}
      </div>
    </div>
  );
};

export default BarChartGraph;
