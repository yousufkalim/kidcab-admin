import React, { useEffect } from "react";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import { StoreProvider } from "./StoreContext";
import "assets/plugins/nucleo/css/nucleo.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "assets/scss/argon-dashboard-react.scss";
import "react-toastify/dist/ReactToastify.css";
import AdminLayout from "layouts/Admin.js";
import AuthLayout from "layouts/Auth.js";
import { ToastContainer, Flip } from "react-toastify";
import { io } from "socket.io-client";
import { baseUrl } from "config";
import "./utils/i18n";
import { useTranslation } from "react-i18next";
export const socket = io(baseUrl);

// client-side

const App = () => {
  const { i18n, t } = useTranslation();
  const { language } = i18n;

  useEffect(() => {
    const { host } = window.location;
    if (host === "www.kidcab.com") {
      i18n.changeLanguage("fr");
    }
  }, []);
  useEffect(() => {
    socket.on("connect", () => {
      console.log("Socket Connected");
    });

    socket.on("disconnect", () => {
      console.log("Socket Disconnected");
    });
  }, []);
  return (
    <>
      {/* <div
        onClick={() => {
          if (language === "fr") {
            i18n.changeLanguage("en");
          } else {
            i18n.changeLanguage("fr");
          }
        }}
        style={{
          width: "20px",
          height: "20px",
          background: "red",
          position: "absolute",
          top: "100px",
          left: "200px",
          zIndex: "999999999",
        }}
      ></div> */}
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={true}
        transition={Flip}
      />
      <BrowserRouter>
        <StoreProvider>
          <Switch>
            <Route
              path="/admin"
              render={(props) => <AdminLayout {...props} />}
            />
            <Route path="/auth" render={(props) => <AuthLayout {...props} />} />

            <Redirect from="/" to="/admin/index" />
          </Switch>
        </StoreProvider>
      </BrowserRouter>
    </>
  );
};

export default App;
