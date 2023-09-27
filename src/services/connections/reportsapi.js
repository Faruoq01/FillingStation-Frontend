import axios from "axios";
import { store } from "../../storage/store";
import { logout } from "../../storage/logout";
import { setConnection } from "../../storage/auth";
import swal from "sweetalert";
// import config from "../../constants";
const BASE_URL = "https://360station.co/report/";
// const BASE_URL = "http://localhost:4000/";

const ReportsAPI = axios.create({
  baseURL: BASE_URL,
  headers: {
    Accept: "application/json",
    Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
  },
});

ReportsAPI.interceptors.response.use(
  (res) => {
    return res;
  },
  (err) => {
    // network error
    if (err.code === "ERR_NETWORK") {
      store.dispatch(setConnection(false));
    }

    if (err.response.status === 404) {
      swal("Error!", err.response.data.message, "error");
    }

    if (err.response.status === 401) {
      if (err.response.data.message !== "Incorrect password!") {
        if (err.response.data.error.name === "TokenExpiredError") {
          logout();
          swal("Error!", "Your session has expired", "error");
          return;
        }
      }
      swal("Error!", "Incorrect Password", "error");
      logout();
    }
  }
);

export default ReportsAPI;
