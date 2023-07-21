import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth";
import dashboardReducer from "./dashboard";
import outletReducer from "./outlet";
import dailysalesReducer from "./dailysales";
import recordsalesReducer from "./recordsales";
import analysisReducer from "./analysis";
import productReducer from "./productOrder";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    dashboard: dashboardReducer,
    outlet: outletReducer,
    dailysales: dailysalesReducer,
    recordsales: recordsalesReducer,
    analysis: analysisReducer,
    productorder: productReducer,
  },
});
