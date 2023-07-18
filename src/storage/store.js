import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth";
import dashboardReducer from "./dashboard";
import outletReducer from "./outlet";
import dailysalesReducer from "./dailysales";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    dashboard: dashboardReducer,
    outlet: outletReducer,
    dailysales: dailysalesReducer,
  },
});
