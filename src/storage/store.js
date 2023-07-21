import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth";
import dashboardReducer from "./dashboard";
import outletReducer from "./outlet";
import dailysalesReducer from "./dailysales";
import recordsalesReducer from "./recordsales";
import analysisReducer from "./analysis";
import productReducer from "./productOrder";
import incomingReducer from "./incomingOrder";
import supplyReducer from "./supply";
import regulatoryReducer from "./regulatory";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    dashboard: dashboardReducer,
    outlet: outletReducer,
    dailysales: dailysalesReducer,
    recordsales: recordsalesReducer,
    analysis: analysisReducer,
    productorder: productReducer,
    incomingorder: incomingReducer,
    supply: supplyReducer,
    regulatory: regulatoryReducer,
  },
});
