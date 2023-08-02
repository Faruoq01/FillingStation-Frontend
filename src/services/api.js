import axios from "axios";
import { store } from "../storage/store";
import { logout } from "../storage/logout";
import { setConnection } from "../storage/auth";
import swal from "sweetalert";
import config from "../constants";

const APIs = axios.create({
  baseURL: `${config.BASE_URL}/360-station/api`,
  headers: {
    Accept: "application/json",
    Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
  },
});

APIs.interceptors.response.use(
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
          window.location.href = "/login";
          return;
        }
      }

      swal("Error!", "Incorrect Password", "error");
      logout();
    }
  }
);

export default APIs;
