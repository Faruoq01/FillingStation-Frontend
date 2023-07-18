import React, { useRef, useEffect } from "react";
import Tooltip from "@mui/material/Tooltip";
import { useSelector } from "react-redux";
import ApproximateDecimal from "../common/approx";

const TankComponent = (props) => {
  const canvas = useRef();
  const fuel = useRef();
  // const cummulativeTotals = useSelector(state => state.dailySalesReducer.cummulative);

  useEffect(() => {
    createTankCanvas(0, 33000, 200);
  }, []);

  const createTankCanvas = (level, capacity, deadstock) => {
    let dpi = window.devicePixelRatio;
    let step = Math.floor((capacity - deadstock) / 10);
    let current = (300 * level) / capacity;

    const drawLine = (height, label) => {
      ctx.beginPath();
      ctx.moveTo(50 * dpi, (height + 3) * dpi);
      ctx.lineWidth = 1 * dpi;
      ctx.lineTo(70 * dpi, (height + 3) * dpi);
      ctx.stroke();

      ctx.fillStyle = "#000";
      ctx.font = `${10 * dpi}px Arial`;
      ctx.fillText(label, 10 * dpi, (height + 8) * dpi);
    };

    const drawSmallLine = (height) => {
      ctx.beginPath();
      ctx.moveTo(65 * dpi, (height + 3) * dpi);
      ctx.lineWidth = 1;
      ctx.lineTo(70 * dpi, (height + 3) * dpi);
      ctx.stroke();
    };

    const ctx = canvas.current.getContext("2d");

    let style_height = +getComputedStyle(canvas.current)
      .getPropertyValue("height")
      .slice(0, -2);
    let style_width = +getComputedStyle(canvas.current)
      .getPropertyValue("width")
      .slice(0, -2);

    canvas.current.setAttribute("height", style_height * dpi);
    canvas.current.setAttribute("width", style_width * dpi);

    // ctx.beginPath();
    // ctx.strokeRect(70*dpi, 0*dpi, 78*dpi, 300*dpi);

    let label = capacity;
    for (let i = 0; i < 300; i = i + 30) {
      drawLine(i, label);
      label = label - step;
    }

    for (let i = 0; i < 300; i = i + 6) {
      drawSmallLine(i);
    }

    ctx.fillStyle = "#35393E";

    ctx.fillStyle = "#FFA010";
    fuel.current.style.marginLeft = `70px`;
    fuel.current.style.marginTop = `${300 - current}px`;
    fuel.current.style.width = `75px`;
    fuel.current.style.height = `${current}px`;
    fuel.current.style.background = "#35393E";
  };

  return (
    <div className="canvases">
      <Tooltip title={`${ApproximateDecimal(0)} Litres`} followCursor>
        <div>
          <div className="fuel-container">
            <canvas
              style={{ width: "150px", height: "300px" }}
              ref={canvas}></canvas>
          </div>
          <div className="fuel2"></div>
          <div ref={fuel} className="fuel"></div>
        </div>
      </Tooltip>
    </div>
  );
};

export default TankComponent;
