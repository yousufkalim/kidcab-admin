import Index from "../views/Index.js";
import Register from "../views/examples/Register.js";
import Login from "../components/Login/Login";
import Tables from "../views/examples/Tables.js";
import Clients from "../views/Clients";
import Passengers from "../views/Passengers/Passengers";
import Drivers from "../views/Drivers/Drivers";
import Invoices from "../views/Invoice/Invoices";
import Quotes from "../views/Quotes/Quotes";
import Vehicles from "../views/Vehicles";
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
    icon: "fa fa-address-book text-blue",
    component: Clients,
    layout: "/admin",
  },
  {
    path: "/passengers",
    name: "Passengers",
    icon: "fa fa-users text-pink",
    component: Passengers,
    layout: "/admin",
  },
  {
    path: "/quotes",
    name: "Quotes",
    icon: "ni ni-ruler-pencil text-info",
    component: Quotes,
    layout: "/admin",
  },
  {
    path: "/tables",
    name: "Companies",
    icon: "ni ni-building text-red",
    component: Tables,
    layout: "/admin",
  },
  {
    path: "/driver",
    name: "Driver",
    icon: "fa fa-id-card text-black",
    component: Drivers,
    layout: "/admin",
  },
  {
    path: "/vehicles",
    name: "Vehicles",
    icon: "fa fa-taxi text-red",
    component: Vehicles,
    layout: "/admin",
  },
  {
    path: "/register",
    name: "Rides",
    icon: "fa fa-calendar text-pink",
    component: Register,
    layout: "/auth",
  },
  {
    path: "/invoice",
    name: "Invoice",
    icon: "fa fa-calendar-check text-yellow",
    component: Invoices,
    layout: "/admin",
  },

  {
    path: "/login",
    name: "Login",
    icon: "ni ni-key-25 text-info",
    component: Login,
    layout: "/auth",
  },
];
export default routes;
