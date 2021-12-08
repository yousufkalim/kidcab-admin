// Init
import axios from "axios";
import { toast } from "react-toastify";
import { removeToken } from "../variables/auth";

const api = async (method = "get", uri, body) => {
  // Default setting for production
  if (window.location.hostname === "localhost") {
    axios.defaults.baseURL = "http://localhost:5000/";
  } else {
    axios.defaults.withCredentials = true;
    axios.defaults.baseURL = "https://kidcab.falconit.com.pk/";
  }

  // API Call
  const url = "api/" + uri;
  return new Promise((resolve, reject) => {
    axios[method](url, body)
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        if (err?.response?.status === 401) {
          removeToken();
          toast.warning("Token is expired Please Login Again");
          window.location = "/login";
        } else {
          toast.error(err?.response?.data ? err.response.data : err?.message);
          reject(err);
        }
      });
  });
};

// Export
export default api;
