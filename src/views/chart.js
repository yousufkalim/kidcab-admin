// Init
import Chart from "chart.js";
import { map } from "jquery";
import * as moment from "moment";

// Function
const chart = (data) => {
  console.log("data in chart", data);
  let setMonday = new Date();
  setMonday.setDate(setMonday.getDate() - ((setMonday.getDay() + 6) % 7)); //set last monday
  let findMonday = setMonday.getTime() - 3024000000; //start monday to the set monday
  let Fir_week = setMonday.getTime() - 604800000; //Fir week
  let S_week = setMonday.getTime() - 1209600000; //second week
  let T_week = setMonday.getTime() - 1814400000; //Third week
  let Fo_week = setMonday.getTime() - 2419200000; //Fourth week
  let Fi_week = findMonday; //Fifth week
  // Line Chart
  let ctx = document.getElementById("lineChart");
  new Chart(ctx, {
    type: "line",
    data: {
      labels: [
        moment(Fi_week).format("YYYY-MM-DD"),
        moment(Fo_week).format("YYYY-MM-DD"),
        moment(T_week).format("YYYY-MM-DD"),
        moment(S_week).format("YYYY-MM-DD"),
        moment(Fir_week).format("YYYY-MM-DD"),
      ],
      datasets: [
        {
          label: ["Week Revenue"],
          data: data.map((i) => {
            return i.client_price;
          }),
          backgroundColor: "rgba(54, 162, 235, 0.2)",
          borderColor: "rgba(54, 162, 235, 1)",
          borderWidth: 2,
          pointRadius: 0,
          hitRadius: 10,
          hoverRadius: 10,
        },
      ],
    },

    // Line Chart options
    options: {
      scales: {
        yAxes: [
          {
            ticks: {
              beginAtZero: true,
              callback: function (value, index, array) {
                return value < 1000 ? value : value / 1000 + "K";
              },
            },
          },
        ],
        xAxes: [
          {
            gridLines: {
              display: false,
            },
            ticks: {
              autoSkip: true,
              maxTicksLimit: 10,
            },
          },
        ],
      },
    },
  });
};

// Export
export default chart;
