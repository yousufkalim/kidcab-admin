import React from "react";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import { StoreProvider } from "./StoreContext";
import "assets/plugins/nucleo/css/nucleo.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "assets/scss/argon-dashboard-react.scss";
import "react-toastify/dist/ReactToastify.css";

import AdminLayout from "layouts/Admin.js";
import AuthLayout from "layouts/Auth.js";
import { ToastContainer, Flip } from "react-toastify";

const App = () => {
  return (
    <>
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
