import React from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet } from "react-router-dom";
import { dateRange } from "../../storage/dashboard";

const DailySales = () => {
  const dispatch = useDispatch();
  const updatedDate = useSelector((state) => state.dashboard.dateRange);

  useEffect(() => {
    dispatch(dateRange([updatedDate[0], updatedDate[0]]));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <React.Fragment>
      <Outlet />
    </React.Fragment>
  );
};

export default DailySales;
