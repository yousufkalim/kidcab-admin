import Index from "../views/Index.js";
import Login from "../components/Login/Login";
import Clients from "../views/Clients";
import Passengers from "../views/Passengers/Passengers";
import Drivers from "../views/Drivers/Drivers";
import Invoices from "../views/Invoice/Invoices";
import Quotes from "../views/Quotes/Quotes";
import Vehicles from "../views/Vehicles";
import Companies from "../views/Companies/";
import Trips from "../views/Trips/Trips";

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
    path: "/companies",
    name: "Companies",
    icon: "ni ni-building text-red",
    component: Companies,
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
    icon: "fa fa-taxi text-green",
    component: Vehicles,
    layout: "/admin",
  },
  {
    path: "/trips",
    name: "Trips",
    icon: "fa fa-calendar text-pink",
    component: Trips,
    layout: "/admin",
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
