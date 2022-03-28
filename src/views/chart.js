// Init
import Chart from "chart.js";
import { map } from "jquery";
import * as moment from "moment";

// Function
const chart = (data) => {
  console.log("data in chart", data);
  // Line Chart
  let ctx = document.getElementById("lineChart");
  new Chart(ctx, {
    type: "line",
    data: {
      labels: ["week1", "week2", "week3", "week4", "week5"],
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
