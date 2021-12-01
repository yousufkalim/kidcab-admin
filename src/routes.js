import Index from "views/Index.js";
import Register from "views/examples/Register.js";
import Login from "components/Login/Login";
import Tables from "views/examples/Tables.js";
import Clients from "./views/Clients";
import Passengers from "./views/Passengers/Passengers";
import Drivers from "./views/Drivers/Drivers";
import AdminProfile from "views/AdminProfile";
import Invoices from "./views/Invoice/Invoices";

var routes = [
  {
    path: "/index",
    name: "Dashboard",
    icon: "ni ni-tv-2 text-primary",
    component: Index,
    layout: "/admin",
  },
  {
    path: "/clients",
    name: "Clients",
    icon: "ni ni-single-02 text-blue",
    component: Clients,
    layout: "/admin",
  },
  {
    path: "/passengers",
    name: "Passengers",
    icon: "ni ni-single-02 text-pink",
    component: Passengers,
    layout: "/admin",
  },
  {
    path: "/driver",
    name: "Driver",
    icon: "ni ni-single-02 text-orange",
    component: Drivers,
    layout: "/admin",
  },
  {
    path: "/invoice",
    name: "Invoice",
    icon: "ni ni-single-02 text-yellow",
    component: Invoices,
    layout: "/admin",
  },
  {
    path: "/tables",
    name: "Companies",
    icon: "ni ni-bullet-list-67 text-red",
    component: Tables,
    layout: "/admin",
  },
  {
    path: "/tables",
    name: "Vehicles",
    icon: "ni ni-bullet-list-67 text-red",
    component: Tables,
    layout: "/admin",
  },
  {
    path: "/login",
    name: "Quotes",
    icon: "ni ni-key-25 text-info",
    component: Login,
    layout: "/auth",
  },
  {
    path: "/register",
    name: "Rides",
    icon: "ni ni-circle-08 text-pink",
    component: Register,
    layout: "/auth",
  },
];
export default routes;
